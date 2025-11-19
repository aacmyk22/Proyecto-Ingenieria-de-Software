// src/pages/admin/ViewLugar.jsx  

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export default function ViewLugares() {
  const { token } = useAuth();
  const [lugares, setLugares] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [alertaEliminado, setAlertaEliminado] = useState(false);
  const [alertaError, setAlertaError] = useState(false);
  const porPagina = 3;
  const navigate = useNavigate();

  // Obtener lugares del backend
  const fetchLugares = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/lugares", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar los lugares");
      }

      const data = await response.json();
      setLugares(data);
    } catch (error) {
      console.error("Error al cargar los lugares:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLugares();
    }
  }, [token]);

  // Eliminar lugar por ID
  const handleEliminarLugar = async (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar este lugar?"
    );
    if (!confirmacion) return;

    try {
      const response = await fetch(`http://localhost:8080/api/lugares/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setLugares((prev) => prev.filter((l) => l.idLugar !== id));
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

  const totalPaginas = Math.ceil(lugares.length / porPagina) || 1;
  const inicio = (pagina - 1) * porPagina;
  const lugaresPaginados = lugares.slice(inicio, inicio + porPagina);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pagina]);

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-10 md:px-8">
      <div className="max-w-5xl mx-auto canchitas-section">
        {/* Encabezado */}
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--canchitas-primary)]">
              Lugares
            </h1>
            <p className="text-sm text-[var(--canchitas-text-muted)] mt-1">
              Administra los establecimientos donde se ofrecen canchas.
            </p>
          </div>

          <Link
            to="/nuevo_lugar"
            className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Agregar nuevo lugar
          </Link>
        </header>

        {/* Alertas */}
        <section className="space-y-2">
          {alertaEliminado && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                ✓
              </span>
              <span>Lugar eliminado correctamente.</span>
            </div>
          )}

          {alertaError && (
            <div className="flex items-center gap-2 rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                !
              </span>
              <span>No se pudo eliminar el lugar.</span>
            </div>
          )}
        </section>

        {/* Listado de lugares */}
        <section className="mt-4 space-y-4">
          {lugaresPaginados.map((lugar, index) => (
            <article
              key={lugar.idLugar}
              className="rounded-2xl border border-black/15 bg-white/80 px-5 py-5 shadow-sm"
            >
              {/* Etiqueta superior */}
              <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--canchitas-text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--canchitas-primary)]" />
                Lugar #{inicio + index + 1}
              </div>

              {/* Datos principales */}
              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <p className="text-[0.75rem] font-semibold uppercase text-[var(--canchitas-text-muted)]">
                    Nombre del lugar
                  </p>
                  <p className="text-[var(--canchitas-primary)] font-medium mt-0.5">
                    {lugar.nombre}
                  </p>
                </div>

                <div>
                  <p className="text-[0.75rem] font-semibold uppercase text-[var(--canchitas-text-muted)]">
                    Dirección
                  </p>
                  <p className="mt-0.5 text-[var(--canchitas-text-main)]">
                    {lugar.direccion}
                  </p>
                </div>

                <div>
                  <p className="text-[0.75rem] font-semibold uppercase text-[var(--canchitas-text-muted)]">
                    Código
                  </p>
                  <p className="mt-0.5 text-[var(--canchitas-text-main)]">
                    {lugar.codigo}
                  </p>
                </div>

                <div>
                  <p className="text-[0.75rem] font-semibold uppercase text-[var(--canchitas-text-muted)]">
                    Zona
                  </p>
                  <p className="mt-0.5 text-[var(--canchitas-text-main)]">
                    {lugar.zona}
                  </p>
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-5 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleEliminarLugar(lugar.idLugar)}
                  className="inline-flex items-center justify-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-red-500 ring-1 ring-red-200 hover:bg-red-50"
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/lugares/${lugar.idLugar}/canchas`)}
                  className="inline-flex items-center justify-center rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                >
                  Ver canchas
                </button>
              </div>
            </article>
          ))}

          {lugares.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-black/20 bg-white/60 px-4 py-6 text-center text-sm text-[var(--canchitas-text-muted)]">
              Todavía no hay lugares registrados en la plataforma.
            </div>
          )}
        </section>

        {/* Paginación */}
        {lugares.length > 0 && totalPaginas > 1 && (
          <div className="mt-6 flex justify-center items-center gap-4">
            <button
              onClick={() => setPagina((prev) => prev - 1)}
              disabled={pagina === 1}
              className="inline-flex items-center justify-center rounded-full border border-black/20 bg-white px-4 py-2 text-sm font-semibold text-[var(--canchitas-primary)] hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm font-medium text-[var(--canchitas-primary)]">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina((prev) => prev + 1)}
              disabled={pagina === totalPaginas}
              className="inline-flex items-center justify-center rounded-full border border-black/20 bg-white px-4 py-2 text-sm font-semibold text-[var(--canchitas-primary)] hover:bg:black/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
