import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
// Asegúrate de que estos servicios están definidos y devuelven los datos esperados
import { artistTypeService, artistService } from '../services'; 
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import ArtistTypeForm from './ArtistTypeForm';

// Componente simulado de modal de confirmación
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-4">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Confirmar</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const ArtistTypesList = () => {
    const [artistTypes, setArtistTypes] = useState([]);
    const [artists, setArtists] = useState([]); // Estado para guardar la lista completa de artistas
    const [artistCounts, setArtistCounts] = useState({}); // Estado para el conteo de artistas por tipo
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [recentlyUpdated, setRecentlyUpdated] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false); // Estado para el modal de confirmación
    const [itemToDelete, setItemToDelete] = useState(null); // Item a desactivar o eliminar
    const { validateToken } = useAuth();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        // Recalcular los conteos cada vez que los tipos de artista o los artistas cambian
        if (artistTypes.length > 0 && artists.length > 0) {
            calculateArtistCounts();
        }
    }, [artistTypes, artists]);

    useEffect(() => {
        if (recentlyUpdated) {
            const timer = setTimeout(() => {
                setRecentlyUpdated(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [recentlyUpdated]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const loadData = async () => {
        if (!validateToken()) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');
            // Se cargan ambos datasets para hacer el conteo
            const artistTypesData = await artistTypeService.getAll();
            const artistsData = await artistService.getAll();
            
            console.log("Datos de Tipos de Artista cargados:", artistTypesData);
            console.log("Datos de Artistas cargados:", artistsData);
            
            if (Array.isArray(artistTypesData)) {
                setArtistTypes(artistTypesData);
            } else {
                console.error("artistTypeService.getAll() no devolvió un array. Se esperaba un array de tipos de artista.");
                setArtistTypes([]);
            }

            if (Array.isArray(artistsData)) {
                setArtists(artistsData);
            } else {
                console.error("artistService.getAll() no devolvió un array. Se esperaba un array de artistas.");
                setArtists([]);
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
            setError(error.message || 'Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };
    
    // Función para calcular el conteo de artistas por tipo
    const calculateArtistCounts = () => {
        const counts = artists.reduce((acc, artist) => {
            const artistTypeId = artist.id_artist_type;
            if (artistTypeId) {
                acc[artistTypeId] = (acc[artistTypeId] || 0) + 1;
            }
            return acc;
        }, {});
        
        console.log("Conteo de artistas calculado:", counts);
        setArtistCounts(counts);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    // Nueva función para abrir el modal de confirmación
    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setShowModal(true);
    };

    // Función para confirmar la eliminación o desactivación
    const handleConfirmDelete = async () => {
        setShowModal(false);
        if (!validateToken() || !itemToDelete) {
            return;
        }
        
        const artistCount = artistCounts[itemToDelete.id] || 0;
        const hasArtists = artistCount > 0;
        const action = hasArtists ? 'desactivar' : 'eliminar';

        try {
            setError('');
            // TODO: La función deactivate debe manejar la lógica de desactivar vs eliminar
            await artistTypeService.deactivate(itemToDelete.id);
            await loadData();
            const message = hasArtists
                ? 'Tipo de artista desactivado exitosamente'
                : 'Tipo de artista eliminado exitosamente';
            setSuccessMessage(message);
        } catch (error) {
            console.error('Error al procesar:', error);
            setError(error.message || `Error al ${action} el tipo de artista`);
        } finally {
            setItemToDelete(null);
        }
    };
    
    const handleCancelDelete = () => {
        setShowModal(false);
        setItemToDelete(null);
    };

    const handleFormSuccess = async (savedItem, isEdit = false) => {
        await loadData();
        setRecentlyUpdated(savedItem.id);

        const message = isEdit ? 'Tipo de artista actualizado exitosamente' : 'Tipo de artista creado exitosamente';
        setSuccessMessage(message);
        setShowForm(false);
        setEditingItem(null);
        setError('');
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">Cargando tipos de artista...</div>
            </div>
        );
    }
    
    // Mensajes para el modal de confirmación
    const modalTitle = itemToDelete ? (
        (artistCounts[itemToDelete.id] || 0) > 0 ? "Desactivar Tipo de Artista" : "Eliminar Tipo de Artista"
    ) : "";

    const modalMessage = itemToDelete ? (
        (artistCounts[itemToDelete.id] || 0) > 0
            ? `El tipo "${itemToDelete.description}" tiene ${artistCounts[itemToDelete.id]} artista(s) asociado(s). Se desactivará pero se mantendrá en el sistema para conservar la integridad de los datos.`
            : `Estás a punto de eliminar permanentemente el tipo de artista "${itemToDelete.description}". Esta acción no se puede deshacer.`
    ) : "";
    
    console.log("Estado final para renderizar:", { artistTypes, artistCounts });

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Tipos de Artista</h1>
                <button
                    onClick={handleCreate}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    + Nuevo Tipo
                </button>
            </div>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">✅</span>
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">❌</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descripción
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cantidad de Artistas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {artistTypes.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No hay tipos de artista registrados
                                </td>
                            </tr>
                        ) : (
                            artistTypes.map((item) => (
                                <tr 
                                    key={item.id} 
                                    className={`hover:bg-gray-50 transition-colors ${
                                        recentlyUpdated === item.id 
                                            ? 'bg-green-50 border-l-4 border-green-400' 
                                            : ''
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                (artistCounts[item.id] || 0) > 0 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {artistCounts[item.id] || 0} artistas
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                item.active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {item.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            Editar
                                        </button>
                                        {item.active && (
                                            <button
                                                onClick={() => handleDeleteClick(item)}
                                                className={`${
                                                    (artistCounts[item.id] || 0) > 0
                                                        ? 'text-orange-600 hover:text-orange-900'
                                                        : 'text-red-600 hover:text-red-900'
                                                }`}
                                            >
                                                {(artistCounts[item.id] || 0) > 0 ? 'Desactivar' : 'Eliminar'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <ArtistTypeForm
                    item={editingItem}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}

            <ConfirmationModal
                isOpen={showModal}
                title={modalTitle}
                message={modalMessage}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </Layout>
    );
};

export default ArtistTypesList;