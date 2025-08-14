import { API_BASE_URL, handleResponse } from "./api.js";

export const artistService = {
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/artist`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener artistas:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/artist/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener artista:', error);
            throw error;
        }
    },

    create: async (artist) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/artist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_artist_type: artist.id_artist_type,
                    name: artist.name,
                    lastname: artist.lastname,        
                    gender: artist.gender,            
                    date_birth: artist.date_birth,    
                    active: artist.active ?? true
                })
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear artista:', error);
            throw error;
        }
    },

    update: async (id, artist) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/artist/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_artist_type: artist.id_artist_type,
                    name: artist.name,
                    description: artist.description,
                    active: artist.active ?? true
                })
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al actualizar artista:', error);
            throw error;
        }
    },

    deactivate: async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/artist/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al desactivar artista:', error);
            throw error;
        }
    }
};