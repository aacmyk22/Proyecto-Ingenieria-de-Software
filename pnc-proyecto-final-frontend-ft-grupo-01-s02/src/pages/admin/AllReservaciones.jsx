// src/pages/admin/AllReservaciones.jsx  (o donde lo tengas)

import { useState, useEffect, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";

// Mock de datos para pruebas
const mockReservas = [
  { idReserva: 1, fechaReserva: "2025-06-09", fechaCreacion: "2025-06-05", horaEntrada: "17:00", horaSalida: "18:00", precioTotal: 35.0, estadoReserva: "PENDIENTE", usuario: "Carlos Dominguez", lugar: "Cancha #6" },
  { idReserva: 2, fechaReserva: "2025-06-25", fechaCreacion: "2025-06-09", horaEntrada: "17:00", horaSalida: "18:00", precioTotal: 40.0, estadoReserva: "FINALIZADA", usuario: "María López", lugar: "Cancha #3" },
  { idReserva: 3, fechaReserva: "2025-07-01", fechaCreacion: "2025-06-20", horaEntrada: "10:00", horaSalida: "11:30", precioTotal: 50.0, estadoReserva: "PENDIENTE", usuario: "Juan Pérez", lugar: "Cancha #1" },
  { idReserva: 4, fechaReserva: "2025-07-05", fechaCreacion: "2025-06-22", horaEntrada: "14:00", horaSalida: "15:00", precioTotal: 45.0, estadoReserva: "FINALIZADA", usuario: "Ana García", lugar: "Cancha #2" },
  { idReserva: 5, fechaReserva: "2025-07-10", fechaCreacion: "2025-06-25", horaEntrada: "12:00", horaSalida: "13:00", precioTotal: 55.0, estadoReserva: "PENDIENTE", usuario: "Luis Martínez", lugar: "Cancha #4" },
  { idReserva: 6, fechaReserva: "2025-07-12", fechaCreacion: "2025-06-30", horaEntrada: "09:00", horaSalida: "10:00", precioTotal: 30.0, estadoReserva: "FINALIZADA", usuario: "Patricia Torres", lugar: "Cancha #5" },
  { idReserva: 7, fechaReserva: "2025-07-15", fechaCreacion: "2025-07-01", horaEntrada: "16:00", horaSalida: "17:00", precioTotal: 38.0, estadoReserva: "PENDIENTE", usuario: "Ricardo Ruiz", lugar: "Cancha #6" },
  { idReserva: 8, fechaReserva: "2025-07-20", fechaCreacion: "2025-07-03", horaEntrada: "18:00", horaSalida: "19:30", precioTotal: 60.0, estadoReserva: "FINALIZADA", usuario: "Mónica Díaz", lugar: "Cancha #3" },
  { idReserva: 9, fechaReserva: "2025-07-22", fechaCreacion: "2025-07-05", horaEntrada: "11:00", horaSalida: "12:00", precioTotal: 42.0, estadoReserva: "PENDIENTE", usuario: "Diego Fernández", lugar: "Cancha #1" },
  { idReserva: 10, fechaReserva: "2025-07-25", fechaCreacion: "2025-07-10", horaEntrada: "13:00", horaSalida: "14:00", precioTotal: 48.0, estadoReserva: "FINALIZADA", usuario: "Laura Sánchez", lugar: "Cancha #2" },
  { idReserva: 11, fechaReserva: "2025-07-28", fechaCreacion: "2025-07-12", horaEntrada: "15:00", horaSalida: "16:00", precioTotal: 52.0, estadoReserva: "PENDIENTE", usuario: "Fernando Gómez", lugar: "Cancha #4" },
  { idReserva: 12, fechaReserva: "2025-07-30", fechaCreacion: "2025-07-15", horaEntrada: "17:30", horaSalida: "18:30", precioTotal: 58.0, estadoReserva: "FINALIZADA", usuario: "Sofía Castillo", lugar: "Cancha #5" },
];

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

export default function AllReservaciones() {
  const [reservas, setReservas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;
  const dateInputRef = useRef(null);

  useEffect(() => {
    setReservas(mockReservas);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pagina]);

  // Filtrar por fecha
  const reservasFiltradas = filtroFecha
    ? reservas.filter((r) => r.fechaReserva === filtroFecha)
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
            {actuales.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                <p className="text-sm text-[var(--canchitas-text-muted)]">
                  No hay reservaciones para la fecha seleccionada.
                </p>
              </div>
            ) : (
              actuales.map((reserva) => {
                const estadoClasses = getEstadoStyles(reserva.estadoReserva);
                const total = Number(reserva.precioTotal).toFixed(2);

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
                          {reserva.lugar}
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
                        <p className="font-medium">{reserva.fechaReserva}</p>

                        <p className="mt-2 text-[var(--canchitas-text-muted)] text-xs uppercase font-medium tracking-wide">
                          Fecha de compra
                        </p>
                        <p>{reserva.fechaCreacion}</p>
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
                        <p>{reserva.usuario}</p>
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
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
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
