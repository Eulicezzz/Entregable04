import { useState, useEffect } from 'react';
import './Tramites.css'; // Asegúrate de importar el archivo de estilos

function TramiteForm({ onRegistroExitoso }) {
  const [tiposTramite, setTiposTramite] = useState([]);
  const [formData, setFormData] = useState({
    id_ciudadano: '',
    tipo_tramite: '',
    descripcion: '',
    documentacion_completa: 0,
    reclamos_previos: 0,
    estado_actual: 'Pendiente',
    fecha_ingreso: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tipos-tramite')
      .then((res) => res.json())
      .then((data) => setTiposTramite(data))
      .catch((err) => console.error("Error al cargar:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tramites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Trámite registrado con éxito');
        onRegistroExitoso();
      }
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  return (
    // Aplicamos la clase 'card' que definimos en el CSS
    <div className="card">
      <h3 style={{ marginTop: '0', color: '#2c3e50' }}>Registrar Nuevo Trámite</h3>
      <form onSubmit={handleSubmit} className="tramite-form">
        
        <div className="form-group">
          <label>ID Ciudadano</label>
          <input className="input-field" type="number" min="0" required onChange={(e) => setFormData({...formData, id_ciudadano: parseInt(e.target.value)})} />
        </div>
        
        <div className="form-group">
          <label>Tipo de Trámite:</label>
          <select className="input-field" required onChange={(e) => setFormData({...formData, tipo_tramite: e.target.value})}>
            <option value="">Seleccione...</option>
            {Array.isArray(tiposTramite) && tiposTramite.map((tipo, index) => (
              <option key={index} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea className="input-field" placeholder="Breve descripción..." onChange={(e) => setFormData({...formData, descripcion: e.target.value})} />
        </div>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>¿Documentación completa?</label>
            <select className="input-field" onChange={(e) => setFormData({...formData, documentacion_completa: parseInt(e.target.value)})}>
              <option value="0">No</option>
              <option value="1">Sí</option>
            </select>
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label>Reclamos Previos:</label>
            <input className="input-field" type="number" min="0" defaultValue="0" onChange={(e) => setFormData({...formData, reclamos_previos: parseInt(e.target.value)})} />
          </div>
        </div>
        
        <button type="submit" className="btn-primary">Guardar Trámite</button>
      </form>
    </div>
  );
}

export default TramiteForm;