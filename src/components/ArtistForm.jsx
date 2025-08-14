import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { artistService } from '../services';

const ArtistForm = ({ item, artistTypes, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        id_artist_type: item?.id_artist_type || '',
        name: item?.name || '',
        lastname: item?.lastname || '',
        gender: item?.gender || '',
        date_birth: item?.date_birth || '',
        active: item?.active ?? true,
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { validateToken } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!validateToken()) return;

        // Validaciones básicas
        if (!formData.id_artist_type.trim()) {
            setError('El tipo de artista es requerido');
            return;
        }

        if (!formData.name.trim() || !formData.lastname.trim()) {
            setError('Nombre y apellido son requeridos');
            return;
        }

        if (!formData.gender) {
            setError('El género es requerido');
            return;
        }

        if (!formData.date_birth) {
            setError('La fecha de nacimiento es requerida');
            return;
        }

        setIsSubmitting(true);

        try {
            setError('');
            let savedItem;

            if (item) {
                savedItem = await artistService.update(item.id, formData);
                if (!savedItem) {
                    savedItem = { ...item, ...formData };
                }
                onSuccess(savedItem, true);
            } else {
                savedItem = await artistService.create(formData);
                if (!savedItem) {
                    savedItem = {
                        id: Date.now().toString(),
                        ...formData
                    };
                }
                onSuccess(savedItem, false);
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            setError(error.message || 'Error al guardar el artista');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) handleSubmit();
        if (e.key === 'Escape') onCancel();
    };

    const activeArtistTypes = artistTypes.filter(type => type.active);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {item ? 'Editar Artista' : 'Nuevo Artista'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            <div className="flex items-center">
                                <span className="mr-2">❌</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="id_artist_type" className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Artista *
                            </label>
                            <select
                                id="id_artist_type"
                                name="id_artist_type"
                                value={formData.id_artist_type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Seleccionar tipo...</option>
                                {activeArtistTypes.map((type) => (
                                    <option key={type._id || type.id} value={type._id || type.id}>
                                        {type.description}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="Nombre del artista"
                                maxLength="100"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido *
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="Apellido del artista"
                                maxLength="100"
                            />
                        </div>

                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                Género *
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value="">Seleccionar género</option>
                                <option value="Male">Masculino</option>
                                <option value="Female">Femenino</option>
                                <option value="Other">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="date_birth" className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de nacimiento *
                            </label>
                            <input
                                type="date"
                                id="date_birth"
                                name="date_birth"
                                value={formData.date_birth}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                            />
                            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                                Activo
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-md"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistForm;
