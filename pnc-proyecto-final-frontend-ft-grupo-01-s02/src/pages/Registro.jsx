// src/pages/Registro.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../config/api";

import Input from "../components/Input";
import Button from "../components/Button";

import registro1 from "/src/assets/futbol-americano.png";
import registro2 from "/src/assets/futbol-americano-negro.png";

function Registro() {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState({});

  const handleRegistro = async () => {
    const nuevosErrores = {};

    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!apellido.trim())
      nuevosErrores.apellido = "El apellido es obligatorio.";

    if (!correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(correo)) {
      nuevosErrores.correo = "El correo no es válido.";
    }

    if (!contrasena.trim()) {
      nuevosErrores.contrasena = "La contraseña es obligatoria.";
    } else if (contrasena.length < 6) {
      nuevosErrores.contrasena = "Debe tener al menos 6 caracteres.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});

    try {
      const response = await api.post("/api/usuarios", {
        nombre,
        apellido,
        correo,
        contrasena,
        rolId: 2, // cliente
      });

      const data = response.data;
      console.log("Registro exitoso:", data);
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error);
      const mensaje = error.response?.data?.mensaje || "Hubo un error al registrar. Verifica los datos.";
      alert(mensaje);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] flex flex-col md:flex-row relative overflow-x-hidden">
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2 rounded-full bg-[var(--canchitas-primary)] text-white hover:bg-black/80 z-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
            src={registro1}
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
              <img src={registro2} alt="Logo" className="w-8 h-8" />
            </Link>

            <p className="text-sm text-[var(--canchitas-text-muted)]">
              Crea tu cuenta y reserva tu próxima cancha.
            </p>
            <h2 className="text-2xl font-semibold text-[var(--canchitas-primary)]">
              Crear una cuenta
            </h2>
          </div>

          {/* Formulario */}
          <div className="space-y-4">
            <Input
              id="nombre"
              label="Nombre"
              type="text"
              placeholder="Ingresa tu nombre"
              value={nombre}
              maxLength={30}
              onChange={(e) => {
                setNombre(e.target.value);
                if (errores.nombre) setErrores(prev => ({ ...prev, nombre: "" }));
              }}
              error={errores.nombre}
              required
            />

            <Input
              id="apellido"
              label="Apellido"
              type="text"
              placeholder="Ingresa tu apellido"
              value={apellido}
              maxLength={30}
              onChange={(e) => {
                setApellido(e.target.value);
                if (errores.apellido) setErrores(prev => ({ ...prev, apellido: "" }));
              }}
              error={errores.apellido}
              required
            />

            <Input
              id="correo"
              label="Correo electrónico"
              type="email"
              placeholder="tu.correo@ejemplo.com"
              value={correo}
              maxLength={50}
              onChange={(e) => {
                setCorreo(e.target.value);
                if (errores.correo) setErrores(prev => ({ ...prev, correo: "" }));
              }}
              error={errores.correo}
              required
            />

            {/* Contraseña con icono de mostrar/ocultar */}
            <Input
              id="contrasena"
              label="Contraseña"
              type={mostrarContrasena ? "text" : "password"}
              placeholder="Crea una contraseña segura"
              value={contrasena}
              maxLength={50}
              onChange={(e) => {
                setContrasena(e.target.value);
                if (errores.contrasena) setErrores(prev => ({ ...prev, contrasena: "" }));
              }}
              error={errores.contrasena}
              required
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

            {/* Botón y textos inferiores */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <Button variant="primary" fullWidth onClick={handleRegistro}>
                Regístrate
              </Button>

              <p className="text-xs text-center text-[var(--canchitas-text-muted)]">
                Al hacer clic en &quot;Regístrate&quot;, crearás una cuenta en
                Canchitas y aceptarás nuestros Términos de Uso y Política de
                Privacidad.
              </p>

              <p className="text-center text-sm text-[var(--canchitas-text-muted)] mt-2">
                ¿Ya tienes una cuenta?
              </p>
              <Link
                to="/login"
                className="text-sm font-semibold text-[var(--canchitas-accent)] hover:underline"
              >
                Inicia sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;
