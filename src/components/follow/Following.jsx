import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import UserList  from '../user/UserList'
import { useParams } from 'react-router-dom';
import { getProfile } from '../../helpers/getProfile';

export const Following = () => {
  
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({});

  const params = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    getUsers();
    getProfile(params.userId, setUserProfile);
  }, [page]); // Se ejecutará cada vez que la página cambie

  const getUsers = async () => {

    //sacar userID
    const userId = params.userId;
    

    // Petición para obtener usuarios
    const request = await fetch(Global.url + 'follow/following/' + userId + "/" + page, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });
    const data = await request.json();
    console.log(data)
    let cleanUsers = [];
    console.log(data.follows)

    //recorrer y limpiar follows
    data.follows.forEach( follow => {
      cleanUsers = [...cleanUsers, follow.followed]
    });
    data.users = cleanUsers
    console.log(data.users)
   
    // Actualizar el estado de los usuarios solo si la solicitud es exitosa
    {/*if (data.follows && data.status === "success"){} */}
      setUsers(prevUsers => {
        let newUsers = data.users;
        if (prevUsers.length >= 1) {
          newUsers = [...prevUsers, ...data.users];
        }
        return newUsers;
      });
      
      setFollowing(data.users_following)
      setLoading(false);

      if (users.length >= (data.total - data.follows.length)) {
        setMore(false)
      }
    }

  
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Usuarios que sigue {userProfile.nick}</h1>

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
