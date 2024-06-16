// Importa los módulos y componentes necesarios.
import React, { useEffect, useState } from 'react'; 
import { Global } from '../../helpers/Global'; 
import useAuth from '../../hooks/useAuth'; 
import { PublicationList } from '../publication/PublicationList'; 

// Define el componente Feed.
export const Feed = () => {
    const { auth } = useAuth(); 
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1); 
    const [more, setMore] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null); 

   
    useEffect(() => {
        getPublications(1); 
    }, []);

  
    const getPublications = async (nextPage = 1, update = false) => {
        // Construye la URL para la solicitud de la API.
        let url = (Global.url + "publication/feed/" + nextPage);
      

       
        const request = await fetch(url, {
            method: "GET", // Método GET para obtener datos.
            headers: {
                "Content-Type": "application/json", // Tipo de contenido JSON.
                "Authorization": localStorage.getItem("token") // Añade el token de autorización desde el almacenamiento local.
            }
        });

        // Convierte la respuesta a JSON.
        const data = await request.json();

        // Si la respuesta es exitosa, procesa las publicaciones.
        if (data.status == "success") {
            const newPublications = data.publications; // Obtiene las publicaciones de la respuesta.

            if (newPublications.length > 0) { // Si hay nuevas publicaciones,
                setPublications(prevPublications => nextPage == 1 || update ? [...newPublications, ...prevPublications] : [...prevPublications, ...newPublications]); // Actualiza el estado de las publicaciones.
                setMore(newPublications.length > 0); // Actualiza el estado de 'more' según si hay más publicaciones.
                if (update) {
                    setLastUpdate(Date.now()); // Si es una actualización, actualiza la marca de tiempo de la última actualización.
                }
            } else {
                setMore(false); // Si no hay nuevas publicaciones, indica que no hay más publicaciones para cargar.
            }
        }
    }

    // Renderiza el componente.
    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Publicaciones</h1>
                <button className="content__button" onClick={() => getPublications(1, true)}>Mostrar nuevas</button> {/* Botón para mostrar nuevas publicaciones */}
            </header>

            <PublicationList
                publications={publications} // Pasa las publicaciones como prop.
                setPublications={setPublications} // Pasa la función para actualizar las publicaciones como prop.
                getPublications={getPublications} // Pasa la función para obtener publicaciones como prop.
                page={page} // Pasa el número de página como prop.
                setPage={setPage} // Pasa la función para actualizar la página como prop.
                more={more} // Pasa el estado 'more' como prop.
                setMore={setMore} // Pasa la función para actualizar 'more' como prop.
            />
        </>
    );
}
