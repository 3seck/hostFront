import React, { createContext, useState, useEffect } from 'react'
import { Global } from '../helpers/Global';

const AuthContext = createContext();


export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({});
    const [counters, setCounters] = useState({});
    const [loading, setLoading] = useState({});

    useEffect(() => {
        authUser();
    },[]);

    const authUser = async () => {
       // sacar datos del usuario identificado del localstrorage

       const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
       // Comprobar si tengo el token y el uiser

        if (!token || !user){
            setLoading(false);
            return false;
        } 

       //Tranformar los datos en un objeto de js

        const userObjet = JSON.parse(user)
        const userId = userObjet.id;

       //peticion al servidor que compruebe el token y devuleva todos los datos del usuario
    
        const request = await fetch(Global.url + "user/profile/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "aplication/json",
                "Authorization": token
            }
        })
       

        const data = await request.json();

        //Peticion para los contadores
        const requestCounters = await fetch(Global.url + "user/counter/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "aplication/json",
                "Authorization": token
            }
        })
        const dataCounters = await requestCounters.json();
        
        // Setear el estado del auth
        setAuth(data.user)
        setCounters(dataCounters)
        setLoading(false)
    }

  return (
    <AuthContext.Provider value={{
        auth,
        setAuth,
        counters,
        setCounters,
        loading
    }}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;