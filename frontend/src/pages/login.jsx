import {useState, useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
const Login = () => {
    const [credentials, setCredentials] = useState({username: '', password: ''});
    const {login} = useContext(AuthContext);

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Luego llamamos a la API, por ahora simulamos un token
        console.log("Enviando credenciales:", credentials);
        //simulamos la respuesta del backend
        const mockToken = "token_ejemplo_12345";
        login(mockToken);
    };
    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    name="username" 
                    placeholder="Usuario" 
                    onChange={handleChange} 
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Contraseña" 
                    onChange={handleChange} 
                />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default Login;