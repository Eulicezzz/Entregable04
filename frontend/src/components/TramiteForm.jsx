import { useState, useEffect } from 'react';

function TramiteForm({ onRegistroExitoso }) {
  // 1. Definimos los estados correctamente al inicio
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

  // 2. Cargamos los tipos al montar el componente
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tipos-tramite')
      .then((res) => {
        if (!res.ok) throw new Error('Error en la API');
        return res.json();
      })
      .then((data) => setTiposTramite(data))
      .catch((err) => console.error("No se pudieron cargar los tipos:", err));
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
      <h3>Registrar Nuevo Trámite</h3>
      
      <input type="number" placeholder="ID Ciudadano" min="0" required onChange={(e) => setFormData({...formData, id_ciudadano: parseInt(e.target.value)})} />
      
      <label>Tipo de Trámite:</label>
      <select required onChange={(e) => setFormData({...formData, tipo_tramite: e.target.value})}>
        <option value="">Seleccione...</option>
        {/* 3. Mapeo seguro con validación */}
        {Array.isArray(tiposTramite) && tiposTramite.map((tipo, index) => (
          <option key={index} value={tipo}>{tipo}</option>
        ))}
      </select>

      <textarea placeholder="Descripción" onChange={(e) => setFormData({...formData, descripcion: e.target.value})} />
      
      <label>¿Documentación completa?</label>
      <select onChange={(e) => setFormData({...formData, documentacion_completa: parseInt(e.target.value)})}>
        <option value="0">No</option>
        <option value="1">Sí</option>
      </select>
      
      <label>Reclamos Previos:</label>
      <input type="number" min="0" defaultValue="0" onChange={(e) => setFormData({...formData, reclamos_previos: parseInt(e.target.value)})} />
      
      <button type="submit">Guardar Trámite</button>
    </form>
  );
}

export default TramiteForm;