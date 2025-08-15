import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, validatePassword, getPasswordStrength } from "../utils/validators";

const SignupScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSignup = async () => {
    if (isSubmitting) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      setError("El nombre es requerido");
      setIsSubmitting(false);
      return;
    }
    if (!formData.lastname.trim()) {
      setError("El apellido es requerido");
      setIsSubmitting(false);
      return;
    }
    if (!formData.email.trim()) {
      setError("El email es requerido");
      setIsSubmitting(false);
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError("Por favor ingresá un email válido");
      setIsSubmitting(false);
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await register(
        formData.name,
        formData.lastname,
        formData.email,
        formData.password
      );
      if (result) {
        setSuccess("¡Cuenta creada exitosamente!");
        setShowSuccessModal(true);
        setFormData({
          name: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setError(error?.message || "Error al crear la cuenta. Intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md border border-purple-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
            <span className="text-2xl text-white">📀</span>
          </div>
          <h1 className="text-2xl font-extrabold text-purple-900 tracking-tight">Discografía</h1>
          <p className="text-purple-600">Crear cuenta nueva</p>
        </div>

        {/* Mensajes */}
        {error && (
          <div
            className={`mb-4 p-3 rounded-md border ${
              error.includes("email ya está registrado") || error.includes("usuario ya existe")
                ? "bg-amber-50 border-amber-300 text-amber-700"
                : "bg-red-50 border-red-300 text-red-700"
            }`}
          >
            <div className="flex items-center">
              <span className="mr-2">
                {error.includes("email ya está registrado") || error.includes("usuario ya existe")
                  ? "⚠️"
                  : "❌"}
              </span>
              <span>{error}</span>
            </div>
            {(error.includes("email ya está registrado") || error.includes("usuario ya existe")) && (
              <div className="mt-2 text-sm">
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 underline">
                  ¿Ya tenés cuenta? Iniciá sesión acá
                </Link>
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-md">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form
          className="space-y-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-purple-800 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Juan"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-purple-800 mb-1">
                Apellido
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Pérez"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-purple-800 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="usuario2@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-purple-800 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="8-64 caracteres, 1 mayúscula, 1 número, 1 especial"
            />

            {/* Indicador de fortaleza */}
            {formData.password && (
              <div className="mt-2">
                <div className="text-xs text-purple-700/80 mb-1">Requisitos de contraseña:</div>
                <div className="space-y-1">
                  {(() => {
                    const strength = getPasswordStrength(formData.password);
                    return (
                      <>
                        <div
                          className={`text-xs flex items-center ${
                            strength.isValidLength ? "text-emerald-600" : "text-purple-400"
                          }`}
                        >
                          <span className="mr-1">{strength.isValidLength ? "✓" : "○"}</span>
                          8-64 caracteres
                        </div>
                        <div
                          className={`text-xs flex items-center ${
                            strength.hasUppercase ? "text-emerald-600" : "text-purple-400"
                          }`}
                        >
                          <span className="mr-1">{strength.hasUppercase ? "✓" : "○"}</span>
                          Al menos una mayúscula
                        </div>
                        <div
                          className={`text-xs flex items-center ${
                            strength.hasNumber ? "text-emerald-600" : "text-purple-400"
                          }`}
                        >
                          <span className="mr-1">{strength.hasNumber ? "✓" : "○"}</span>
                          Al menos un número
                        </div>
                        <div
                          className={`text-xs flex items-center ${
                            strength.hasSpecialChar ? "text-emerald-600" : "text-purple-400"
                          }`}
                        >
                          <span className="mr-1">{strength.hasSpecialChar ? "✓" : "○"}</span>
                          Carácter especial (@$!%*?&)
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-800 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Confirmá tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>

        {/* Link de login */}
        <p className="text-center text-sm text-purple-700 mt-4">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-purple-600 hover:text-purple-700 underline">
            Iniciá sesión
          </Link>
        </p>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-xl w-11/12 max-w-md p-6 border border-purple-100">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-emerald-500 to-teal-500">
                <span className="text-white">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-purple-900">Cuenta creada</h3>
            </div>
            <p className="text-purple-800/90 mb-4">
              {success} Presioná “Aceptar” para ir al login.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate("/login", { replace: true })}
                className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupScreen;
