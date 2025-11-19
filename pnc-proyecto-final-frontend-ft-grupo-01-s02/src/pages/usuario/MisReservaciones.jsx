// src/pages/reservas/MisReservaciones.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

function getEstadoStyles(estado = "") {
  const normalized = estado.toUpperCase();

  if (normalized.includes("CONFIRM")) {
    // CONFIRMADA / CONFIRMADO
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (normalized.includes("PEND")) {
    // PENDIENTE
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (normalized.includes("CANCEL")) {
    // CANCELADA
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  // fallback
  return "bg-slate-50 text-slate-700 border-slate-200";
}

function MisReservaciones() {
  const { token, usuario } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!usuario?.idUsuario || !token) return;

    const cargarReservas = async () => {
      try {
        setCargando(true);
        setError(null);

        const res = await fetch(
          `http://localhost:8080/api/reservas/${usuario.idUsuario}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Error al cargar reservas");
        }

        const data = await res.json();
        setReservas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus reservaciones.");
      } finally {
        setCargando(false);
      }
    };

    cargarReservas();
  }, [usuario?.idUsuario, token]);

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-10 md:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <section className="canchitas-section">
          {/* Encabezado */}
          <header className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--canchitas-primary)]">
              Mis reservaciones
            </h1>
            <p className="mt-1 text-sm text-[var(--canchitas-text-muted)]">
              Aquí podrás ver el historial de canchas que has reservado en
              Canchitas.
            </p>
          </header>

          {/* Mensajes de estado */}
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          )}

          {cargando && (
            <p className="text-sm text-[var(--canchitas-text-muted)]">
              Cargando tus reservaciones…
            </p>
          )}

          {!cargando && !error && reservas.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm text-[var(--canchitas-text-muted)] mb-2">
                Aún no tienes reservaciones registradas.
              </p>
              <Link
                to="/reservar"
                className="inline-flex items-center justify-center rounded-full bg-[var(--canchitas-accent)] px-5 py-2 text-sm font-semibold text-white hover:brightness-105 transition"
              >
                Crear mi primera reserva
              </Link>
            </div>
          )}

          {/* Lista de reservas */}
          {!cargando && reservas.length > 0 && (
            <div className="mt-4 space-y-4">
              {reservas.map((r) => {
                const estadoClasses = getEstadoStyles(r.estadoReserva);
                const total =
                  r.precioTotal != null && !Number.isNaN(Number(r.precioTotal))
                    ? Number(r.precioTotal).toFixed(2)
                    : r.precioTotal ?? "-";

                return (
                  <article
                    key={r.idReserva}
                    className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm flex flex-col gap-3"
                  >
                    {/* Fila superior: título + estado */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-[var(--canchitas-text-muted)]">
                          Reserva #{r.idReserva}
                        </p>
                        <p className="text-base font-semibold text-[var(--canchitas-primary)]">
                          {r.nombreUsuario || "Reserva de cancha"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${estadoClasses}`}
                      >
                        {r.estadoReserva}
                      </span>
                    </div>

                    {/* Detalles */}
                    <div className="grid sm:grid-cols-2 gap-3 text-sm text-[var(--canchitas-text)]">
                      <div className="space-y-1">
                        <p>
                          <span className="font-medium">Fecha:</span>{" "}
                          {r.fechaReserva}
                        </p>
                        <p>
                          <span className="font-medium">Horario:</span>{" "}
                          {r.horaEntrada} – {r.horaSalida}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p>
                          <span className="font-medium">Total pagado:</span>{" "}
                          {total !== "-"
                            ? `$${total}`
                            : "No disponible"}
                        </p>
                        {/* Aquí luego puedes agregar nombre de cancha / zona si la API lo devuelve */}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MisReservaciones;
