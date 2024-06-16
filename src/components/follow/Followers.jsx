import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import UserList from '../user/UserList';
import { useParams } from 'react-router-dom';
import { getProfile } from '../../helpers/getProfile';

export const Followers = () => {
  // Definine estados locales para manejar los datos de los usuarios, la paginación, el estado de carga, etc.
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({});

  // Obtiene los parámetros de la URL usando useParams
  const params = useParams();

  // useEffect se ejecuta cada vez que 'page' cambia
  useEffect(() => {
    getUsers();
    getProfile(params.userId, setUserProfile);
  }, [page]);

  // Función para obtener los usuarios seguidores desde el servidor
  const getUsers = async () => {
    // Obtiene el userId desde los parámetros de la URL
    const userId = params.userId;

    try {
      // Realiza una petición fetch a la API para obtener los seguidores del usuario
      const request = await fetch(`${Global.url}follow/followers/${userId}/${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      });

      // Parse la respuesta a JSON
      const data = await request.json();

      // Comproba si la respuesta es exitosa
      if (data.message === "listado de followers") {
        // Limpiam los datos para obtener solo los usuarios
        const cleanUsers = data.follows.map(follow => follow.user);
        console.log(cleanUsers);

        // Actualiza el estado de usuarios, concatenando los nuevos con los existentes si no es la primera página
        setUsers(prevUsers => {
          if (page == 1) {
            return cleanUsers;
          } else {
            return [...prevUsers, ...cleanUsers];
          }
        });

        // Actualiza el estado de los seguidores
        setFollowing(data.users_follower || []);
        setLoading(false);

        // Verifica si hay mas usuarios para cargar
        if (users.length + cleanUsers.length >= data.total) {
          setMore(false);
        }
      } else {
        setLoading(false);
        setMore(false);
      }
    } catch (error) {
      // Manejo de errores
      console.error("Error al pedir los followers:", error);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header del contenido */}
      <header className="content__header">
        <h1 className="content__title">Seguidores de {userProfile.nick}</h1>
      </header>

      {/* Componente UserList que muestra la lista de usuarios */}
      <UserList 
        users={users}
        following={following}
        setFollowing={setFollowing}
        setPage={setPage}
        more={more}
        loading={loading}
      />
      
      {/* Botón para cargar más usuarios, solo se muestra si hay más usuarios y no está cargando */}
      {more && !loading && (
        <button onClick={() => setPage(page + 1)}>Cargar más</button>
      )}
    </>
  );
};
