export const getCookie = (cookieName: string, customCookies?: string) => {
  if (!cookieName || (typeof window === 'undefined' && !customCookies)) {
    return '';
  }
  const nombre = cookieName + '=';
  const cookies = customCookies
    ? customCookies.split(';')
    : document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    if (cookie.indexOf(nombre) === 0) {
      return cookie.substring(nombre.length, cookie.length);
    }
  }

  return null; // Si la cookie no se encuentra
};

export const setCookie = (
  cookieName: string,
  cookieValue: string,
  expirationDays: number | null = null
) => {
  if (!cookieName || typeof window === 'undefined') {
    return '';
  }

  if (expirationDays === null) {
    // Obtén la fecha actual
    const currentDate = new Date();

    // Configura la fecha de expiración a un valor lejano en el futuro (por ejemplo, 10 años)
    const expirationDate = new Date(
      currentDate.getFullYear() + 10,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    // Convierte la fecha de expiración a una cadena en el formato adecuado
    const expirationDateString = expirationDate.toUTCString();
    return (document.cookie = `${cookieName}=${cookieValue}; expires="${expirationDateString}"; path=/`);
  }

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);
  const expirationDateString = expirationDate.toUTCString();
  document.cookie = `${cookieName}=${cookieValue}; expires="${expirationDateString}"; path=/`;
};

export const updateCookie = (cookieName: string, cookieValue: string) => {
  const cookies = document.cookie.split(';'); // Obtén todas las cookies
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // Busca la cookie con el nombre especificado
    if (cookie.substring(0, cookieName.length + 1) === cookieName + '=') {
      // Obtiene los atributos de la cookie original
      const atributos = cookie.split(';');

      // Obtiene la fecha de vencimiento de la cookie original
      let fechaVencimiento;
      for (let j = 0; j < atributos.length; j++) {
        const atributo = atributos[j].trim();
        if (atributo.indexOf('expires=') === 0) {
          fechaVencimiento = atributo.substring('expires='.length);
          break;
        }
      }

      // Crea la nueva cookie con el nuevo valor y la fecha de vencimiento original
      const cookieActualizada =
        cookieName +
        '=' +
        cookieValue +
        '; expires=' +
        fechaVencimiento +
        '; path=/';
      document.cookie = cookieActualizada;
      break;
    }
  }
};

export const deleteCookie = (cookieName: string) => {
  if (!cookieName || typeof window === 'undefined') {
    return '';
  }
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
