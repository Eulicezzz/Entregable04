import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import Login from '../pages/login';
import '../App.css'

function App() {
  //Definimos la variable isAuthenticated para saber si el usuario está logueado o no 
  // usando el contexto de autenticación
  const {isAuthenticated} = useContext(AuthContext);

  return (
    <div className="App">
      {/* Renderizado condicional: Si está logueado muestra la app, sino muestra el Login */}
      {isAuthenticated ? (
        <>
          <h1>Sistema de Gestión de Trámites</h1>
          <p>Bienvenido. Aquí irá tu formulario de predicción.</p>
          {/* Aquí más adelante pondrás tus componentes de Formulario */}
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
