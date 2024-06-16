import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { HeaderPublic } from './Header';
import useAuth from '../../../hooks/useAuth';
import CookieModal from '../../cookies/cookies';

export const PublicLayout = () => {
  const { auth } = useAuth();

  return (
    <>
      {/* LAYOUT */}
      <HeaderPublic />

      {/* Contenido principal */}
      <section className='layout__content'>
        {!auth._id ? 
          <Outlet />
          : <Navigate to="/social" />
        }
      </section>

      {/* Modal de cookies */}
      <CookieModal />
    </>
  )
}
