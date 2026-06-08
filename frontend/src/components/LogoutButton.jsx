import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Eliminamos los datos de sesión (ajusta 'token' al nombre que uses)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Redirigimos al usuario al login
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
      Cerrar Sesión
    </button>
  );
}

export default LogoutButton;