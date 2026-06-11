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
        if (isRegistering) {
          setIsRegistering(false);
        } else {
          // CAPTURA Y GUARDA EL ID DEL USUARIO LOGUEADO
          if (result && result.id) {
            localStorage.setItem('id_ciudadano', result.id);
          } else if (result && result.user && result.user.id) {
            localStorage.setItem('id_ciudadano', result.user.id);
          } else if (result && result.id_usuario) {
            localStorage.setItem('id_ciudadano', result.id_usuario);
          } else {
            localStorage.setItem('id_ciudadano', formData.numero_documento); 
          }

          // Otorgamos acceso al menú principal a través del contexto
          login();
        }
      } else {
        alert(`Error: ${result.detail || 'Verifique sus datos'}`);
      }
    } catch (error) {
      alert('Error de conexión con el servidor.');
    }
  };

  const containerStyle = { maxWidth: '420px', margin: '60px auto', padding: '35px 30px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)', fontFamily: 'sans-serif' };
  const navTabContainer = { display: 'flex', backgroundColor: '#f1f3f5', padding: '5px', borderRadius: '8px', marginBottom: '25px' };
  const tabButtonStyle = (isActive) => ({ flex: 1, padding: '10px 0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', backgroundColor: isActive ? '#ffffff' : 'transparent', color: isActive ? '#1a1a1a' : '#666666' });
  const titleStyle = { fontSize: '24px', fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginBottom: '25px' };
  const inputContainer = { marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '6px' };
  const inputStyle = { width: '100%', padding: '12px 14px', boxSizing: 'border-box', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '15px' };
  const selectStyle = { ...inputStyle, height: '46px', cursor: 'pointer' };
  const checkboxLabelStyle = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#495057', cursor: 'pointer' };
  const submitButtonStyle = { width: '100%', padding: '14px', backgroundColor: '#228be6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' };
  const switchTextStyle = { cursor: 'pointer', color: '#228be6', textAlign: 'center', marginTop: '20px', fontSize: '14px', fontWeight: '500' };

  return (
    <div style={containerStyle}>
      <div style={navTabContainer}>
        <button type="button" style={tabButtonStyle(!esFuncionario)} onClick={() => { setEsFuncionario(false); setIsRegistering(false); }}>Ciudadano</button>
        <button type="button" style={tabButtonStyle(esFuncionario)} onClick={() => { setEsFuncionario(true); setIsRegistering(false); }}>Funcionario</button>
      </div>

      <h2 style={titleStyle}>{isRegistering ? 'Registro Ciudadano' : (esFuncionario ? 'Acceso Funcionario' : 'Inicio de Sesión')}</h2>
      
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
                <div style={inputContainer}>
                  <label style={checkboxLabelStyle}>
                    <input type="checkbox" style={{ width: '16px', height: '16px' }} checked={formData.es_vulnerable} onChange={(e) => setFormData({...formData, es_vulnerable: e.target.checked})} /> 
                    ¿Pertenece a un grupo vulnerable?
                  </label>
                </div>
                <div style={inputContainer}><input style={inputStyle} type="text" placeholder="Zona geográfica (Ej. Lima, Urbana)" required onChange={(e) => setFormData({...formData, zona_geografica: e.target.value})} /></div>
                <div style={inputContainer}><input style={inputStyle} type="email" placeholder="Correo electrónico" required onChange={(e) => setFormData({...formData, correo: e.target.value})} /></div>
                <div style={inputContainer}><input style={inputStyle} type="tel" placeholder="Teléfono" maxLength="9" required value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value.replace(/\D/g, '')})} /></div>
                <div style={inputContainer}>
                  <select style={selectStyle} value={formData.tipo_solicitante} onChange={(e) => setFormData({...formData, tipo_solicitante: e.target.value})}>
                    <option value="Persona Natural">Persona Natural</option>
                    <option value="Empresa">Empresa</option>
                  </select>
                </div>
              </>
            )}
            <div style={inputContainer}>
              <select style={selectStyle} value={formData.tipo_documento} onChange={(e) => setFormData({...formData, tipo_documento: e.target.value})}>
                <option value="DNI">DNI</option>
                <option value="CE">CE</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>
            <div style={inputContainer}><input style={inputStyle} type="text" placeholder="N° Documento" maxLength="12" required value={formData.numero_documento} onChange={(e) => setFormData({...formData, numero_documento: e.target.value.replace(/\D/g, '')})} /></div>
            <div style={inputContainer}><input style={inputStyle} type="password" placeholder="Contraseña" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
          </>
        )}
        <button style={submitButtonStyle} type="submit">{isRegistering ? 'Crear Cuenta' : 'Ingresar al Sistema'}</button>
      </form>
      {!esFuncionario && (
        <p style={switchTextStyle} onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
        </p>
      )}
    </div>
  );
}

export default Login;