// src/App.jsx
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import TramitesList from './components/TramitesList';
import TramiteForm from './components/TramiteForm';

function App() {
  const [estaLogueado, setEstaLogueado] = useState(!!localStorage.getItem('id_ciudadano'));

  // Esta función es la que llamará el Login al tener éxito
  const handleLoginSuccess = () => {
    setEstaLogueado(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('id_ciudadano');
    setEstaLogueado(false);
  };

  return (
    <div className="App">
      {!estaLogueado ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <main>
          <h1>Sistema de Gestión de Trámites</h1>
          <button onClick={handleLogout}>Cerrar Sesión</button>
          <section><TramiteForm /></section>
          <section><TramitesList /></section>
        </main>
      )}
    </div>
  );
}
export default App;