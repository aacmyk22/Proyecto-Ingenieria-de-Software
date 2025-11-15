import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import CardReserva from "../../components/CardReserva";

function UsuarioDetalle() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { token } = useAuth();

  const [reservas, setReservas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 2;

  useEffect(() => {
    fetch(`http://localhost:8080/api/reservas/usuario/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar reservas");
        return res.json();
      })
      .then(data => setReservas(data))
      .catch(err => console.error("Error:", err));
  }, [id, token]);

  const totalPaginas = Math.ceil(reservas.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const reservasPaginadas = reservas.slice(inicio, inicio + porPagina);

  const handleCancelar = (idReserva) => {
    console.log("Cancelar reserva con ID:", idReserva);
  };

  return (
    <div className="m-12">
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-[#213A58]">Usuario</h1>

        <div className="grid grid-cols-2 text-sm mb-4">
          <div>
            <div className="font-semibold text-gray-800">ID</div>
            <div className="text-gray-600">{id}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-800">Reservas</div>
            <div className="text-gray-600">{reservas.length}</div>
          </div>
        </div>

        <ul className="list-disc ml-5 mb-2 text-sm">
          <li className="text-gray-800">Reservaciones realizadas</li>
        </ul>

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
          <div className="flex justify-center items-center space-x-4 pt-4">
            <button
              onClick={() => setPagina(pagina - 1)}
              disabled={pagina === 1}
              className="px-4 py-2 bg-white border border-gray-400 text-gray-900 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-gray-800 font-medium">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="px-4 py-2 bg-white border border-gray-400 text-gray-900 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default UsuarioDetalle;
