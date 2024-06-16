import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'


export const Login = () => {

  const {form, changed} = useForm({})
  const [saved, setSaved] = useState("not_sended");

  const {setAuth} = useAuth();


  const loginUser = async (e) => {
    e.preventDefault();
    let userToLogin = form;

    //peticion al backend
    
      const request = await fetch(Global.url + 'user/login', {
        method: "POST",
        body: JSON.stringify(userToLogin),
        headers: {
          "Content-Type": "application/json"
        }
      });
    
      const data = await request.json();
    
      if (data.status == "success" ) {
        
        // persistir datos en el navegador
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setSaved("login")

        // Set datos en auth
        setAuth(data.user);

        //Redireccion
        setTimeout(() => {
          window.location.reload();
        },2000);

      } else {
        setSaved("error")
      }
   
    }

  return (
    <>
    <header className="content__header content__header--public">
          <h1 className="content__title">Login</h1>
    </header>

    <div className='content__post'></div>
    {saved == "login" ? (
          <strong className="alert alert-success">
            {" "}
            Usuario identificado correctamente!{" "}
          </strong>
        ) : (
          ""
        )}

        {saved == "error" ? (
          <strong className="alert alert-danger">
            {" "}
            Error al identificar usuario
          </strong>
        ) : (
          ""
        )}
    <form className='for-login' onSubmit={loginUser}>

      <div className='for-group'>
        <label htmlFor='email'>Correo electrónico</label>
        <input type='email' name='email' onChange={changed}></input>
      </div>

      <div className='for-group'>
        <label htmlFor='password'>Contraseña</label>
        <input type='password' name='password' onChange={changed}></input>
      </div>

      

    <input type='submit' value="Identificate" className='btn btn-success'></input>

    </form>
    
    </>
  )
}
