// src/pages/Home.jsx

import { useNavigate } from "react-router-dom";

import home1 from "../assets/Canchitas-home2.png";
import home2 from "../assets/Cachitas-home1.png";
import home3 from "../assets/Canchitas-home3.png";
import home4 from "../assets/home4.png";

import Button from "../components/Button";
import { useAuth } from "../context/AuthProvider";

function Home() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const isLoggedIn = Boolean(token);

  return (
    <main className="w-full">

      {/* ========================================================= */}
      {/* HERO PRINCIPAL                                            */}
      {/* ========================================================= */}
      <section className="relative h-[550px] w-full">

        <img
          src={home4}
          alt="Fondo SportMatch"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Tu partido, a un clic de distancia
          </h1>

          <div className="flex gap-4 flex-wrap justify-center">
            {!isLoggedIn ? (
              <>
                <Button
                  variant="primary"
                  className="bg-[#FF9900] hover:bg-[#FFBF00] text-white px-6 py-3 rounded-lg font-semibold"
                  onClick={() => navigate("/login")}
                >
                  Iniciar sesión
                </Button>

                <Button
                  variant="secondary"
                  className="bg-white text-[#FF9900] border border-[#FF9900] hover:bg-[#FFF0E0] px-6 py-3 rounded-lg font-semibold"
                  onClick={() => navigate("/registro")}
                >
                  Registrarse
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  className="bg-[#FF9900] hover:bg-[#FFBF00] text-white px-6 py-3 rounded-lg font-semibold"
                  onClick={() => navigate("/reservar")}
                >
                  Crear reserva
                </Button>

                <Button
                  variant="secondary"
                  className="bg-white text-[#FF9900] border border-[#FF9900] hover:bg-[#FFF0E0] px-6 py-3 rounded-lg font-semibold"
                  onClick={() => navigate("/mis_reservaciones")}
                >
                  Mis reservaciones
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION — CARDS PRINCIPALES                              */}
      {/* ========================================================= */}
      <section className="py-16 px-6 md:px-20 grid md:grid-cols-2 gap-10 bg-[#fff]">
        
        {/* Card 1 */}
        <div className="bg-[#FFF0E0] shadow-lg rounded-xl overflow-hidden">
          <img
            src={home1}
            className="w-full h-[230px] md:h-[260px] object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold text-black mb-2">
              Inicia tu temporada de deporte
            </h2>
            <p className="text-gray-700">
              Organiza tus partidos, evita choques de horarios y mantén a tu equipo
              siempre listo para el próximo encuentro.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#FFF0E0] shadow-lg rounded-xl overflow-hidden">
          <img
            src={home3}
            className="w-full h-[230px] md:h-[260px] object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold text-black mb-2">
              Canchas bien cuidadas
            </h2>
            <p className="text-gray-700">
              Todas nuestras canchas son verificadas para garantizar la mejor
              experiencia de juego.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* NUESTRAS CANCHAS                                          */}
      {/* ========================================================= */}
      <section className="bg-[#FFF0E0] py-16 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-black">
          Nuestras Canchas
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          <img
            src={home1}
            className="w-full md:w-[330px] h-[200px] object-cover rounded-xl shadow-lg"
          />
          <img
            src={home2}
            className="w-full md:w-[330px] h-[200px] object-cover rounded-xl shadow-lg"
          />
          <img
            src={home3}
            className="w-full md:w-[330px] h-[200px] object-cover rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* TESTIMONIOS                                              */}
      {/* ========================================================= */}
      <section className="py-16 px-6 text-center bg-[#FFFF]">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-black">
          Lo que dicen nuestros jugadores
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-gray-700 italic">
              “Me encanta poder reservar canchas con facilidad. Todo es súper rápido y sin complicaciones.”
            </p>
            <span className="block mt-4 font-semibold text-[#FF9900]">
              - Juan Pérez
            </span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-gray-700 italic">
              “SportMatch hace que organizar los partidos sea mucho más simple.”
            </p>
            <span className="block mt-4 font-semibold text-[#FF9900]">
              - Henry López
            </span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-gray-700 italic">
              “La calidad de las canchas es excelente y el servicio siempre ha sido rápido.”
            </p>
            <span className="block mt-4 font-semibold text-[#FF9900]">
              - Camila García
            </span>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Home;
