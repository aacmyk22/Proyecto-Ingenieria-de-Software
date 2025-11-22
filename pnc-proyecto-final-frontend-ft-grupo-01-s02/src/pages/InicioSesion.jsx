// src/pages/InicioSesion.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import api from "../config/api";

import Input from "../components/Input";
import Button from "../components/Button";

import iniciosesion1 from "/src/assets/futbol-americano.png";
import iniciosesion2 from "/src/assets/futbol-americano-negro.png";

function InicioSesion() {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState({});

  const handleInicioSesion = async () => {
    const nuevosErrores = {};

    if (!correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(correo)) {
      nuevosErrores.correo = "El correo no es válido.";
    }

    if (!contrasena.trim()) {
      nuevosErrores.contrasena = "La contraseña es obligatoria.";
    } else if (contrasena.length < 6) {
      nuevosErrores.contrasena = "Contraseña no válida";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});

    try {
      const response = await api.post("/api/auth/login", {
        correo,
        contrasena,
      });

      const data = response.data;
      console.log("Respuesta del backend:", data);

      const { token, role, usuario } = data;

      if (!token || !role) {
        alert("Respuesta inválida del servidor (falta token o rol)");
        return;
      }

      if (!usuario || (!usuario.idUsuario && !usuario.id && !usuario.userId)) {
        console.warn("⚠️ Respuesta sin usuario o sin id de usuario:", usuario);
        alert("Respuesta inválida del servidor (falta información del usuario)");
        return;
      }

      // ✅ Delega en el AuthProvider que guarde token, rol y user en localStorage/estado
      login(token, role, usuario);
      console.log("Login exitoso:", token, role, usuario);

      // Redirigir al inicio
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      const mensaje =
        error.response?.data?.mensaje || "Error al iniciar sesión";
      alert(mensaje);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] flex flex-col md:flex-row relative">
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2 rounded-full bg-[var(--canchitas-primary)] text-white hover:bg-black/80 z-50"
        aria-label="Volver"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </button>

      {/* Columna izquierda: imagen en fondo oscuro */}
      <div className="w-full md:w-1/2 section-dark flex items-center justify-center px-6 py-10">
        <div className="max-w-md w-full">
          <img
            src={iniciosesion1}
            alt="Jugador de fútbol"
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Columna derecha: tarjeta blanca sobre fondo crema */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md canchitas-section">
          {/* Logo y título */}
          <div className="flex flex-col items-center mb-6">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 mb-4"
            >
              <h1 className="text-xl font-bold text-[var(--canchitas-primary)]">
                Sport<span className="text-[#FF9900]">Match</span>
              </h1>
              <img src={iniciosesion2} alt="Logo" className="w-8 h-8" />
            </Link>

            <p className="text-sm text-[var(--canchitas-text-muted)]">
              ¡Hola de nuevo!
            </p>
            <h2 className="text-2xl font-semibold text-[var(--canchitas-primary)]">
              Inicia sesión
            </h2>
          </div>

          {/* Formulario */}
          <div className="space-y-4">
            {/* Correo */}
            <Input
              id="correo"
              label="Correo electrónico"
              type="email"
              placeholder="tu.correo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              error={errores.correo}
            />

            {/* Contraseña con icono de mostrar/ocultar */}
            <Input
              id="contrasena"
              label="Contraseña"
              type={mostrarContrasena ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              error={errores.contrasena}
              suffix={
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  className="cursor-pointer text-[var(--canchitas-primary-soft)]"
                >
                  {mostrarContrasena ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              }
            />

            {/* Botón y enlaces */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <Button variant="primary" fullWidth onClick={handleInicioSesion}>
                Iniciar sesión
              </Button>

              <p className="text-center text-sm text-[var(--canchitas-text-muted)]">
                ¿Todavía no tienes una cuenta?
              </p>
              <Link
                to="/registro"
                className="text-sm font-semibold text-[var(--canchitas-accent)] hover:underline"
              >
                Regístrate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InicioSesion;
