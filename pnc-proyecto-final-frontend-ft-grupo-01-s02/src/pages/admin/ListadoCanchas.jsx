// src/pages/admin/ListadoCanchas.jsx (ruta de ejemplo)

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const diasSemana = [
  "LUNES",
  "MARTES",
  "MIÉRCOLES",
  "JUEVES",
  "VIERNES",
  "SÁBADO",
  "DOMINGO",
];

function ListadoCanchas() {
  const [pagina, setPagina] = useState(1);
  const [canchas, setCanchas] = useState([]);
  const [alertaEliminado, setAlertaEliminado] = useState(false);
  const [alertaError, setAlertaError] = useState(false);
  const [diasSeleccionados, setDiasSeleccionados] = useState({});
  const [jornadasPorCancha, setJornadasPorCancha] = useState({});
  const porPagina = 3;

  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  // Cargar canchas y jornadas iniciales
  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:8080/api/lugares/${id}/canchas`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCanchas(data);
        data.forEach((cancha) => {
          const diaInicial = "LUNES";
          setDiasSeleccionados((prev) => ({
            ...prev,
            [cancha.id]: diaInicial,
          }));
          cargarJornadas(cancha.id, diaInicial);
        });
      })
      .catch((err) => console.error("Error cargando canchas:", err));
  }, [id, token]); // 👈 mismos datos, sólo se añade token

  const cargarJornadas = async (canchaId, dia) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/canchas/${canchaId}/jornadas?dia=${dia}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setJornadasPorCancha((prev) => ({
          ...prev,
          [canchaId]: {
            ...(prev[canchaId] || {}),
            [dia]: data,
          },
        }));
      }
    } catch (err) {
      console.error(
        `Error cargando jornadas de cancha ${canchaId} para el día ${dia}:`,
        err
      );
    }
  };

  const cambiarDia = (canchaId, dia) => {
    setDiasSeleccionados((prev) => ({ ...prev, [canchaId]: dia }));
    cargarJornadas(canchaId, dia);
  };

  const handleEliminarCancha = async (canchaId) => {
    const confirmacion = confirm(
      "¿Estás seguro de que deseas eliminar esta cancha?"
    );
    if (!confirmacion) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/canchas/${canchaId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setCanchas((prev) => prev.filter((c) => c.id !== canchaId));
        setAlertaEliminado(true);
        setTimeout(() => setAlertaEliminado(false), 2000);
      } else {
        setAlertaError(true);
        setTimeout(() => setAlertaError(false), 2000);
      }
    } catch (error) {
      console.error("Error al hacer la solicitud DELETE:", error);
      setAlertaError(true);
      setTimeout(() => setAlertaError(false), 2000);
    }
  };

  const totalPaginas = Math.ceil(canchas.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const canchasPaginadas = canchas.slice(inicio, inicio + porPagina);

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-10 md:px-8">
      <div className="max-w-5xl mx-auto canchitas-section">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/lugares")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--canchitas-primary)] text-white hover:bg-black/80"
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
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--canchitas-primary)]">
                Canchas del lugar
              </h1>
              <p className="text-sm text-[var(--canchitas-text-muted)]">
                Administra las canchas registradas y revisa sus horarios por día.
              </p>
            </div>
          </div>

          <Link
            to={`/crear_cancha?lugarId=${id}`}
            className="inline-flex items-center justify-center rounded-full bg-[var(--canchitas-accent)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--canchitas-accent-strong)]"
          >
            Crear nueva cancha
          </Link>
        </header>

        {/* Alertas */}
        <div className="space-y-2 mb-4">
          {alertaEliminado && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Cancha eliminada correctamente.</span>
            </div>
          )}

          {alertaError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v3.75m0 3.75h.007v.008H12v-.008zM21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
                />
              </svg>
              <span>Ocurrió un error al intentar eliminar la cancha.</span>
            </div>
          )}
        </div>

        {/* Contenido */}
        {canchas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-10 text-center">
            <p className="text-sm text-[var(--canchitas-text-muted)]">
              No hay canchas registradas aún para este lugar.
            </p>
            <p className="mt-2 text-sm">
              Usa el botón{" "}
              <span className="font-semibold">“Crear nueva cancha”</span> para
              agregar la primera.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {canchasPaginadas.map((cancha) => {
                const diaActual =
                  diasSeleccionados[cancha.id] || "LUNES";
                const jornadasDelDia =
                  jornadasPorCancha[cancha.id]?.[diaActual] || [];

                return (
                  <article
                    key={cancha.id}
                    className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 md:px-5 md:py-5 space-y-4"
                  >
                    {/* Info principal + días */}
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                      <div>
                        <h2 className="text-lg md:text-xl font-semibold text-[var(--canchitas-primary)]">
                          {cancha.nombre}
                        </h2>
                        <p className="text-sm text-[var(--canchitas-text-muted)] capitalize">
                          {cancha.tipoCancha}
                        </p>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap gap-1 md:justify-end">
                          {diasSemana.map((dia) => (
                            <button
                              key={dia}
                              onClick={() =>
                                cambiarDia(cancha.id, dia)
                              }
                              className={`px-3 py-1 text-[11px] md:text-xs rounded-full border transition-colors ${
                                diaActual === dia
                                  ? "bg-[var(--canchitas-primary)] text-white border-[var(--canchitas-primary)]"
                                  : "bg-white text-[var(--canchitas-text)] border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              {dia}
                            </button>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2 md:justify-end">
                          {jornadasDelDia.length > 0 ? (
                            jornadasDelDia.map((j, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--canchitas-accent-soft)] text-[var(--canchitas-accent)]"
                              >
                                {j.horaInicio}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500">
                              No hay horarios para este día.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap justify-end gap-2 pt-2">
                      <button
                        className="rounded-full border border-slate-300 bg-slate-50 px-4 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                        onClick={() => handleEliminarCancha(cancha.id)}
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/canchas/${cancha.id}/reservas`)
                        }
                        className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-[var(--canchitas-primary)] hover:bg-slate-50"
                      >
                        Ver reservas
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/editar_cancha/${cancha.id}`)
                        }
                        className="rounded-full bg-[var(--canchitas-accent)] px-4 py-1.5 text-xs font-medium text-white hover:bg-[var(--canchitas-accent-strong)]"
                      >
                        Editar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPagina((p) => p - 1)}
                  disabled={pagina === 1}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-[var(--canchitas-text)] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-sm font-medium text-[var(--canchitas-text-muted)]">
                  Página {pagina} de {totalPaginas}
                </span>
                <button
                  onClick={() => setPagina((p) => p + 1)}
                  disabled={pagina === totalPaginas}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-[var(--canchitas-text)] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ListadoCanchas;
