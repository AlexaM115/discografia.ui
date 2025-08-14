import { API_BASE_URL, handleResponse } from "./api.js";

export const artistTypeService = {
    getAll: async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/artist_type`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener tipos de artista:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/artist_type/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener tipo de artista:', error);
            throw error;
        }
    },

    create: async (artistType) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/artist_type`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    description: artistType.description,
                    active: artistType.active ?? true
                })
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear tipo de artista:', error);
            throw error;
        }
    },

    update: async (id, artistType) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/artist_type/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    description: artistType.description,
                    active: artistType.active
                })
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al actualizar tipo de artista:', error);
            throw error;
        }
    },

    deactivate: async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/artist_type/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al desactivar tipo de artista:', error);
            throw error;
        }
    }
};