import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth';

export const Logout = () => {

    const {setAuth, setCounters} = useAuth();
    const navigate =useNavigate();


    useEffect(() => {
        //Vaciar local storage
        localStorage.clear();

        //Setear estados globales a vacio
        setAuth({});
        setCounters({});

        //Navigate (redirect) al login
        navigate("/login");
    })

  return (
    <div>Cerrando sesion....</div>
  )
}
