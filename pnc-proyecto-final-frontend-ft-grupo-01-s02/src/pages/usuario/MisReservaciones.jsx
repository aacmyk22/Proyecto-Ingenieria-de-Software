import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";

function MisReservaciones() {
  const { token, usuario } = useAuth(); // 👈 asegurarse de que `usuario.idUsuario` está disponible
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuario?.idUsuario) return;

    fetch(`http://localhost:8080/api/reservas/${usuario.idUsuario}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar reservas");
        return res.json();
      })
      .then((data) => {
        setReservas(data);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar las reservas");
      });
  }, [usuario?.idUsuario]);

  return (
    <div className="m-12">
      <div className="w-full bg-white rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-[#213A58]">Reservas</h2>

        {error && <p className="text-red-600">Error: {error}</p>}

        {reservas.length === 0 && !error ? (
          <p className="text-gray-600">No tienes reservas registradas.</p>
        ) : (
          reservas.map((r) => (
            <div key={r.idReserva} className="p-4 border rounded-xl space-y-1 mt-2">
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
  );
}

export default MisReservaciones;
