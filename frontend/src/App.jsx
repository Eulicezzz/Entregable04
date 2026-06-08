// src/App.jsx
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import TramitesList from './components/TramitesList';
import TramiteForm from './components/TramiteForm';

function App() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div className="App">
      {isAuthenticated ? (
        // BLOQUE DE GESTIÓN (Cuando está logueado)
        <main>
          <h1>Sistema de Gestión de Trámites</h1>
          <button onClick={logout}>Cerrar Sesión</button>
          
          <section>
            <h2>Registrar Nuevo Trámite</h2>
            <TramiteForm />
          </section>

          <section>
            <h2>Mis Trámites</h2>
            <TramitesList />
          </section>
        </main>
      ) : (
        // BLOQUE LOGIN
        <Login />
      )}
    </div>
  );
}
export default App;