import React from 'react';
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

const UserList = ({ users, following, setFollowing, setPage, more, loading }) => {
  const { auth } = useAuth();

  const nextPage = () => {
    setPage(prevPage => prevPage + 1); // Incrementar la página
    console.log(following);
  };

  const follow = async (userId) => {
    // Petición a la API para guardar el follow
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();

    // Ver si todo está ok
    if (data.status === "success") {
      // Actualizar el estado de following agregando nuevo follow
      setFollowing([...following, userId]);
    }
  };

  const unFollow = async (userId) => {
    // Petición a la API para borrar el follow
    const request = await fetch(Global.url + 'follow/unfollow/' + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();

    // Ver si todo está ok
    if (data.status === "success") {
      // Actualizar el estado de following eliminando follow
      let filterFollowing = following.filter(followingUserId => userId !== followingUserId);
      setFollowing(filterFollowing);
    }
  };

  console.log(following);

  return (
    <>
      <div className="content__posts">
        {users.map(user => {
          return (
            <article className="posts__post" key={user._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <Link to={"/social/perfil/" + user._id} className="post__image-link">
                    {user.image !== "default.png" ? (
                      <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />
                    ) : (
                      <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                    )}
                  </Link>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                  <Link to={"/social/perfil/" + user._id} className="user-info__name">{user.name} {user.surname}</Link>
                    <span className="user-info__divider"> | </span>
                    <Link to={"/social/perfil/" + user._id} className="user-info__create-date"><ReactTimeAgo date={user.created_at} locale='es-ES'></ReactTimeAgo></Link>
                  </div>
                  <h4 className="post__content">{user.bio}</h4>
                </div>
              </div>

              {user._id !== auth._id && (
                <div className="post__buttons">
                  {!following.includes(user._id) ? (
                    <button className="post__button post__button--green" onClick={() => follow(user._id)}>
                      Seguir
                    </button>
                  ) : (
                    <button className="post__button" onClick={() => unFollow(user._id)}>
                      Dejar de seguir
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {loading && <p>Cargando...</p>}

      {more && !loading && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver más
          </button>
        </div>
      )}
      
      {!more && !loading && (
        <p>No hay más que mostrar</p>
      )}
    </>
  );
};

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  following: PropTypes.array.isRequired,
  setFollowing: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  more: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default UserList;
