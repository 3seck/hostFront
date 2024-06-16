import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../../assets/css/cookie.css'; // Asegúrate de crear un archivo CSS para los estilos de la ventana modal

const CookieModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: true,
    functional: true,
  });

  useEffect(() => {
    // Verificar si la cookie de consentimiento ya existe
    const cookieConsent = Cookies.get('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Establecer la cookie de consentimiento
    Cookies.set('cookieConsent', 'true', { expires: 365 }); // La cookie expirará en 1 año
    setIsVisible(false);
  };

  const handleReject = () => {
    // No establecer la cookie de consentimiento
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowCustomize(!showCustomize);
  };

  const togglePreference = (preference) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [preference]: !prevPreferences[preference],
    }));
  };

  return (
    isVisible && (
      <div className="cookie-modal">
        <div className="cookie-modal-content">
          <p>Usamos cookies para mejorar tu experiencia. Al continuar navegando aceptas nuestra política de cookies.</p>
          <div className="cookie-modal-buttons">
            <button onClick={handleAccept}>Aceptar</button>
            <button onClick={handleReject}>Rechazar</button>
            <button onClick={handleCustomize}>
              {showCustomize ? 'Ocultar' : 'Personalizar'}
            </button>
          </div>
          {showCustomize && (
            <div className="cookie-preferences">
              <button
                onClick={() => togglePreference('analytics')}
                className={preferences.analytics ? 'on' : 'off'}
              >
                Analytics: {preferences.analytics ? 'On' : 'Off'}
              </button>
              <button
                onClick={() => togglePreference('marketing')}
                className={preferences.marketing ? 'on' : 'off'}
              >
                Marketing: {preferences.marketing ? 'On' : 'Off'}
              </button>
              <button
                onClick={() => togglePreference('functional')}
                className={preferences.functional ? 'on' : 'off'}
              >
                Functional: {preferences.functional ? 'On' : 'Off'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default CookieModal;
