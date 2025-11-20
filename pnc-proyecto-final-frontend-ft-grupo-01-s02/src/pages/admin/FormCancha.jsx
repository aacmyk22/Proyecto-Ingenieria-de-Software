// src/pages/admin/FormCancha.jsx (ruta de ejemplo)

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import api from "../../config/api";

function FormCancha() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const lugarId = queryParams.get("lugarId");

  const [creacionExitosa, setCreacionExitosa] = useState(false);
  const inputImagenRef = useRef(null);

  const [tiposCancha, setTiposCancha] = useState([]);

  useEffect(() => {
    api.get("/api/canchas/tipos")
      .then((res) => setTiposCancha(res.data))
      .catch((err) =>
        console.error("Error cargando tipos de cancha:", err)
      );
  }, [token]);

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [numero, setNumero] = useState("");
  const [dimensiones, setDimensiones] = useState("");
  const [imagen, setImagen] = useState(null);
  const [jornadas, setJornadas] = useState([
    { dia: "Lunes", inicio: "", fin: "", precio: "" },
  ]);

  function convertirAHora12(hora24) {
    const [hora, minutos] = hora24.split(":");
    let h = parseInt(hora, 10);
    const sufijo = h >= 12 ? "p. m." : "a. m.";
    h = h % 12 || 12;
    return `${h.toString().padStart(2, "0")}:${minutos} ${sufijo}`;
  }

  function diaAIdSemana(dia) {
    const mapDias = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Domingo: 7,
    };
    return mapDias[dia] || 1;
  }

  const agregarJornada = () => {
    setJornadas((prev) => [
      ...prev,
      { dia: "Lunes", inicio: "", fin: "", precio: "" },
    ]);
  };

  const eliminarJornada = (index) => {
    if (jornadas.length === 1) return;
    const nuevas = [...jornadas];
    nuevas.splice(index, 1);
    setJornadas(nuevas);
  };

  const handleJornadaChange = (index, campo, valor) => {
    const nuevas = [...jornadas];
    nuevas[index][campo] = valor;
    setJornadas(nuevas);
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lugarId) {
      alert("No se pudo identificar el lugar para esta cancha.");
      return;
    }

    const body = {
      nombre,
      imagenes: [imagen?.name || ""],
      numeroCancha: parseInt(numero),
      tipoCanchaId: parseInt(tipo),
      lugarId: parseInt(lugarId),
      jornadas: jornadas.map((j) => ({
        horaInicio: convertirAHora12(j.inicio),
        horaFin: convertirAHora12(j.fin),
        precioPorHora: parseFloat(j.precio),
        semanaId: diaAIdSemana(j.dia),
        estadoDisponibilidadId: 1,
      })),
      // dimensiones podría agregarse aquí cuando el backend lo soporte
    };

    try {
      const res = await api.post("/api/canchas", body);

      if (res.status === 200 || res.status === 201) {
        setCreacionExitosa(true);
        setNombre("");
        setTipo("");
        setNumero("");
        setDimensiones("");
        setImagen(null);
        setJornadas([{ dia: "Lunes", inicio: "", fin: "", precio: "" }]);
        if (inputImagenRef.current) inputImagenRef.current.value = "";

        setTimeout(() => {
          navigate(`/lugares/${lugarId}/canchas`);
        }, 1000);
      }
    } catch (err) {
      console.error("Error al crear cancha:", err);
      const mensaje = err.response?.data?.mensaje || "Error al crear la cancha";
      alert(mensaje);
    }

    setTimeout(() => setCreacionExitosa(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-10 md:px-8">
      <div className="max-w-4xl mx-auto canchitas-section">
        {/* Encabezado */}
        <header className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--canchitas-primary)]">
            Crear una cancha
          </h2>
          <p className="mt-1 text-sm text-[var(--canchitas-text-muted)]">
            Completa la información básica de la cancha y define las jornadas
            disponibles con su precio por hora.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Datos básicos */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--canchitas-text-muted)]">
              Datos de la cancha
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold mb-1 texto-etiqueta text-[var(--canchitas-text-muted)] uppercase tracking-wide">
                  Nombre de la cancha
                </label>
                <input
                  className="w-full rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm text-[var(--canchitas-primary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--canchitas-accent-soft)]"
                  type="text"
                  value={nombre}
                  maxLength={70}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 texto-etiqueta text-[var(--canchitas-text-muted)] uppercase tracking-wide">
                  Tipo de cancha
                </label>
                <select
                  className="w-full rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm text-[var(--canchitas-primary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--canchitas-accent-soft)]"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                >
                  <option value="">Seleccione un tipo</option>
                  {tiposCancha.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre.replace("_", " ").toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 texto-etiqueta text-[var(--canchitas-text-muted)] uppercase tracking-wide">
                  Número de cancha
                </label>
                <input
                  className="w-full rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm text-[var(--canchitas-primary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--canchitas-accent-soft)]"
                  type="text"
                  value={numero}
                  maxLength={40}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 texto-etiqueta text-[var(--canchitas-text-muted)] uppercase tracking-wide">
                  Dimensiones
                </label>
                <input
                  className="w-full rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm text-[var(--canchitas-primary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--canchitas-accent-soft)]"
                  type="text"
                  placeholder="Ej: 42m x 20m"
                  value={dimensiones}
                  maxLength={40}
                  onChange={(e) => setDimensiones(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Explicación jornadas */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--canchitas-text-muted)]">
              Jornadas y precios
            </h3>

            <div className="rounded-2xl border border-slate-200 bg-[var(--canchitas-bg)] px-4 py-3 text-sm text-[var(--canchitas-text-muted)] space-y-1">
              <p className="font-semibold texto-etiqueta text-[var(--canchitas-primary)]">
                ¿Cómo funciona la sección de jornadas?
              </p>
              <p>
                En cada jornada defines un{" "}
                <strong>día, rango horario y precio por hora</strong>.
                El sistema divide automáticamente ese rango en bloques de una
                hora.
              </p>
              <p className="text-xs mt-1">
                Ejemplo: si indicas inicio 08:00 y fin 11:00 con precio
                <strong> $20</strong>, se generan estos horarios:
              </p>
              <ul className="list-disc list-inside text-xs">
                <li>08:00 – 09:00</li>
                <li>09:00 – 10:00</li>
                <li>10:00 – 11:00</li>
              </ul>
              <p className="text-xs mt-1">
                Puedes crear varias jornadas para el mismo día, por ejemplo
                precios distintos en la noche o fines de semana.
              </p>
            </div>
          </section>

          {/* Jornadas */}
          <section className="space-y-4">
            {jornadas.map((j, i) => (
              <article
                key={i}
                className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--canchitas-primary)]">
                    Jornada {i + 1}
                  </p>
                  {jornadas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarJornada(i)}
                      className="text-xs rounded-full border border-rose-200 bg-rose-50 px-3 py-1 font-medium text-rose-700 hover:bg-rose-100"
                      title="Eliminar jornada"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <div>
                    <label className="block text-xs texto-etiqueta text-[var(--canchitas-text-muted)] uppercase tracking-wide mb-1">
                      Día
                    </label>
                    <select
                      className="w-full rounded-full border border-slate-300 bg-white/80 px-3 py-2 text-sm text-[var(--canchitas-primary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--canchitas-accent-soft)]"
                      value={j.dia}
                      onChange={(e) =>
                        handleJornadaChange(i, "dia", e.target.value)
                      }
                    >
                      <option>Lunes</option>
                      <option>Martes</option>
                      <option>Miércoles</option>
                      <option>Jueves</option>
                      <option>Viernes</option>
                      <option>Sábado</option>
                      <option>Domingo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs texto-etiqueta text-[var(--canchitas-text-muted)] uppercase tracking-wide mb-1">
                      Hora inicio
                    </label>
                    <input
                      type="time"
                      className="w-full rounded-full border border-slate-300 bg-white/80 px-3 py-2 text-sm text-[var(--canchitas-primary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--canchitas-accent-soft)]"
                      value={j.inicio}
                      onChange={(e) =>
                        handleJornadaChange(i, "inicio", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs texto-etiqueta text-[var(--canchitas-text-muted)] uppercase tracking-wide mb-1">
                      Hora fin
                    </label>
                    <input
                      type="time"
                      className="w-full rounded-full border border-slate-300 bg-white/80 px-3 py-2 text-sm text-[var(--canchitas-primary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--canchitas-accent-soft)]"
                      value={j.fin}
                      onChange={(e) =>
                        handleJornadaChange(i, "fin", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs texto-etiqueta text-[var(--canchitas-text-muted)] uppercase tracking-wide mb-1">
                      Precio por hora
                    </label>
                    <div className="flex items-center rounded-full border border-slate-300 bg-white/80 px-3 py-2 text-sm shadow-sm focus-within:ring-2 focus-within:ring-[var(--canchitas-accent-soft)]">
                      <span className="mr-2 text-[var(--canchitas-text-muted)]">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        className="w-full bg-transparent text-[var(--canchitas-primary)] outline-none"
                        value={j.precio}
                        onChange={(e) =>
                          handleJornadaChange(i, "precio", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={agregarJornada}
                className="rounded-full bg-[var(--canchitas-accent-soft)] px-4 py-2 text-sm font-medium text-[var(--canchitas-accent)] hover:bg-[var(--canchitas-accent)] hover:text-white transition-colors"
              >
                + Añadir jornada
              </button>
            </div>
          </section>

          {/* Imagen */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--canchitas-text-muted)]">
              Foto de la cancha
            </h3>
            <label className="block text-xs font-semibold mb-1 texto-etiqueta text-[var(--canchitas-text-muted)] uppercase tracking-wide">
              Imagen principal
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              ref={inputImagenRef}
              className="w-full rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-sm text-[var(--canchitas-primary)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--canchitas-primary-soft)] file:px-4 file:py-1 file:text-xs file:font-semibold file:text-[var(--canchitas-primary)] hover:file:bg-[var(--canchitas-primary)] hover:file:text-white"
            />

            {imagen && (
              <div className="mt-3">
                <p className="text-xs text-[var(--canchitas-text-muted)]">
                  Previsualización:
                </p>
                <img
                  src={URL.createObjectURL(imagen)}
                  alt="Previsualización"
                  className="mt-2 h-40 w-full max-w-sm rounded-2xl border border-slate-200 object-cover"
                />
              </div>
            )}
          </section>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-[var(--canchitas-text)] hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-full bg-[var(--canchitas-accent)] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--canchitas-accent-strong)]"
            >
              Crear cancha
            </button>
          </div>
        </form>

        {/* Mensaje de éxito */}
        {creacionExitosa && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>¡Cancha creada con éxito!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormCancha;
