import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/login';
import TramitesList from '../components/TramitesList';
import TramiteForm from '../components/TramiteForm'; // 1. Importa el nuevo componente
import '../App.css';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <h1>Sistema de Gestión de Trámites</h1>
          <p>Bienvenido al sistema de gestión.</p>
          
          {/* 2. Añadimos el formulario */}
          <section>
            <h2>Registrar Nuevo Trámite</h2>
            <TramiteForm onRegistroExitoso={() => window.location.reload()} />
          </section>

          <hr />

          {/* 3. Mantenemos la lista debajo */}
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