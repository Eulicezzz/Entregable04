import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const { login } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [esFuncionario, setEsFuncionario] = useState(false);
  
  const [formData, setFormData] = useState({
    tipo_documento: 'DNI',
    numero_documento: '',
    password: '',
    nombre: '',
    edad: '',
    es_vulnerable: false,
    zona_geografica: '',
    tipo_solicitante: 'Persona Natural',
    correo: '',
    telefono: '',
    codigo_funcionario: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let dataToSend;
    if (esFuncionario) {
        dataToSend = { numero_documento: formData.codigo_funcionario, password: formData.password };
    } else if (isRegistering) {
        // --- AQUÍ ESTÁ LA CORRECCIÓN ---
        // Construimos el objeto forzando valores para los campos que fallan
        dataToSend = {
            ...formData,
            tipo_solicitante: formData.tipo_solicitante || 'Persona Natural',
            tipo_documento: formData.tipo_documento || 'DNI'
        };
    } else {
        dataToSend = { numero_documento: formData.numero_documento, password: formData.password };
    }
        
    let endpoint = esFuncionario ? '/api/login/funcionario' : (isRegistering ? '/api/register' : '/api/login');
    
    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        alert(isRegistering ? "Registro exitoso, ahora inicia sesión" : "Acceso concedido");
        if (isRegistering) setIsRegistering(false);
        else login();
      } else {
        alert(`Error: ${result.detail || 'Verifique sus datos'}`);
      }
    } catch (error) {
      alert('Error de conexión con el servidor.');
    }
  };

  const containerStyle = { maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' };
  const inputContainer = { marginBottom: '15px' };
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
  const selectStyle = { ...inputStyle, height: '40px', display: 'block', backgroundColor: 'white', border: '1px solid #ccc' };

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button onClick={() => { setEsFuncionario(false); setIsRegistering(false); }}>Ciudadano</button>
        <button onClick={() => { setEsFuncionario(true); setIsRegistering(false); }} style={{ marginLeft: '10px' }}>Funcionario</button>
      </div>

      <h2 style={{ textAlign: 'center' }}>{isRegistering ? 'Registro Ciudadano' : (esFuncionario ? 'Acceso Funcionario' : 'Inicio de Sesión')}</h2>
      
      <form onSubmit={handleSubmit}>
        {esFuncionario ? (
          <>
            <div style={inputContainer}><input style={inputStyle} type="text" placeholder="Código Funcionario" required onChange={(e) => setFormData({...formData, codigo_funcionario: e.target.value})} /></div>
            <div style={inputContainer}><input style={inputStyle} type="password" placeholder="Contraseña" required onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
          </>
        ) : (
          <>
            {isRegistering && (
              <>
                <div style={inputContainer}><input style={inputStyle} type="text" placeholder="Nombre completo" required onChange={(e) => setFormData({...formData, nombre: e.target.value})} /></div>
                <div style={inputContainer}><input style={inputStyle} type="number" placeholder="Edad" required onChange={(e) => setFormData({...formData, edad: e.target.value})} /></div>
                <div style={inputContainer}><label><input type="checkbox" checked={formData.es_vulnerable} onChange={(e) => setFormData({...formData, es_vulnerable: e.target.checked})} /> ¿Es vulnerable?</label></div>
                <div style={inputContainer}><input style={inputStyle} type="text" placeholder="Zona geográfica" required onChange={(e) => setFormData({...formData, zona_geografica: e.target.value})} /></div>
                <div style={inputContainer}><input style={inputStyle} type="email" placeholder="Correo" required onChange={(e) => setFormData({...formData, correo: e.target.value})} /></div>
                <div style={inputContainer}><input style={inputStyle} type="tel" placeholder="Teléfono (9 dígitos)" maxLength="9" required value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value.replace(/\D/g, '')})} /></div>
                
                <div style={inputContainer}>
                  <label>Tipo Solicitante:</label>
                  <select style={selectStyle} value={formData.tipo_solicitante} onChange={(e) => setFormData({...formData, tipo_solicitante: e.target.value})}>
                    <option value="Persona Natural">Persona Natural</option>
                    <option value="Empresa">Empresa</option>
                  </select>
                </div>
              </>
            )}
            
            <div style={inputContainer}>
              <label>Tipo Documento:</label>
              <select style={selectStyle} value={formData.tipo_documento} onChange={(e) => setFormData({...formData, tipo_documento: e.target.value})}>
                <option value="DNI">DNI</option>
                <option value="CE">CE</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>
            <div style={inputContainer}><input style={inputStyle} type="text" placeholder="N° Documento (8 dígitos)" maxLength="8" required value={formData.numero_documento} onChange={(e) => setFormData({...formData, numero_documento: e.target.value.replace(/\D/g, '')})} /></div>
            <div style={inputContainer}><input style={inputStyle} type="password" placeholder="Contraseña" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
          </>
        )}
        
        <button style={{ width: '100%', padding: '10px' }} type="submit">{isRegistering ? 'Registrarse' : 'Ingresar'}</button>
      </form>
      
      {!esFuncionario && (
        <p style={{ cursor: 'pointer', color: 'blue', textAlign: 'center', marginTop: '15px' }} onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </p>
      )}
    </div>
  );
}

export default Login;