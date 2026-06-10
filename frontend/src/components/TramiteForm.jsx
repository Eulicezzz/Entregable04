import { useState, useEffect } from 'react';

function TramiteForm({ onRegistroExitoso }) {

  const [tiposTramite, setTiposTramite] = useState([]);
  const [formData, setFormData] = useState({
    id_ciudadano: '',
    tipo_tramite: '',
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

  
  const [resultadoIA, setResultadoIA] = useState(null);
  const [cargando, setCargando] = useState(false);

 
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tipos-tramite')
      .then((res) => {
        if (!res.ok) throw new Error('Error en la API');
        return res.json();
      })
      .then((data) => setTiposTramite(data))
      .catch((err) => console.error("No se pudieron cargar los tipos:", err));
  }, []);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setResultadoIA(null);

    try {
      //  Enviamos los datos necesarios a tu endpoint del Modelo 2 
      const iaResponse = await fetch('http://127.0.0.1:8000/predecir/modelo2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_tramite: formData.tipo_tramite,
          dias_en_espera: parseFloat(formData.dias_en_espera),
          documentacion_completa: parseFloat(formData.documentacion_completa),
          reclamos_previos: parseFloat(formData.reclamos_previos),
          edad_solicitante: parseFloat(formData.edad_solicitante),
          es_vulnerable: parseFloat(formData.es_vulnerable),
          zona_geografica: formData.zona_geografica,
          tipo_solicitante: formData.tipo_solicitante
        }),
      });

      if (!iaResponse.ok) throw new Error('Error al conectar con la IA');
      const dataIA = await iaResponse.json();
      setResultadoIA(dataIA);

      // Inyectamos los resultados de la IA al JSON final y guardamos en la BD 
      const datosFinalesDB = {
        ...formData,
        score_criticidad: dataIA.score_criticidad_calculado,
        dias_estimados: dataIA.dias_estimados_predichos
      };

      const response = await fetch('http://127.0.0.1:8000/api/tramites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFinalesDB),
      });

      if (response.ok) {
        alert('Trámite registrado con éxito y evaluado por la IA');
        onRegistroExitoso();
      } else {
        alert('Se calculó la predicción IA, pero la base de datos rechazó el guardado.');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Error en el flujo de datos.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
      
      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <h3>Registrar Nuevo Trámite</h3>
        
        <input 
          type="number" 
          placeholder="ID Ciudadano" 
          min="0" 
          required 
          onChange={(e) => setFormData({...formData, id_ciudadano: parseInt(e.target.value)})} 
        />
        
        <label>Tipo de Trámite:</label>
        <select required value={formData.tipo_tramite} name="tipo_tramite" onChange={handleChange}>
          <option value="">Seleccione...</option>
          {Array.isArray(tiposTramite) && tiposTramite.map((tipo, index) => (
            <option key={index} value={tipo}>{tipo}</option>
          ))}
        </select>

        <textarea 
          placeholder="Descripción" 
          onChange={(e) => setFormData({...formData, descripcion: e.target.value})} 
        />
        
        <label>¿Documentación completa?</label>
        <select onChange={(e) => setFormData({...formData, documentacion_completa: parseInt(e.target.value)})}>
          <option value="0">No</option>
          <option value="1">Sí</option>
        </select>
        
        <label>Reclamos Previos:</label>
        <input 
          type="number" 
          min="0" 
          defaultValue="0" 
          onChange={(e) => setFormData({...formData, reclamos_previos: parseInt(e.target.value)})} 
        />

        {/* NUEVOS CAMPOS AGREGADOS */}
        <label>Edad del Solicitante:</label>
        <input 
          type="number" 
          min="18" 
          max="110" 
          value={formData.edad_solicitante} 
          onChange={(e) => setFormData({...formData, edad_solicitante: parseInt(e.target.value)})} 
          required 
        />

        <label>¿Es un perfil Vulnerable?</label>
        <select onChange={(e) => setFormData({...formData, es_vulnerable: parseInt(e.target.value)})}>
          <option value="0">No</option>
          <option value="1">Sí</option>
        </select>

        <label>Zona Geográfica:</label>
        <select name="zona_geografica" value={formData.zona_geografica} onChange={handleChange}>
          <option value="Urbana">Urbana</option>
          <option value="Rural">Rural</option>
        </select>

        <label>Tipo de Solicitante:</label>
        <select name="tipo_solicitante" value={formData.tipo_solicitante} onChange={handleChange}>
          <option value="Persona natural">Persona Natural</option>
          <option value="Persona jurídica">Persona Jurídica</option>
        </select>
        
        <button type="submit" disabled={cargando}>
          {cargando ? 'Calculando Redes Neuronales...' : 'Guardar Trámite'}
        </button>
      </form>

      {/* PANEL DERECHO: VISUALIZADOR */}
      <div style={{ marginTop: '40px', minWidth: '250px' }}>
        {resultadoIA && (
          <div style={{ padding: '15px', border: '2px solid #2ecc71', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h4 style={{ color: '#2ecc71', marginTop: 0 }}>🔮 Resultados Predictivos IA</h4>
            
            <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
              <small style={{ color: '#7f8c8d' }}>Criticidad del Caso (M1):</small>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{resultadoIA.score_criticidad_calculado} pts</div>
            </div>

            <div style={{ padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
              <small style={{ color: '#7f8c8d' }}>Tiempo Estimado (M2):</small>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#9b59b6' }}>{resultadoIA.dias_estimados_predichos} días</div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default TramiteForm;