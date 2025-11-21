// src/pages/usuario/MisReservaciones.jsx
import { useState, useEffect } from 'react';
import api from '../../config/api';
import { Link } from "react-router-dom";

function MisReservaciones() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // OPCIÓN 1: Si tienes el usuario en localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.log('⚠️ No hay usuario en localStorage');
        setError('Debes iniciar sesión para ver tus reservas');
        setCargando(false);
        return;
      }

      const user = JSON.parse(userStr);
      const usuarioId = user.id || user.idUsuario || user.userId;

      console.log('👤 Usuario obtenido:', user);
      console.log('🔑 ID del usuario:', usuarioId);

      if (!usuarioId) {
        console.log('❌ No se encontró ID del usuario');
        setError('Error: No se pudo identificar al usuario');
        setCargando(false);
        return;
      }

      // Llamar al endpoint
      console.log(`📡 GET /api/reservas/usuario/${usuarioId}`);
      const response = await api.get(`/api/reservas/usuario/${usuarioId}`);
      
      console.log('✅ Reservas recibidas:', response.data);
      console.log('📊 Total de reservas:', response.data.length);

      setReservas(response.data);
    } catch (err) {
      console.error('❌ Error al cargar reservas:', err);
      console.error('Detalles:', err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Sesión expirada. Por favor inicia sesión nuevamente.');
      } else if (err.response?.status === 403) {
        setError('No tienes permisos para ver estas reservas.');
      } else {
        setError('Error al cargar las reservas. Intenta nuevamente.');
      }
    } finally {
      setCargando(false);
    }
  };

  const eliminarReserva = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    try {
      console.log(`🗑️ DELETE /api/reservas/${id}`);
      await api.delete(`/api/reservas/${id}`);
      
      console.log('✅ Reserva eliminada');
      
      // Actualizar lista
      setReservas(reservas.filter(r => r.idReserva !== id));
      
      // Mostrar mensaje
      alert('Reserva cancelada exitosamente');
    } catch (err) {
      console.error('❌ Error al eliminar reserva:', err);
      alert('Error al cancelar la reserva. Intenta nuevamente.');
    }
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    return fecha.toLocaleDateString('es-SV', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getColorEstado = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'CONFIRMADA':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="canchitas-section">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--canchitas-primary)] mx-auto mb-4"></div>
                <p className="text-[var(--canchitas-text-muted)]">Cargando reservas...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-300 rounded-xl px-6 py-4 text-red-900">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-10 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="canchitas-section">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--canchitas-primary)]">
            Mis reservaciones
          </h1>
          <p className="text-sm text-[var(--canchitas-text-muted)] mt-2">
            Aquí podrás ver el historial de canchas que has reservado en Canchitas.
          </p>
        </div>

        {/* Lista de reservas */}
        {reservas.length === 0 ? (
          <div className="canchitas-section text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-[var(--canchitas-text-muted)] mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg text-[var(--canchitas-text)] mb-4">
              Aún no tienes reservaciones registradas.
            </p>
            <Link
  to="/reservar"  
  className="inline-block px-6 py-3 bg-[var(--canchitas-accent)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
>
  Crear mi primera reserva
</Link>

          </div>
        ) : (
          <div className="space-y-4">
            {reservas.map((reserva) => (
              <div key={reserva.idReserva} className="canchitas-section hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Info principal */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--canchitas-primary)]">
                          {reserva.nombreCancha}
                        </h3>
                        <p className="text-sm text-[var(--canchitas-text-muted)]">
                          {reserva.nombreLugar}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getColorEstado(
                          reserva.estadoReserva
                        )}`}
                      >
                        {reserva.estadoReserva}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-[var(--canchitas-text-muted)]">Fecha</p>
                        <p className="font-medium text-[var(--canchitas-text)]">
                          {formatearFecha(reserva.fechaReserva)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--canchitas-text-muted)]">Horario</p>
                        <p className="font-medium text-[var(--canchitas-text)]">
                          {reserva.horaEntrada} - {reserva.horaSalida}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--canchitas-text-muted)]">Método de pago</p>
                        <p className="font-medium text-[var(--canchitas-text)]">
                          {reserva.metodoPago}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--canchitas-text-muted)]">Total</p>
                        <p className="font-bold text-[var(--canchitas-primary)] text-lg">
                          ${reserva.precioTotal?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  {reserva.estadoReserva === 'PENDIENTE' && (
                    <button
                      onClick={() => eliminarReserva(reserva.idReserva)}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      Cancelar reserva
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MisReservaciones;