// src/pages/InfoCanchitas.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";

import infochanchitas1 from "/src/assets/Infocanchas1.png";
import infochanchitas2 from "/src/assets/Infocanchas2.png";
import infochanchitas3 from "/src/assets/Infocanchas3.png";

function InfoCanchitas() {
  const [lugares, setLugares] = useState([]);
  const [zonaActiva, setZonaActiva] = useState("TODAS");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // paginación
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 5;

  // Cargar lugares desde el backend
  useEffect(() => {
    const fetchLugares = async () => {
      try {
        setCargando(true);
        setError(null);
        const response = await api.get("/api/lugares");
        const data = response.data || [];
        setLugares(data);
      } catch (err) {
        console.error("Error al cargar lugares:", err);
        setError("No se pudieron cargar los lugares.");
      } finally {
        setCargando(false);
      }
    };

    fetchLugares();
  }, []);

  // Zonas únicas para los filtros
  const zonasUnicas = Array.from(
    new Set(lugares.map((lugar) => lugar.zona).filter(Boolean))
  );

  // Reset página cuando cambian filtros
  useEffect(() => {
    setPagina(1);
  }, [zonaActiva, busqueda, lugares.length]);

  // Filtro en frontend
  const lugaresFiltrados = lugares.filter((lugar) => {
    const coincideZona =
      zonaActiva === "TODAS" ||
      lugar.zona?.toLowerCase() === zonaActiva.toLowerCase();

    const termino = busqueda.trim().toLowerCase();
    const coincideBusqueda =
      termino === "" ||
      lugar.nombre?.toLowerCase().includes(termino) ||
      lugar.direccion?.toLowerCase().includes(termino) ||
      lugar.zona?.toLowerCase().includes(termino);

    return coincideZona && coincideBusqueda;
  });

  // Paginación
  const totalPaginas =
    lugaresFiltrados.length > 0
      ? Math.ceil(lugaresFiltrados.length / POR_PAGINA)
      : 1;

  const inicio = (pagina - 1) * POR_PAGINA;
  const lugaresPagina = lugaresFiltrados.slice(inicio, inicio + POR_PAGINA);

  const esZonaActiva = (zona) => zonaActiva === zona;

  const baseFiltroBtn =
    "px-4 py-2 rounded-full text-sm font-medium border transition-colors";
  const activoClasses =
    "bg-[#FF9900] text-white border-[#FF9900] shadow-sm";
  const inactivoClasses =
    "bg-white text-[#0a0704] border-slate-300 hover:bg-[#FFF3E0]";

  return (
    <div className="bg-[#fae8d3] min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Hero / encabezado */}
        <section className="space-y-3">
          <h1 className="text-3xl font-bold text-center text-[#0a0704]">
            Canchas en nuestra plataforma
          </h1>
          <p className="text-sm md:text-base text-[#080603] text-center max-w-2xl mx-auto">
            Aquí puedes ver las canchas que forman parte de Canchitas. Esta
            sección es solo informativa: te ayuda a conocer los espacios
            disponibles antes de iniciar sesión y hacer tu reserva.
          </p>
        </section>

        {/* === BLOQUE ESTILO "USUARIOS" === */}
        <section>
          {/* Contenedor blanco grande */}
          <div className="bg-white rounded-3xl shadow-lg px-6 py-8 space-y-6">
            {/* Título centrado dentro del contenedor */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0a0704]">
                Lugares disponibles
              </h2>
              <p className="text-sm text-[#6b6b6b]">
                Listado de centros deportivos registrados en la plataforma.
              </p>
            </div>

            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Botones zona */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <button
                  type="button"
                  className={`${baseFiltroBtn} ${
                    esZonaActiva("TODAS") ? activoClasses : inactivoClasses
                  }`}
                  onClick={() => setZonaActiva("TODAS")}
                >
                  Todas las zonas
                </button>

                {zonasUnicas.map((zona) => (
                  <button
                    key={zona}
                    type="button"
                    className={`${baseFiltroBtn} ${
                      esZonaActiva(zona) ? activoClasses : inactivoClasses
                    }`}
                    onClick={() => setZonaActiva(zona)}
                  >
                    {zona}
                  </button>
                ))}
              </div>

              {/* Buscador */}
              <div className="w-full md:w-64">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar lugar..."
                  className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFCC80] focus:border-[#FF9900]"
                />
              </div>
            </div>

            {/* Mensajes de estado */}
            {cargando && (
              <p className="text-sm text-center text-[#555]">
                Cargando lugares...
              </p>
            )}
            {error && (
              <p className="text-sm text-center text-red-600">{error}</p>
            )}

            {/* Lista de lugares: cards horizontales estilo Usuarios */}
            <div className="space-y-4">
              {lugaresPagina.length === 0 && !cargando ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-[#FFF7ED] px-4 py-6 text-center">
                  <p className="text-sm text-[#6b6b6b]">
                    No se encontraron lugares con los filtros aplicados.
                  </p>
                </div>
              ) : (
                lugaresPagina.map((lugar, index) => {
                  const numeroLugar = inicio + index + 1;
                  return (
                    <div
                      key={lugar.idLugar}
                      className="border border-[#E5E5E5] rounded-2xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      {/* Columna izquierda: número + datos */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-[#0a0704]">
                          Lugar #{numeroLugar}
                        </p>
                        <div>
                          <p className="text-sm font-semibold text-[#0a0704]">
                            Nombre
                          </p>
                          <p className="text-sm text-[#333]">
                            {lugar.nombre || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0a0704]">
                            Dirección
                          </p>
                          <p className="text-sm text-[#333]">
                            {lugar.direccion || "No especificada"}
                          </p>
                        </div>
                      </div>

                      {/* Columna derecha: zona, código y botón negro */}
                      <div className="flex flex-col items-start md:items-end gap-2 text-sm">
                        <div>
                          <p className="text-sm font-semibold text-[#0a0704]">
                            Zona
                          </p>
                          <p className="text-sm text-[#333]">
                            {lugar.zona || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0a0704]">
                            Código
                          </p>
                          <p className="text-sm text-[#333]">
                            {lugar.codigo ?? "-"}
                          </p>
                        </div>

                        <Link
                          to="/reservar"
                          className="mt-1 inline-flex items-center justify-center rounded-full bg-black px-6 py-2 text-xs font-semibold text-white hover:bg-[#222] transition-colors"
                        >
                          Reservar en este lugar
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={pagina === 1}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="text-sm text-[#666]">
                  Página{" "}
                  <span className="font-semibold text-[#0a0704]">
                    {pagina}
                  </span>{" "}
                  de {totalPaginas}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPagina((p) => Math.min(totalPaginas, p + 1))
                  }
                  disabled={pagina === totalPaginas}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Bloques informativos originales */}
        <section className="space-y-8">
          <div className="canchitas-section space-y-6 bg-[#FFF7ED] p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center gap-6 hover:shadow-2xl transition-shadow">
            <img
              src={infochanchitas1}
              alt="Cancha en buen estado"
              className="w-full md:w-1/3 rounded-xl object-cover shadow-lg"
            />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[#0a0704]">
                Beneficios de nuestras canchas
              </h2>
              <p className="text-sm md:text-base text-gray-700">
                Canchas en excelente estado, césped sintético cuidado,
                iluminación adecuada y espacios seguros para que te concentres
                solo en jugar. Todos los centros son verificados antes de entrar
                a la plataforma.
              </p>
            </div>
          </div>

          <div className="canchitas-section space-y-6 bg-[#FFF7ED] p-6 rounded-xl shadow-md flex flex-col md:flex-row-reverse items-center gap-6 hover:shadow-2xl transition-shadow">
            <img
              src={infochanchitas2}
              alt="Reserva en línea"
              className="w-full md:w-1/3 rounded-xl object-cover shadow-lg"
            />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[#0a0704]">
                ¿Cómo funciona la reserva?
              </h2>
              <p className="text-sm md:text-base text-gray-700">
                Eliges la zona, seleccionas la cancha, revisas horarios
                disponibles y confirmas tu reserva en segundos. Sin llamadas,
                sin chats eternos: todo desde un mismo lugar.
              </p>
            </div>
          </div>

          <div className="canchitas-section space-y-6 bg-[#FFF7ED] p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center gap-6 hover:shadow-2xl transition-shadow">
            <img
              src={infochanchitas3}
              alt="Beneficios de la plataforma"
              className="w-full md:w-1/3 rounded-xl object-cover shadow-lg"
            />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[#0a0704]">
                Beneficios de usar SportMatch
              </h2>
              <p className="text-sm md:text-base text-gray-700">
                Organizas tus partidos con tiempo, evitas choques de horarios y
                ayudas a que los centros deportivos tengan una mejor gestión de
                sus canchas. Todos ganan: tú, tu equipo y los administradores.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default InfoCanchitas;
