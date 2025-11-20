// src/pages/admin/UsuarioDetalle.jsx (ajusta la ruta si la tienes en otra carpeta)

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import CardReserva from "../../components/CardReserva";
import api from "../../config/api";

function UsuarioDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  const [reservas, setReservas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 2;

  useEffect(() => {
    if (!id || !token) return;

    const fetchReservas = async () => {
      try {
        const res = await api.get(`/api/reservas/usuario/${id}`);
        setReservas(res.data);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchReservas();
  }, [id, token]);

  const totalPaginas = Math.ceil(reservas.length / porPagina) || 1;
  const inicio = (pagina - 1) * porPagina;
  const reservasPaginadas = reservas.slice(inicio, inicio + porPagina);

  const handleCancelar = (idReserva) => {
    console.log("Cancelar reserva con ID:", idReserva);
    // Aquí luego puedes integrar lógica real de cancelación.
  };

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-10 md:px-8">
      <div className="max-w-4xl mx-auto canchitas-section">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--canchitas-primary)]">
              Detalle de usuario
            </h1>
            <p className="text-sm text-[var(--canchitas-text-muted)] mt-1">
              Consulta el historial de reservaciones asociadas a este usuario.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--canchitas-primary)] hover:bg-black/5"
          >
            Volver
          </button>
        </header>

        {/* Resumen del usuario */}
        <section className="mb-4 rounded-2xl bg-[var(--canchitas-bg)] px-4 py-3 border border-black/10">
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div>
              <p className="font-semibold text-[var(--canchitas-primary)]">
                ID de usuario
              </p>
              <p className="text-[var(--canchitas-text-muted)]">{id}</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--canchitas-primary)]">
                Total de reservas
              </p>
              <p className="text-[var(--canchitas-text-muted)]">
                {reservas.length}
              </p>
            </div>
          </div>
        </section>

        {/* Título de sección de reservas */}
        <div className="mb-3">
          <h2 className="text-base font-semibold text-[var(--canchitas-primary)]">
            Reservaciones realizadas
          </h2>
          <p className="text-xs text-[var(--canchitas-text-muted)]">
            Aquí se listan todas las reservas que el usuario ha realizado en la
            plataforma.
          </p>
        </div>

        {/* Listado de reservas */}
        {reservas.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-black/20 bg-white/60 px-4 py-6 text-center text-sm text-[var(--canchitas-text-muted)]">
            Este usuario todavía no tiene reservaciones registradas.
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {reservasPaginadas.map((reserva) => (
                <CardReserva
                  key={reserva.idReserva}
                  reserva={reserva}
                  handleCancelar={handleCancelar}
                />
              ))}
            </div>

            {totalPaginas > 1 && (
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
                  className="inline-flex items-center justify-center rounded-full border border-black/20 bg-white px-4 py-2 text-sm font-semibold text-[var(--canchitas-primary)] hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
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

export default UsuarioDetalle;
