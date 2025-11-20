// src/pages/admin/NewLugar.jsx (ajusta la ruta si la tienes en otra carpeta)

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import api from "../../config/api";

export default function NewLugar() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [zona, setZona] = useState(null);
  const [zonasDisponibles, setZonasDisponibles] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorZona, setErrorZona] = useState(false);

  const nameRef = useRef(null);
  const zonaRef = useRef(null);

  // Cargar zonas disponibles
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const res = await api.get("/api/lugares/zonas");
        setZonasDisponibles(res.data);
      } catch (error) {
        console.error("Error al cargar zonas:", error);
      }
    };
    if (token) fetchZonas();
  }, [token]);

  // Ocultar mensaje de éxito
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (zonaRef.current && !zonaRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!zona) {
      setErrorZona(true);
      return;
    }

    const nuevoLugar = {
      nombre,
      direccion,
      codigo: parseInt(codigo),
      zona: zona.id,
    };

    try {
      await api.post("/api/lugares", nuevoLugar);
      setSuccess(true);
      setTimeout(() => {
        navigate("/lugares");
      }, 1000);
    } catch (error) {
      console.error("Error al crear el lugar:", error.response?.data?.mensaje || error.message);
    }
  };

  const handleCancel = () => {
    setNombre("");
    setCodigo("");
    setDireccion("");
    setZona(null);
    setSuccess(false);
    setErrorZona(false);
    nameRef.current?.focus();
    navigate("/lugares");
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const selectZona = (zonaSeleccionada) => {
    setZona(zonaSeleccionada);
    setErrorZona(false);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-10 md:px-8">
      <div className="max-w-3xl mx-auto canchitas-section">
        {/* Header */}
        <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--canchitas-primary)]">
              Agregar establecimiento
            </h1>
            <p className="text-sm text-[var(--canchitas-text-muted)] mt-1">
              Completa los datos para registrar un nuevo lugar dentro de la
              plataforma.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/lugares")}
            className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--canchitas-primary)] hover:bg-black/5"
          >
            Volver al listado
          </button>
        </header>

        {success && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Lugar creado exitosamente.
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-[var(--canchitas-primary)] mb-1">
              Nombre del lugar o establecimiento *
            </label>
            <input
              ref={nameRef}
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Complejo Deportivo La 10"
              className="w-full rounded-xl border border-black/80 bg-transparent px-3 py-2 text-[var(--canchitas-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--canchitas-primary-soft)]"
            />
          </div>

          {/* Código */}
          <div className="grid gap-4 md:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] items-center">
            <div>
              <label className="block text-sm font-semibold text-[var(--canchitas-primary)] mb-1">
                Código del establecimiento *
              </label>
              <input
                type="number"
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Código interno"
                className="w-full rounded-xl border border-black/40 bg-transparent px-3 py-2 text-[var(--canchitas-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--canchitas-primary-soft)]"
              />
            </div>

            {/* Zona */}
            <div ref={zonaRef}>
              <label className="block text-sm font-semibold text-[var(--canchitas-primary)] mb-1">
                Zona *
              </label>
              <div
                onClick={toggleDropdown}
                className="w-full rounded-xl border border-black/40 bg-white px-3 py-2 text-sm flex justify-between items-center cursor-pointer"
              >
                <span className={zona ? "text-[var(--canchitas-primary)]" : "text-gray-400"}>
                  {zona ? zona.nombre : "Seleccione una zona"}
                </span>
                <svg
                  className={`h-4 w-4 text-[var(--canchitas-primary)] transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {isOpen && (
                <ul className="mt-1 max-h-48 overflow-auto rounded-xl border border-black/20 bg-white text-sm shadow-sm">
                  {zonasDisponibles.map((z) => (
                    <li
                      key={z.id}
                      onClick={() => selectZona(z)}
                      className="px-3 py-2 hover:bg-[var(--canchitas-bg)] cursor-pointer"
                    >
                      {z.nombre}
                    </li>
                  ))}
                </ul>
              )}
              {errorZona && (
                <p className="text-xs text-red-600 mt-1">
                  Por favor selecciona una zona.
                </p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-semibold text-[var(--canchitas-primary)] mb-1">
              Dirección exacta del lugar *
            </label>
            <input
              type="text"
              required
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej: Blvd. Los Próceres, contiguo a..."
              className="w-full rounded-xl border border-black/40 bg-transparent px-3 py-2 text-[var(--canchitas-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--canchitas-primary-soft)]"
            />
          </div>

          {/* Acciones */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-full border border-black/20 bg-white px-5 py-2 text-sm font-semibold text-[var(--canchitas-primary)] hover:bg-black/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[var(--canchitas-primary)] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80"
            >
              Crear lugar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
