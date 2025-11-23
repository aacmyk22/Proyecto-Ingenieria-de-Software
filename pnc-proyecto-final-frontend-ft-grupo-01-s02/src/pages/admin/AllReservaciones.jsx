// src/pages/admin/AllReservaciones.jsx
import { useState, useEffect, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import api from "../../config/api";
import { useAuth } from "../../context/AuthProvider";

function getEstadoStyles(estado = "") {
  const normalized = estado.toUpperCase();
  if (normalized.includes("PEND")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (normalized.includes("FINAL")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
}

// Normaliza fechas tipo "2025-07-10" o "2025-07-10T00:00:00"
const normalizarFecha = (fecha) => {
  if (!fecha) return "";
  return fecha.split("T")[0];
};

export default function AllReservaciones() {
  const { token } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const porPagina = 5;
  const dateInputRef = useRef(null);

  // Cargar reservas desde el backend
  useEffect(() => {
    const cargarReservas = async () => {
      if (!token) return; // por si alguien entra sin loguearse

      try {
        setCargando(true);
        setError(null);

        // Usa tu axios config (baseURL + Authorization)
        const response = await api.get("/api/reservas");

        // El backend devuelve una lista de ReservaResponseDTO
        // La guardamos tal cual, solo nos aseguramos de que sea array
        const data = Array.isArray(response.data) ? response.data : [];
        setReservas(data);
      } catch (err) {
        console.error("Error cargando reservas:", err);
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Error al cargar reservaciones";
        setError(msg);
      } finally {
        setCargando(false);
      }
    };

    cargarReservas();
  }, [token]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pagina]);

  // Filtrar por fecha (comparando solo YYYY-MM-DD)
  const reservasFiltradas = filtroFecha
    ? reservas.filter(
        (r) => normalizarFecha(r.fechaReserva) === filtroFecha
      )
    : reservas;

  // Paginación
  const totalPaginas = Math.ceil(reservasFiltradas.length / porPagina) || 1;
  const inicio = (pagina - 1) * porPagina;
  const actuales = reservasFiltradas.slice(inicio, inicio + porPagina);

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-10 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <section className="canchitas-section">
          {/* Encabezado */}
          <header className="flex flex-col gap-2 mb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--canchitas-primary)]">
                Reservaciones actuales
              </h1>
              <p className="text-sm text-[var(--canchitas-text-muted)] mt-1">
                Revisa todas las reservaciones registradas en la plataforma.
              </p>
              {error && (
                <p className="text-sm text-red-600 mt-2">
                  {error}
                </p>
              )}
            </div>

            {/* Filtro por fecha */}
            <div className="flex items-center gap-3 mt-2 md:mt-0">
              <label className="text-xs font-medium text-[var(--canchitas-text-muted)] uppercase tracking-wide">
                Filtrar por fecha
              </label>
              <div className="relative">
                <input
                  ref={dateInputRef}
                  type="date"
                  value={filtroFecha}
                  onChange={(e) => {
                    setFiltroFecha(e.target.value);
                    setPagina(1);
                  }}
                  className="w-44 md:w-52 rounded-full border border-slate-300 bg-white px-3 pr-10 py-2 text-sm text-slate-900 shadow-sm focus:border-[var(--canchitas-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--canchitas-accent-soft)]"
                />
                <FaCalendarAlt
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer"
                  onClick={() => {
                    if (dateInputRef.current?.showPicker) {
                      dateInputRef.current.showPicker();
                    } else {
                      dateInputRef.current?.focus();
                    }
                  }}
                />
              </div>
              {filtroFecha && (
                <button
                  onClick={() => {
                    setFiltroFecha("");
                    setPagina(1);
                  }}
                  className="text-xs rounded-full border border-slate-300 px-3 py-1 text-slate-600 hover:bg-slate-50"
                >
                  Limpiar
                </button>
              )}
            </div>
          </header>

          {/* Lista de reservas */}
          <div className="mt-4 space-y-4">
            {cargando ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center">
                <p className="text-sm text-[var(--canchitas-text-muted)]">
                  Cargando reservaciones...
                </p>
              </div>
            ) : actuales.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                <p className="text-sm text-[var(--canchitas-text-muted)]">
                  No hay reservaciones para la fecha seleccionada.
                </p>
              </div>
            ) : (
              actuales.map((reserva) => {
                const estadoClasses = getEstadoStyles(reserva.estadoReserva);
                const total = Number(reserva.precioTotal || 0).toFixed(2);

                return (
                  <article
                    key={reserva.idReserva}
                    className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm flex flex-col gap-3"
                  >
                    {/* Top row: id + estado */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-[var(--canchitas-text-muted)]">
                          Reserva #{reserva.idReserva}
                        </p>
                        <p className="text-sm font-semibold text-[var(--canchitas-primary)]">
                          {reserva.nombreLugar}{" "}
                          {reserva.nombreCancha
                            ? `- ${reserva.nombreCancha}`
                            : ""}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${estadoClasses}`}
                      >
                        {reserva.estadoReserva === "PENDIENTE"
                          ? "Pendiente"
                          : "Finalizada"}
                      </span>
                    </div>

                    {/* Grid de detalles */}
                    <div className="grid gap-3 text-sm text-[var(--canchitas-text)] md:grid-cols-3">
                      <div className="space-y-1">
                        <p className="text-[var(--canchitas-text-muted)] text-xs uppercase font-medium tracking-wide">
                          Fecha de reserva
                        </p>
                        <p className="font-medium">
                          {normalizarFecha(reserva.fechaReserva)}
                        </p>

                        <p className="mt-2 text-[var(--canchitas-text-muted)] text-xs uppercase font-medium tracking-wide">
                          Fecha de compra
                        </p>
                        <p>{normalizarFecha(reserva.fechaCreacion)}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[var(--canchitas-text-muted)] text-xs uppercase font-medium tracking-wide">
                          Horario
                        </p>
                        <p>
                          {reserva.horaEntrada} – {reserva.horaSalida}
                        </p>

                        <p className="mt-2 text-[var(--canchitas-text-muted)] text-xs uppercase font-medium tracking-wide">
                          Usuario
                        </p>
                        <p>{reserva.nombreUsuario}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[var(--canchitas-text-muted)] text-xs uppercase font-medium tracking-wide">
                          Monto
                        </p>
                        <p className="text-base font-semibold text-[var(--canchitas-accent)]">
                          ${total}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-[var(--canchitas-text-muted)]">
                Página{" "}
                <span className="font-semibold text-[var(--canchitas-primary)]">
                  {pagina}
                </span>{" "}
                de {totalPaginas}
              </span>
              <button
                onClick={() =>
                  setPagina((p) => Math.min(totalPaginas, p + 1))
                }
                disabled={pagina === totalPaginas}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
