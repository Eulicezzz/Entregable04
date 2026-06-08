import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const { login } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [esFuncionario, setEsFuncionario] = useState(false);
  
  // Estado único para todos los campos
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

    // Determinamos el endpoint según la acción
    let endpoint = '/api/login';
    if (esFuncionario) endpoint = '/api/login/funcionario';
    else if (isRegistering) endpoint = '/api/register';
    
    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(isRegistering ? "Registro exitoso, ahora inicia sesión" : "Acceso concedido");
        if (isRegistering) {
            setIsRegistering(false); // Volver a modo login tras registrar
        } else {
            login(); // Cambiar estado global a autenticado
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Error: ${errorData.detail || 'Verifique sus datos'}`);
      }
    } catch (error) {
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => { setEsFuncionario(false); setIsRegistering(false); }}>Ciudadano</button>
        <button onClick={() => { setEsFuncionario(true); setIsRegistering(false); }}>Funcionario</button>
      </div>

      <h2>{isRegistering ? 'Registro Ciudadano' : (esFuncionario ? 'Acceso Funcionario' : 'Inicio de Sesión')}</h2>
      
      <form onSubmit={handleSubmit}>
        {/* CAMPOS FUNCIONARIO */}
        {esFuncionario && (
          <>
            <input type="text" placeholder="Código Funcionario" required onChange={(e) => setFormData({...formData, codigo_funcionario: e.target.value})} />
            <input type="password" placeholder="Contraseña" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </>
        )}

        {/* CAMPOS CIUDADANO (LOGIN Y REGISTRO) */}
        {!esFuncionario && (
          <>
            {isRegistering && (
              <>
                <input type="text" placeholder="Nombre completo" required onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                <input type="number" placeholder="Edad" required onChange={(e) => setFormData({...formData, edad: e.target.value})} />
                <label><input type="checkbox" onChange={(e) => setFormData({...formData, es_vulnerable: e.target.checked})} /> ¿Vulnerable?</label>
                <input type="text" placeholder="Zona geográfica" required onChange={(e) => setFormData({...formData, zona_geografica: e.target.value})} />
                <input type="email" placeholder="Correo" required onChange={(e) => setFormData({...formData, correo: e.target.value})} />
                <input type="tel" placeholder="Teléfono" maxLength="9" required onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
              </>
            )}
            
            <select onChange={(e) => setFormData({...formData, tipo_documento: e.target.value})}>
              <option value="DNI">DNI</option>
              <option value="CE">CE</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
            <input type="text" placeholder="N° Documento" required onChange={(e) => setFormData({...formData, numero_documento: e.target.value})} />
            <input type="password" placeholder="Contraseña" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </>
        )}
        
        <button type="submit">{isRegistering ? 'Registrarse' : 'Ingresar'}</button>
      </form>
      
      {!esFuncionario && (
        <p onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </p>
      )}
    </div>
  );
}

export default Login;