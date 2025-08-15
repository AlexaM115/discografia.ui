import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth(); // Removemos loading del contexto
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Evitar múltiples envíos
        if (isSubmitting) {
            return;
        }

        setError("");
        setIsSubmitting(true);

        // Validaciones básicas (solo formato, no complejidad)
        if (!email.trim()) {
            setError('El email es requerido');
            setIsSubmitting(false);
            return;
        }

        // Validación básica de formato de email (no tan estricta)
        if (!email.includes('@') || !email.includes('.')) {
            setError('Por favor ingresa un email válido');
            setIsSubmitting(false);
            return;
        }

        if (!password.trim()) {
            setError('La contraseña es requerida');
            setIsSubmitting(false);
            return;
        }
        
        // Sin validaciones complejas de contraseña para login
        // El servidor validará las credenciales

        try {
            console.log("Intentando login con:", { email, password: "***" });
            const result = await login(email, password);
            console.log("Resultado del login:", result);
            if (result) {
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            console.error("Error en login:", error);
            setError(error.message || 'Error al iniciar sesión. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md border border-purple-100">
                {/* Header */}
                <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
                    <span className="text-2xl text-white">📀</span>
                </div>
                <h1 className="text-2xl font-extrabold text-purple-900 tracking-tight">Discografía</h1>
                <p className="text-purple-600">Inicia sesión</p>
                </div>

                {/* Mensaje de error */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        <div className="flex items-center">
                            <span className="mr-2">❌</span>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Formulario */}
                <form className="space-y-4" noValidate>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-purple-800 mb-1">
                    Email
                    </label>
                    <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={ (e) => {
                        setEmail(e.target.value);
                        if (error) setError(''); // Limpiar error cuando el usuario escriba
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleLogin();
                        }
                    }}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-purple-800 mb-1">
                    Contraseña
                    </label>
                    <input
                    type="password"
                    id="password"
                    required
                    className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={ (e) => {
                        setPassword(e.target.value);
                        if (error) setError(''); // Limpiar error cuando el usuario escriba
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleLogin();
                        }
                    }}
                    />
                </div>

                <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
                </form>

                {/* Link de registro */}
                <p className="text-center text-sm text-purple-700 mt-4">
                ¿No tienes cuenta?{" "}
                <Link to="/signup" className="text-purple-600 hover:text-purple-700 underline">
                    Regístrate
                </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginScreen
