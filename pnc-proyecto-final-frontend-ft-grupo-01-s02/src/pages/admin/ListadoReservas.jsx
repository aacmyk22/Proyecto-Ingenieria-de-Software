import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider"; // ← CORREGIDO

function ListadoReservas() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [reservasPendientes, setReservasPendientes] = useState([]);
  const [reservasRealizadas, setReservasRealizadas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/reservas", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log("Datos recibidos desde el backend:", data);

        setReservasPendientes(
          data.filter(r => r.estadoReserva?.toUpperCase() === "PENDIENTE")
        );

        setReservasRealizadas(
          data.filter(r => {
            const estado = r.estadoReserva?.toUpperCase();
            return estado === "REALIZADA" || estado === "FINALIZADA";
          })
        );
      })
      .catch(err => console.error("Error cargando reservas:", err));
  }, [token]);

  return (
    <div className="m-12">
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#213A58]">
            Reservas de la cancha
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#213A58] text-white px-4 py-1 rounded-full text-sm hover:bg-[#1a2f47]"
          >
            Volver
          </button>
        </div>

        {/* Pendientes */}
        <div>
          <h3 className="text-lg font-semibold text-[#213A58]">Pendientes</h3>
          {reservasPendientes.length === 0 ? (
            <p className="text-sm text-gray-500">No hay reservas pendientes.</p>
          ) : (
            reservasPendientes.map(r => (
              <div key={r.idReserva} className="p-4 border border-yellow-400 rounded-xl space-y-2 mt-2">
                <p><strong>Usuario:</strong> {r.nombreUsuario}</p>
                <p><strong>Fecha de reserva:</strong> {r.fechaReserva}</p>
                <p><strong>Horario:</strong> {r.horaEntrada} - {r.horaSalida}</p>
                <p><strong>Estado:</strong> {r.estadoReserva}</p>
                <p><strong>Total $:</strong> {r.precioTotal}</p>
              </div>
            ))
          )}
        </div>

        {/* Realizadas */}
        <div>
          <h3 className="text-lg font-semibold text-[#213A58] mt-6">Realizadas</h3>
          {reservasRealizadas.length === 0 ? (
            <p className="text-sm text-gray-500">No hay reservas realizadas.</p>
          ) : (
            reservasRealizadas.map(r => (
              <div key={r.idReserva} className="p-4 border border-green-500 rounded-xl space-y-2 mt-2">
                <p><strong>Usuario:</strong> {r.nombreUsuario}</p>
                <p><strong>Fecha de reserva:</strong> {r.fechaReserva}</p>
                <p><strong>Horario:</strong> {r.horaEntrada} - {r.horaSalida}</p>
                <p><strong>Estado:</strong> {r.estadoReserva}</p>
                <p><strong>Total $:</strong> {r.precioTotal}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ListadoReservas;
