import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"

const Layout = ({ children }) => {
    const navigate = useNavigate()
    const { user, logout, validateToken } = useAuth()

    useEffect(() => {
        const interval = setInterval(() => {
            if (!validateToken()) {
                clearInterval(interval);
            }
        }, 60000);

        validateToken();

        return () => clearInterval(interval);
    }, [validateToken]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url('https://image.cdn2.seaart.me/static/images/20240419/17483a88f10d9873d56d639bc4d0fa31_high.webp')` }}
        >
            {/* Overlay semitransparente para mejorar la legibilidad del texto */}
            <div className="min-h-screen bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-indigo-900/60">
                <div className="bg-white/90 backdrop-blur-sm shadow-lg">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex justify-between items-center py-4 border-b border-purple-200">
                            <div>
                                <h1 className="text-2xl font-extrabold text-purple-900 tracking-tight">Discografía 🎵</h1>
                                <p className="text-purple-600">Hola {user ? `${user.firstname} ${user.lastname}` : 'usuario'}</p>
                            </div>
                            <button 
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-sm"
                                onClick={handleLogout}
                            >
                                Cerrar Sesión
                            </button>
                        </div>

                        <nav className="py-4">
                            <ul className="flex space-x-8">
                                <li>
                                    <button 
                                        className="flex items-center px-4 py-2 text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded-md transition-colors font-medium"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        <span className="mr-2">🏠</span>
                                        Inicio
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className="flex items-center px-4 py-2 text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded-md transition-colors font-medium"
                                        onClick={() => navigate('/artist-types')}
                                    >
                                        <span className="mr-2">🏷️</span>
                                        Tipos de Artista
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className="flex items-center px-4 py-2 text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded-md transition-colors font-medium"
                                        onClick={() => navigate('/artist')}
                                    >
                                        <span className="mr-2">📋</span>
                                        Artistas
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-8">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout