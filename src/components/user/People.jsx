import React, { useEffect, useState } from 'react'

import { Global } from '../../helpers/Global'

import UserList from './UserList'

export const People = () => {

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers();
  }, [page]); // Se ejecuta cada vez que la página cambie

  const getUsers = async () => {

    // Petición para obtener usuarios
    const request = await fetch(Global.url + 'user/list/' + page, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();

    console.log(data.status)
    // Actualizar el estado de los usuarios solo si la solicitud es exitosa
    if (data.users && data.status == "success") {
      setUsers(prevUsers => {
        if (prevUsers.length >= 1) {
          return [...prevUsers, ...data.users];
        } else {
          return data.users;
        }
      });

      setFollowing(data.users_following)
      setLoading(false);

      if (users.length >= (data.total - data.users.length)) {
        setMore(false)
      }

    }
  }

  return (
    <>

      <header className="content__header">
        <h1 className="content__title">Gente</h1>

      </header>
      <UserList users={users} 
      getUsers={getUsers}
      following={following}
      setFollowing={setFollowing}
      page={page}
      setPage={setPage}
      more={more}
      loading={loading}
      ></UserList>

    </>
  )
}
