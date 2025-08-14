import { API_BASE_URL, handleResponse } from "./api.js"

export const authService = {

    login: async (email, password) => {
        try{
            const response = await fetch( `${API_BASE_URL}/login`, {
                method: 'POST'
                , headers: {
                    'Content-Type': 'application/json'
                }
                , body: JSON.stringify({
                    email, password
                })
            });

            const data = await handleResponse(response);

            if( data.idToken ){
                localStorage.setItem( 'authToken', data.idToken )
                const userInfo = decodeToken( data.idToken )
                localStorage.setItem('userInfo', JSON.stringify(userInfo) )
            }

            return data
        }catch(error){
            console.error('Error en login', error)
            throw error
        }
    },

    register: async (name, lastname, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    lastname,
                    email,
                    password
                })
            });

            const data = await handleResponse(response);
            return data;
        } catch (error) {
            console.error('Error en registro', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('authToken');
        if( !token ) return false;

        try{
            const userInfo = decodeToken(token);
            return userInfo.exp * 1000 > Date.now()
        } catch (error){
            return false;
        }
    },

    getCurrentUser: () => {
        try{
            const userInfo = localStorage.getItem("userInfo");
            return userInfo ? JSON.parse(userInfo) : null;
        }catch(error){
            return null;
        }
    },

    getToken: () => {
        return localStorage.getItem('authToken')
    }
};

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando token:', error);
    throw new Error('Token inválido');
  }
};