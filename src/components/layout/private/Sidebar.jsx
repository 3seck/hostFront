import React, { useState } from 'react';
import avatar from "../../../assets/img/user.png";
import useAuth from '../../../hooks/useAuth';
import { Global } from '../../../helpers/Global';
import { useForm } from '../../../hooks/useForm';

export const Sidebar = ({ setPublications }) => {
  const { auth, counters } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");
  const [posting, setPosting] = useState(false); // Nuevo estado para manejar el mensaje de "Posteando..."

  const savePublication = async (e) => {
    e.preventDefault();
    setPosting(true); // Mostrar mensaje de "Posteando..."

    const token = localStorage.getItem("token");

    let newPublication = { ...form, user: auth._id };

    const request = await fetch(Global.url + "publication/save", {
      method: "POST",
      body: JSON.stringify(newPublication),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const data = await request.json();

    if (data.status === "success") {
      const fileInput = document.querySelector('#file');
      if (fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append("file0", fileInput.files[0]);

        const uploadRequest = await fetch(Global.url + "publication/upload/" + data.publication._id, {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": token
          }
        });

        const uploadData = await uploadRequest.json();

        if (uploadData.status === "success") {
          data.publication.file = uploadData.file; // Agrega la información del archivo a la publicación
        }
      }


      // Resetear el formulario
      const myForm = document.querySelector("#publication-form");
      myForm.reset();

      setStored("stored");
      setPosting(false); // Ocultar mensaje de "Posteando..."

      // Añadir animación antes de recargar la página
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.reload();
      }, 500); // La duración debe coincidir con la duración de la transición CSS
    } else {
      setStored("error");
      setPosting(false); // Ocultar mensaje de "Posteando..." en caso de error
    }
  };

  return (
    <aside className="layout__aside">
      <header className="aside__header">
        <h1 className="aside__title">Hola, {auth.name}</h1>
      </header>

      <div className="aside__container-form">
        {stored === "stored" ? (
          <strong className="alert alert-success">
            Publicado correctamente
          </strong>
        ) : (
          ""
        )}

        {stored === "error" ? (
          <strong className="alert alert-danger">
            No se ha publicado nada
          </strong>
        ) : (
          ""
        )}

        {posting && (
          <strong className="alert alert-info">
            Posteando...
          </strong>
        )}

        <form id='publication-form' className="container-form__form-post" onSubmit={savePublication}>
          <div className="form-post__inputs">
            <label htmlFor="post" className="form-post__label">¿Qué estás pensando hoy?</label>
            <textarea name="text" className="form-post__textarea" onChange={changed}></textarea>
          </div>

          <div className="form-post__inputs">
            <label htmlFor="image" className="form-post__label">Sube tu foto</label>
            <input type="file" name="file0" id='file' className="form-post__image" />
          </div>

          <input type="submit" value="Enviar" className="form-post__btn-submit" />
        </form>
      </div>
    </aside>
  );
};
