import { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

// Mock de datos para pruebas
const mockReservas = [
  { idReserva: 1,  fechaReserva: '2025-06-09', fechaCreacion: '2025-06-05', horaEntrada: '17:00', horaSalida: '18:00', precioTotal: 35.0, estadoReserva: 'PENDIENTE',   usuario: 'Carlos Dominguez',  lugar: 'Cancha #6' },
  { idReserva: 2,  fechaReserva: '2025-06-25', fechaCreacion: '2025-06-09', horaEntrada: '17:00', horaSalida: '18:00', precioTotal: 40.0, estadoReserva: 'FINALIZADA', usuario: 'María López',       lugar: 'Cancha #3' },
  { idReserva: 3,  fechaReserva: '2025-07-01', fechaCreacion: '2025-06-20', horaEntrada: '10:00', horaSalida: '11:30', precioTotal: 50.0, estadoReserva: 'PENDIENTE',   usuario: 'Juan Pérez',        lugar: 'Cancha #1' },
  { idReserva: 4,  fechaReserva: '2025-07-05', fechaCreacion: '2025-06-22', horaEntrada: '14:00', horaSalida: '15:00', precioTotal: 45.0, estadoReserva: 'FINALIZADA', usuario: 'Ana García',        lugar: 'Cancha #2' },
  { idReserva: 5,  fechaReserva: '2025-07-10', fechaCreacion: '2025-06-25', horaEntrada: '12:00', horaSalida: '13:00', precioTotal: 55.0, estadoReserva: 'PENDIENTE',   usuario: 'Luis Martínez',     lugar: 'Cancha #4' },
  { idReserva: 6,  fechaReserva: '2025-07-12', fechaCreacion: '2025-06-30', horaEntrada: '09:00', horaSalida: '10:00', precioTotal: 30.0, estadoReserva: 'FINALIZADA', usuario: 'Patricia Torres',   lugar: 'Cancha #5' },
  { idReserva: 7,  fechaReserva: '2025-07-15', fechaCreacion: '2025-07-01', horaEntrada: '16:00', horaSalida: '17:00', precioTotal: 38.0, estadoReserva: 'PENDIENTE',   usuario: 'Ricardo Ruiz',      lugar: 'Cancha #6' },
  { idReserva: 8,  fechaReserva: '2025-07-20', fechaCreacion: '2025-07-03', horaEntrada: '18:00', horaSalida: '19:30', precioTotal: 60.0, estadoReserva: 'FINALIZADA', usuario: 'Mónica Díaz',       lugar: 'Cancha #3' },
  { idReserva: 9,  fechaReserva: '2025-07-22', fechaCreacion: '2025-07-05', horaEntrada: '11:00', horaSalida: '12:00', precioTotal: 42.0, estadoReserva: 'PENDIENTE',   usuario: 'Diego Fernández',   lugar: 'Cancha #1' },
  { idReserva: 10, fechaReserva: '2025-07-25', fechaCreacion: '2025-07-10', horaEntrada: '13:00', horaSalida: '14:00', precioTotal: 48.0, estadoReserva: 'FINALIZADA', usuario: 'Laura Sánchez',     lugar: 'Cancha #2' },
  { idReserva: 11, fechaReserva: '2025-07-28', fechaCreacion: '2025-07-12', horaEntrada: '15:00', horaSalida: '16:00', precioTotal: 52.0, estadoReserva: 'PENDIENTE',   usuario: 'Fernando Gómez',    lugar: 'Cancha #4' },
  { idReserva: 12, fechaReserva: '2025-07-30', fechaCreacion: '2025-07-15', horaEntrada: '17:30', horaSalida: '18:30', precioTotal: 58.0, estadoReserva: 'FINALIZADA', usuario: 'Sofía Castillo',    lugar: 'Cancha #5' },
];

export default function AllReservaciones() {
  const [reservas, setReservas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;
  const dateInputRef = useRef(null);

  useEffect(() => {
    setReservas(mockReservas);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pagina]);

  // Filtrar por fecha
  const reservasFiltradas = filtroFecha
    ? reservas.filter(r => r.fechaReserva === filtroFecha)
    : reservas;

  // Paginación
  const totalPaginas = Math.ceil(reservasFiltradas.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const actuales = reservasFiltradas.slice(inicio, inicio + porPagina);

  return (
    <div className="m-12">
      {/* Contenedor principal con borde oscuro y esquinas redondeadas */}
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        {/* Título */}
        <h1 className="text-2xl font-semibold text-[#213A58]">
          Reservaciones actuales
        </h1>

        {/* Filtro por fecha con icono clickeable */}
        <div className="flex items-center space-x-4">
          <label className="text-gray-800 font-medium">Filtrar por fecha:</label>
          <div className="relative">
            <input
              ref={dateInputRef}
              type="date"
              value={filtroFecha}
              onChange={e => { setFiltroFecha(e.target.value); setPagina(1); }}
              className="
                w-48 bg-white border border-gray-400 text-gray-900
                rounded pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400
              "
            />
            <FaCalendarAlt
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => {
                if (dateInputRef.current?.showPicker) {
                  dateInputRef.current.showPicker();
                } else {
                  dateInputRef.current.focus();
                }
              }}
            />
          </div>
          <button
            onClick={() => setFiltroFecha('')}
            className="
              px-3 py-1 bg-white border border-gray-400 text-gray-900
              rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400
            "
          >
            Limpiar
          </button>
        </div>

        {/* Lista de tarjetas */}
        <div className="space-y-6">
          {actuales.map(reserva => (
            <div key={reserva.idReserva} className="w-full bg-white  border border-black rounded-xl p-6 space-y-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800">
                  Reserva #{reserva.idReserva}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    reserva.estadoReserva === 'PENDIENTE' ? 'text-yellow-600' : 'text-green-600'
                  }`}
                >
                  {reserva.estadoReserva === 'PENDIENTE' ? 'Pendiente' : 'Realizada'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="uppercase font-semibold text-gray-800">Fecha de reserva</div>
                  <div className="text-gray-700">{reserva.fechaReserva}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">Número de cancha</div>
                  <div className="text-gray-700">{reserva.lugar}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">Fecha de compra</div>
                  <div className="text-gray-700">{reserva.fechaCreacion}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">Hora de entrada</div>
                  <div className="text-gray-700">{reserva.horaEntrada}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">Monto</div>
                  <div className="text-gray-700">${reserva.precioTotal}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">Hora de salida</div>
                  <div className="text-gray-700">{reserva.horaSalida}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">Usuario</div>
                  <div className="text-gray-700">{reserva.usuario}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setPagina(pagina - 1)}
              disabled={pagina === 1}
              className="
                px-4 py-2 bg-white border border-gray-400 text-gray-900
                rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Anterior
            </button>
            <span className="text-gray-800 font-medium">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="
                px-4 py-2 bg-white border border-gray-400 text-gray-900
                rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
