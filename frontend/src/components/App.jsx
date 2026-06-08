import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/login';
import TramitesList from '../components/TramitesList';
import TramiteForm from '../components/TramiteForm';
import '../App.css';

function App() {
  // Asegúrate de extraer 'logout' desde tu AuthContext
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Sistema de Gestión de Trámites</h1>
            {/* Botón de cerrar sesión */}
            <button 
              onClick={logout} 
              style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer' }}
            >
              Cerrar Sesión
            </button>
          </header>
          
          <p>Bienvenido al sistema de gestión.</p>
          
          <section>
            <h2>Registrar Nuevo Trámite</h2>
            <TramiteForm onRegistroExitoso={() => window.location.reload()} />
          </section>

          <hr />

          <section>
            <TramitesList />
          </section>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;