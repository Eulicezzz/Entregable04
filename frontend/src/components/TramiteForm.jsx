import { useState, useEffect } from 'react';

function TramiteForm() {
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
      .catch((err) => console.error("Error cargando tipos:", err));
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

  const styles = {
    formGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column' },
    input: { padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' },
    button: { padding: '10px', marginTop: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
  };

  if (tiposTramite.length === 0) return <div style={{textAlign: 'center', marginTop: '20px'}}>Cargando formulario...</div>;

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label>Tipo de Trámite:</label>
          <select name="tipo_tramite" style={styles.input} onChange={handleChange} value={formData.tipo_tramite}>
            {tiposTramite.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label>Descripción:</label>
          <input type="text" name="descripcion" style={styles.input} onChange={handleChange} value={formData.descripcion} required />
        </div>
        <div style={styles.formGroup}>
          <label>Días en espera:</label>
          <input type="number" name="dias_en_espera" style={styles.input} onChange={handleChange} value={formData.dias_en_espera} />
        </div>
        <div style={styles.formGroup}>
          <label>Edad solicitante:</label>
          <input type="number" name="edad_solicitante" style={styles.input} onChange={handleChange} value={formData.edad_solicitante} />
        </div>
        <div style={styles.formGroup}>
          <label>Reclamos previos:</label>
          <input type="number" name="reclamos_previos" style={styles.input} onChange={handleChange} value={formData.reclamos_previos} />
        </div>
        <div style={styles.formGroup}>
          <label>Documentación completa:</label>
          <select name="documentacion_completa" style={styles.input} onChange={handleChange} value={formData.documentacion_completa}>
            <option value={1}>Sí</option>
            <option value={0}>No</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label>¿Es vulnerable?:</label>
          <select name="es_vulnerable" style={styles.input} onChange={handleChange} value={formData.es_vulnerable}>
            <option value={1}>Sí</option>
            <option value={0}>No</option>
          </select>
        </div>
        <button type="submit" style={styles.button} disabled={cargando}>
          {cargando ? 'Procesando IA...' : '🚀 Desplegar y Registrar'}
        </button>
      </form>
    </div>
  );
}

export default TramiteForm;