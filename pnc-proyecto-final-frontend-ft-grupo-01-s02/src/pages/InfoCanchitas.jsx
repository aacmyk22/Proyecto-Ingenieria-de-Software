// src/pages/InfoCanchitas.jsx

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
    <div className="bg-[var(--canchitas-bg)] min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Hero / encabezado */}
        <section className="canchitas-section space-y-3">
          <h1 className="canchitas-title-xl">Canchas en nuestra plataforma</h1>
          <p className="text-sm md:text-base text-[var(--canchitas-text-muted)] text-center max-w-2xl mx-auto">
            Aquí puedes ver las canchas que forman parte de Canchitas. Esta
            sección es solo informativa: te ayuda a conocer los espacios
            disponibles antes de iniciar sesión y hacer tu reserva.
          </p>
        </section>

        {/* Bloques informativos */}
        <section className="space-y-6">
          {/* Beneficios de nuestras canchas */}
          <div className="canchitas-section section-dark flex flex-col md:flex-row items-center gap-6">
            <img
              src={infochanchitas1}
              alt="Cancha en buen estado"
              className="w-full md:w-1/3 rounded-xl object-cover"
            />
            <div className="space-y-2">
              <h2 className="canchitas-title-md text-white">
                Beneficios de nuestras canchas
              </h2>
              <p className="text-sm md:text-base text-slate-100">
                Canchas en excelente estado, césped sintético cuidado,
                iluminación adecuada y espacios seguros para que te concentres
                solo en jugar. Todos los centros son verificados antes de
                entrar a la plataforma.
              </p>
            </div>
          </div>

          {/* Cómo funciona */}
          <div className="canchitas-section section-banner flex flex-col md:flex-row-reverse items-center gap-6">
            <img
              src={infochanchitas2}
              alt="Reserva en línea"
              className="w-full md:w-1/3 rounded-xl object-cover"
            />
            <div className="space-y-2">
              <h2 className="canchitas-title-md">
                ¿Cómo funciona la reserva?
              </h2>
              <p className="text-sm md:text-base">
                Eliges la zona, seleccionas la cancha, revisas horarios
                disponibles y confirmas tu reserva en segundos. Sin llamadas,
                sin chats eternos: todo desde un mismo lugar.
              </p>
            </div>
          </div>

          {/* Beneficios de la página */}
          <div className="canchitas-section flex flex-col md:flex-row items-center gap-6">
            <img
              src={infochanchitas3}
              alt="Beneficios de la plataforma"
              className="w-full md:w-1/3 rounded-xl object-cover"
            />
            <div className="space-y-2">
              <h2 className="canchitas-title-md">
                Beneficios de usar Canchitas
              </h2>
              <p className="text-sm md:text-base text-[var(--canchitas-text-muted)]">
                Organizas tus partidos con tiempo, evitas choques de horarios y
                ayudas a que los centros deportivos tengan una mejor gestión de
                sus canchas. Todos ganan: tú, tu equipo y los administradores.
              </p>
            </div>
          </div>
        </section>

        {/* Catálogo visual de canchas */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="canchitas-title-md">Canchas en la plataforma</h2>
            <span className="text-xs md:text-sm text-[var(--canchitas-text-muted)]">
              Vista solo informativa: no muestra disponibilidad ni permite
              reservar desde aquí.
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {CANCHAS_DEMO.map((cancha) => (
              <CardCancha
                key={cancha.id}
                {...cancha}
                mostrarBoton={false}      // 👈 sin botón
                mostrarEstado={false}     // 👈 sin badge de estado
              />
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="flex justify-center pt-4">
          <Link to="/reservar" className="w-full sm:w-auto">
            <button className="btn-primary btn-lg btn-full sm:w-auto">
              Ir a reservar una cancha
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}

export default InfoCanchitas;
