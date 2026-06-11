import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

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
    let dataToSend = esFuncionario 
      ? { numero_documento: formData.codigo_funcionario, password: formData.password }
      : (isRegistering ? { ...formData } : { numero_documento: formData.numero_documento, password: formData.password });
        
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
        isRegistering ? setIsRegistering(false) : login();
      } else {
        alert(`Error: ${result.detail || 'Verifique sus datos'}`);
      }
    } catch (error) {
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="tab-container">
          <button className={!esFuncionario ? "tab active" : "tab"} onClick={() => { setEsFuncionario(false); setIsRegistering(false); }}>Ciudadano</button>
          <button className={esFuncionario ? "tab active" : "tab"} onClick={() => { setEsFuncionario(true); setIsRegistering(false); }}>Funcionario</button>
        </div>

        <h2 className="login-title">{isRegistering ? 'Registro Ciudadano' : (esFuncionario ? 'Acceso Funcionario' : 'Inicio de Sesión')}</h2>
        
        <form onSubmit={handleSubmit}>
          {esFuncionario ? (
            <>
              <input className="input-field" type="text" placeholder="Código Funcionario" required onChange={(e) => setFormData({...formData, codigo_funcionario: e.target.value})} />
              <input className="input-field" type="password" placeholder="Contraseña" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </>
          ) : (
            <>
              {isRegistering && (
                <>
                  <input className="input-field" type="text" placeholder="Nombre completo" required onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                  <input className="input-field" type="number" placeholder="Edad" required onChange={(e) => setFormData({...formData, edad: e.target.value})} />
                  <div className="checkbox-container">
                    <input type="checkbox" checked={formData.es_vulnerable} onChange={(e) => setFormData({...formData, es_vulnerable: e.target.checked})} /> 
                    <label>¿Es vulnerable?</label>
                  </div>
                  <input className="input-field" type="text" placeholder="Zona geográfica" required onChange={(e) => setFormData({...formData, zona_geografica: e.target.value})} />
                  <input className="input-field" type="email" placeholder="Correo" required onChange={(e) => setFormData({...formData, correo: e.target.value})} />
                  <input className="input-field" type="tel" placeholder="Teléfono" maxLength="9" required value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value.replace(/\D/g, '')})} />
                  <select className="input-field" value={formData.tipo_solicitante} onChange={(e) => setFormData({...formData, tipo_solicitante: e.target.value})}>
                    <option value="Persona Natural">Persona Natural</option>
                    <option value="Empresa">Empresa</option>
                  </select>
                </>
              )}
              
              <select className="input-field" value={formData.tipo_documento} onChange={(e) => setFormData({...formData, tipo_documento: e.target.value})}>
                <option value="DNI">DNI</option>
                <option value="CE">CE</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="RUC">RUC</option>
              </select>

              <input 
                className="input-field" 
                type="text" 
                placeholder={formData.tipo_documento === 'RUC' ? "N° RUC (11 dígitos)" : "N° Documento (8 dígitos)"}
                maxLength={formData.tipo_documento === 'RUC' ? "11" : "8"} 
                required 
                value={formData.numero_documento} 
                onChange={(e) => setFormData({...formData, numero_documento: e.target.value.replace(/\D/g, '')})} 
              />
              
              <input className="input-field" type="password" placeholder="Contraseña" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </>
          )}
          
          <button className="btn-primary" type="submit">{isRegistering ? 'Registrarse' : 'Ingresar'}</button>
        </form>
        
        {!esFuncionario && (
          <p className="toggle-link" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;