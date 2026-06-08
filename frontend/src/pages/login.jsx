import { useState } from 'react';

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [esFuncionario, setEsFuncionario] = useState(false);
  
  const [formData, setFormData] = useState({
    // Campos Ciudadano
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
    // Campos Funcionario
    codigo_funcionario: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones (Solo aplican si es Ciudadano y está registrándose)
    if (!esFuncionario && isRegistering) {
      if (formData.tipo_documento === 'DNI' && formData.numero_documento.length !== 8) {
        return alert("El DNI debe tener 8 dígitos.");
      }
      if (!/^\d{9}$/.test(formData.telefono)) {
        return alert("El teléfono debe tener 9 dígitos.");
      }
    }

    // Definir endpoint según rol
    const endpoint = esFuncionario ? '/api/login/funcionario' : (isRegistering ? '/api/register' : '/api/login');
    
    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Operación exitosa");
        window.location.reload();
      } else {
        alert('Error: Verifique sus datos.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      
      {/* Selector de Rol */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => { setEsFuncionario(false); setIsRegistering(false); }} style={{ flex: 1 }}>Ciudadano</button>
        <button onClick={() => { setEsFuncionario(true); setIsRegistering(false); }} style={{ flex: 1 }}>Funcionario</button>
      </div>

      <h2>{isRegistering ? 'Registro Ciudadano' : (esFuncionario ? 'Acceso Funcionario' : 'Inicio de Sesión')}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* --- FORMULARIO FUNCIONARIO --- */}
        {esFuncionario ? (
          <>
            <input type="text" placeholder="Código de Funcionario" required onChange={(e) => setFormData({...formData, codigo_funcionario: e.target.value})} />
            <input type="password" placeholder="Contraseña" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </>
        ) : (
          /* --- FORMULARIO CIUDADANO --- */
          <>
            {isRegistering && (
              <>
                <input type="text" placeholder="Nombre completo" required onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                <input type="number" placeholder="Edad" min="1" required onChange={(e) => setFormData({...formData, edad: e.target.value})} />
                <label><input type="checkbox" onChange={(e) => setFormData({...formData, es_vulnerable: e.target.checked})} /> ¿Población vulnerable?</label>
                <input type="text" placeholder="Zona geográfica" required onChange={(e) => setFormData({...formData, zona_geografica: e.target.value})} />
                <select onChange={(e) => setFormData({...formData, tipo_solicitante: e.target.value})}>
                  <option value="Persona Natural">Persona Natural</option>
                  <option value="Empresa">Empresa</option>
                </select>
                <input type="email" placeholder="Correo" required onChange={(e) => setFormData({...formData, correo: e.target.value})} />
                <input type="tel" placeholder="Teléfono (9 dígitos)" maxLength="9" required onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
              </>
            )}
            <select value={formData.tipo_documento} onChange={(e) => setFormData({...formData, tipo_documento: e.target.value})}>
              <option value="DNI">DNI</option>
              <option value="CE">Carnet de Extranjería</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
            <input type="text" placeholder="Número de Documento" maxLength={formData.tipo_documento === 'DNI' ? 8 : 20} required onChange={(e) => setFormData({...formData, numero_documento: e.target.value.replace(/[^0-9]/g, '')})} />
            <input type="password" placeholder="Contraseña" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </>
        )}
        
        <button type="submit">{isRegistering ? 'Registrarse' : 'Ingresar'}</button>
      </form>
      
      {!esFuncionario && (
        <p style={{ textAlign: 'center', marginTop: '10px', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </p>
      )}
    </div>
  );
}

export default Login;