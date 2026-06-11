import { useEffect, useState } from 'react';

function TramitesList() {
  const [tramites, setTramites] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // 1. Obtenemos el ID del localStorage
    const id = localStorage.getItem('id_ciudadano');

    // 2. Si no hay ID, no hacemos la petición (evita el error 422)
    if (!id) {
      setCargando(false);
      return;
    }

    // 3. Llamamos al endpoint enviando el ID como parámetro
    fetch(`http://127.0.0.1:8000/api/tramites?id_ciudadano=${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Error al cargar');
        return response.json();
      })
      .then((data) => {
        setTramites(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al cargar trámites:', error);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando lista de trámites...</p>;

  return (
    <div>
      <h2>Mis Trámites</h2>
      {tramites.length === 0 ? (
        <p>No tienes trámites registrados.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Tipo</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {tramites.map((t) => (
              <tr key={t.id_tramite}>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{t.id_tramite}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{t.tipo_tramite}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{t.estado_actual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TramitesList;