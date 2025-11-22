import { Link } from "react-router-dom";
import CardCancha from "../components/CardCancha";

import infochanchitas1 from "/src/assets/Infocanchas1.png";
import infochanchitas2 from "/src/assets/Infocanchas2.png";
import infochanchitas3 from "/src/assets/Infocanchas3.png";

// Demo de canchas (solo visual, sin reservas)
const CANCHAS_DEMO = [
  {
    id: 1,
    nombre: "Cancha El Salvador Arena",
    ubicacion: "San Salvador",
    tipoCancha: "Fútbol 7",
    precioHora: 25,
    imagen: infochanchitas1,
  },
  {
    id: 2,
    nombre: "Complejo La 12",
    ubicacion: "Antiguo Cuscatlán",
    tipoCancha: "Fútbol 5",
    precioHora: 18,
    imagen: infochanchitas2,
  },
  {
    id: 3,
    nombre: "Cancha MetroSport",
    ubicacion: "Soyapango",
    tipoCancha: "Fútbol 7",
    precioHora: 22,
    imagen: infochanchitas3,
  },
];

function InfoCanchitas() {
  return (
    <div className="bg-[#fae8d3] min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Hero / encabezado */}
        <section className="space-y-3">
          <h1 className="text-3xl font-bold text-center text-[#0a0704]">Canchas en nuestra plataforma</h1>
          <p className="text-sm md:text-base text-[#080603] text-center max-w-2xl mx-auto">
            Aquí puedes ver las canchas que forman parte de Canchitas. Esta sección es solo informativa: te ayuda a conocer los espacios disponibles antes de iniciar sesión y hacer tu reserva.
          </p>
        </section>

        {/* Beneficios de nuestras canchas */}
        <section className="space-y-8">
          <div className="canchitas-section space-y-6 bg-[#FFF7ED] p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center gap-6 hover:shadow-2xl transition-shadow">
            <img
              src={infochanchitas1}
              alt="Cancha en buen estado"
              className="w-full md:w-1/3 rounded-xl object-cover shadow-lg"
            />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[#0a0704]">Beneficios de nuestras canchas</h2>
              <p className="text-sm md:text-base text-gray-700">
                Canchas en excelente estado, césped sintético cuidado, iluminación adecuada y espacios seguros para que te concentres solo en jugar. Todos los centros son verificados antes de entrar a la plataforma.
              </p>
            </div>
          </div>

          {/* Cómo funciona la reserva */}
          <div className="canchitas-section space-y-6 bg-[#FFF7ED] p-6 rounded-xl shadow-md flex flex-col md:flex-row-reverse items-center gap-6 hover:shadow-2xl transition-shadow">
            <img
              src={infochanchitas2}
              alt="Reserva en línea"
              className="w-full md:w-1/3 rounded-xl object-cover shadow-lg"
            />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[#0a0704]">¿Cómo funciona la reserva?</h2>
              <p className="text-sm md:text-base text-gray-700">
                Eliges la zona, seleccionas la cancha, revisas horarios disponibles y confirmas tu reserva en segundos. Sin llamadas, sin chats eternos: todo desde un mismo lugar.
              </p>
            </div>
          </div>

          {/* Beneficios de usar Canchitas */}
          <div className="canchitas-section space-y-6 bg-[#FFF7ED] p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center gap-6 hover:shadow-2xl transition-shadow">
            <img
              src={infochanchitas3}
              alt="Beneficios de la plataforma"
              className="w-full md:w-1/3 rounded-xl object-cover shadow-lg"
            />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[#0a0704]">Beneficios de usar SportMatch</h2>
              <p className="text-sm md:text-base text-gray-700">
                Organizas tus partidos con tiempo, evitas choques de horarios y ayudas a que los centros deportivos tengan una mejor gestión de sus canchas. Todos ganan: tú, tu equipo y los administradores.
              </p>
            </div>
          </div>
        </section>

        {/* Catálogo visual de canchas */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="text-2xl font-semibold text-[#0a0704]">Canchas en la plataforma</h2>
          </div>

          {/* Grid de canchas */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {CANCHAS_DEMO.map((cancha) => (
              <div key={cancha.id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
                <img
                  src={cancha.imagen}
                  alt={cancha.nombre}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#FF9900]">{cancha.nombre}</h3>
                  <p className="text-sm text-gray-600">{cancha.ubicacion}</p>
                  <p className="text-lg font-bold text-[#FF9900] mt-2">${cancha.precioHora}/hr</p>

                  {/* Botón de reserva */}
                  <Link to="/reservar" className="mt-4 inline-block px-6 py-2 bg-[#FF9900] text-white rounded-lg text-center hover:bg-[#FFBF00] transition-colors">
                    Reservar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="flex justify-center pt-4">
          <Link to="/reservar" className="w-full sm:w-auto">
            <button className="bg-[#FF9900] text-white rounded-lg py-3 px-6 hover:bg-[#FFBF00] transition-colors">
              Ir a reservar una cancha
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}

export default InfoCanchitas;
