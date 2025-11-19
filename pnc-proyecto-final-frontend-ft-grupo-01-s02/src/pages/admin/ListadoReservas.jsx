// src/pages/admin/ListadoReservas.jsx (ruta de ejemplo)

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

function ListadoReservas() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [reservasPendientes, setReservasPendientes] = useState([]);
  const [reservasRealizadas, setReservasRealizadas] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/reservas", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos recibidos desde el backend:", data);

        setReservasPendientes(
          data.filter((r) => r.estadoReserva?.toUpperCase() === "PENDIENTE")
        );

        setReservasRealizadas(
          data.filter((r) => {
            const estado = r.estadoReserva?.toUpperCase();
            return estado === "REALIZADA" || estado === "FINALIZADA";
          })
        );
      })
      .catch((err) => console.error("Error cargando reservas:", err));
  }, [token]);

  const renderReservaCard = (r, variante) => {
    const isPendiente = variante === "pendiente";

    const borderClass = isPendiente
      ? "border-amber-300 bg-amber-50/80"
      : "border-emerald-300 bg-emerald-50/80";

    const badgeClass = isPendiente
      ? "bg-amber-100 text-amber-800"
      : "bg-emerald-100 text-emerald-800";

    const badgeText = isPendiente ? "Pendiente" : "Realizada";

    return (
      <article
        key={r.idReserva}
        className={`rounded-2xl border px-4 py-4 md:px-5 md:py-4 text-sm ${borderClass}`}
      >
        <header className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold text-[var(--canchitas-text-muted)] uppercase tracking-wide">
            Reserva #{r.idReserva}
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
          >
            {badgeText}
          </span>
        </header>

        <div className="grid gap-2 md:grid-cols-2 text-[13px] text-[var(--canchitas-text)]">
          <div>
            <p className="font-semibold text-[var(--canchitas-primary)]">
              Usuario
            </p>
            <p>{r.nombreUsuario}</p>
          </div>
          <div>
            <p className="font-semibold text-[var(--canchitas-primary)]">
              Fecha de reserva
            </p>
            <p>{r.fechaReserva}</p>
          </div>

          <div>
            <p className="font-semibold text-[var(--canchitas-primary)]">
              Horario
            </p>
            <p>
              {r.horaEntrada} – {r.horaSalida}
            </p>
          </div>
          <div>
            <p className="font-semibold text-[var(--canchitas-primary)]">
              Estado
            </p>
            <p>{r.estadoReserva}</p>
          </div>

          <div>
            <p className="font-semibold text-[var(--canchitas-primary)]">
              Total
            </p>
            <p>${r.precioTotal}</p>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-10 md:px-8">
      <div className="max-w-5xl mx-auto canchitas-section">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--canchitas-primary)]">
              Reservas de la cancha
            </h1>
            <p className="text-sm text-[var(--canchitas-text-muted)] mt-1">
              Consulta el historial de reservas separadas por estado.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-full bg-[var(--canchitas-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80"
          >
            Volver
          </button>
        </header>

        {/* Contenido */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pendientes */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--canchitas-text-muted)]">
              Pendientes
            </h2>

            {reservasPendientes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-amber-200 bg-white/70 px-4 py-6 text-xs text-amber-700">
                No hay reservas pendientes.
              </div>
            ) : (
              <div className="space-y-3">
                {reservasPendientes.map((r) =>
                  renderReservaCard(r, "pendiente")
                )}
              </div>
            )}
          </section>

          {/* Realizadas */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--canchitas-text-muted)]">
              Realizadas
            </h2>

            {reservasRealizadas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-white/70 px-4 py-6 text-xs text-emerald-700">
                No hay reservas realizadas.
              </div>
            ) : (
              <div className="space-y-3">
                {reservasRealizadas.map((r) =>
                  renderReservaCard(r, "realizada")
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ListadoReservas;
