import { useState, useEffect } from 'react';
import './Tramites.css'; // Asegúrate de importar el archivo de estilos

function TramiteForm({ onRegistroExitoso }) {
  const [tiposTramite, setTiposTramite] = useState([]);
  const [cargando, setCargando] = useState(false);
  const idLogueado = parseInt(localStorage.getItem('id_ciudadano')) || 1;

  const [formData, setFormData] = useState({
    id_ciudadano: idLogueado,
    tipo_tramite: 'Consulta',
    descripcion: '',
    documentacion_completa: 0,
    reclamos_previos: 0,
    estado_actual: 'Pendiente',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    dias_en_espera: 0,
    edad_solicitante: 18,
    es_vulnerable: 0,
    zona_geografica: 'Urbana',
    tipo_solicitante: 'Persona natural'
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tipos-tramite')
      .then((res) => res.json())
      .then((data) => setTiposTramite(data))
      .catch((err) => console.error("Error al cargar:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    // 1. LIMPIEZA DE DATOS PARA LA IA (Forzamos números)
    const datosParaIA = {
      ...formData,
      id_ciudadano: parseInt(formData.id_ciudadano),
      documentacion_completa: parseInt(formData.documentacion_completa),
      reclamos_previos: parseInt(formData.reclamos_previos),
      dias_en_espera: parseInt(formData.dias_en_espera),
      edad_solicitante: parseInt(formData.edad_solicitante),
      es_vulnerable: parseInt(formData.es_vulnerable)
    };

    try {
      const iaResponse = await fetch('http://127.0.0.1:8000/api/predecir/modelo2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaIA),
      });

      if (!iaResponse.ok) throw new Error("Error en el modelo de IA");
      const dataIA = await iaResponse.json();

      // 2. Preparar el objeto para MySQL
      const datosCompletosParaDB = {
        ...formData,
        score_criticidad: parseFloat(dataIA.score_criticidad),
        dias_estimados: parseInt(dataIA.prediccion)
      };

      // 3. Guardar en Base de Datos
      const dbResponse = await fetch('http://127.0.0.1:8000/api/tramites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCompletosParaDB),
      });

      if (!dbResponse.ok) throw new Error("Error al guardar en BD");
      
      alert(`✅ Trámite registrado con éxito. Predicción: ${dataIA.prediccion} días.`);
      
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setCargando(false);
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