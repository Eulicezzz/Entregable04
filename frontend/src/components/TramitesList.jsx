import { useEffect, useState } from 'react';

function TramitesList() {
  const [tramites, setTramites] = useState([]);

  useEffect(() => {
    // Llamamos a tu endpoint de FastAPI
    fetch('http://127.0.0.1:8000/api/tramites')
      .then((response) => response.json())
      .then((data) => setTramites(data))
      .catch((error) => console.error('Error al cargar trámites:', error));
  }, []);

  return (
    <div>
      <h2>Lista de Trámites</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {tramites.map((t) => (
            <tr key={t.id_tramite}>
              <td>{t.id_tramite}</td>
              <td>{t.tipo_tramite}</td>
              <td>{t.estado_actual}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TramitesList;