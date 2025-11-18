// src/pages/Home.jsx

import { useNavigate } from "react-router-dom";
// Importar imágenes desde assets
import home1 from "/src/assets/Canchitas-home2.png";
import home2 from "/src/assets/Cachitas-home1.png";
import home3 from "/src/assets/Canchitas-home3.png";
import Button from "../components/Button";
import { useAuth } from "../context/AuthProvider";

function Home() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const isLoggedIn = Boolean(token);

  return (
    <main className="bg-[var(--canchitas-bg)] text-[var(--canchitas-text)]">
      {/* HERO PRINCIPAL */}
      <section className="section-banner py-10 md:py-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
          {/* Texto */}
          <div className="w-full md:w-1/2 space-y-4">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.12em] text-[var(--canchitas-accent)]">
              Reserva tu cancha en minutos
            </p>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--canchitas-primary)]">
              Tu partido, a un clic de distancia
            </h1>

            <p className="text-sm md:text-base text-[var(--canchitas-text-muted)]">
              Encuentra canchas cerca de ti, revisa la disponibilidad en tiempo
              real y reserva el horario perfecto para tu equipo.
            </p>

            {/* CTA dinámico según sesión */}
            <div className="flex flex-wrap gap-4 mt-4">
              {!isLoggedIn ? (
                <>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/login")}
                  >
                    Iniciar sesión
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => navigate("/registro")}
                  >
                    Registrarse
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/reservar")}
                  >
                    Crear reservación
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => navigate("/mis_reservaciones")}
                  >
                    Mis reservaciones
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Imagen */}
          <div className="w-full md:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={home2}
                alt="Jugadores en la cancha"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CARD 1: INICIA TU TEMPORADA DE DEPORTE */}
      <section className="py-10 md:py-12">
        <div className="max-w-5xl mx-auto canchitas-section flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--canchitas-primary)]">
              Inicia tu temporada de deporte
            </h2>
            <p className="text-sm md:text-base text-[var(--canchitas-text-muted)]">
              Organiza tus partidos con anticipación, evita choques de horarios
              y mantén a tu equipo siempre listo para el próximo encuentro.
            </p>
          </div>

          <div className="w-full md:w-1/2">
            <img
              src={home1}
              alt="Jugador de fútbol en acción"
              className="w-full h-full rounded-2xl object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* CARD 2: CANCHAS BIEN CUIDADAS */}
      <section className="py-10 md:py-12">
        <div className="max-w-5xl mx-auto canchitas-section flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="w-full md:w-1/2 space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--canchitas-primary)]">
              Canchas bien cuidadas
            </h2>
            <p className="text-sm md:text-base text-[var(--canchitas-text-muted)]">
              Todas las canchas de la plataforma son verificadas: buen estado
              del césped, iluminación adecuada y espacios seguros para que solo
              te preocupes por jugar.
            </p>
          </div>

          <div className="w-full md:w-1/2">
            <img
              src={home3}
              alt="Cancha de fútbol"
              className="w-full h-full rounded-2xl object-cover shadow-lg"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
