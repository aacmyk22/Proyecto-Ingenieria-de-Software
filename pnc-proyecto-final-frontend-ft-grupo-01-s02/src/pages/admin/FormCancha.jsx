import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';


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
    fetch("http://localhost:8080/api/canchas/tipos", {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setTiposCancha(data))
      .catch(err => console.error("Error cargando tipos de cancha:", err));
  }, []);

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [numero, setNumero] = useState("");
  const [dimensiones, setDimensiones] = useState("");
  const [imagen, setImagen] = useState(null);
  const [jornadas, setJornadas] = useState([{ dia: "Lunes", inicio: "", fin: "", precio: "" }]);

  function convertirAHora12(hora24) {
    const [hora, minutos] = hora24.split(":");
    let h = parseInt(hora, 10);
    const sufijo = h >= 12 ? "p. m." : "a. m.";
    h = h % 12 || 12; // convierte 0 a 12
    return `${h.toString().padStart(2, "0")}:${minutos} ${sufijo}`;
  }

  function diaAIdSemana(dia) {
    const mapDias = {
      "Lunes": 1,
      "Martes": 2,
      "Miércoles": 3,
      "Jueves": 4,
      "Viernes": 5,
      "Sábado": 6,
      "Domingo": 7,
    };
    return mapDias[dia] || 1;
  }

  const agregarJornada = () => {
    setJornadas([...jornadas, { dia: "Lunes", inicio: "", fin: "", precio: "" }]);
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
      jornadas: jornadas.map(j => ({
        horaInicio: convertirAHora12(j.inicio),
        horaFin: convertirAHora12(j.fin),
        precioPorHora: parseFloat(j.precio),
        semanaId: diaAIdSemana(j.dia),
        estadoDisponibilidadId: 1
      }))
    };


    try {
      const res = await fetch("http://localhost:8080/api/canchas", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {

        setCreacionExitosa(true);
        setNombre("");
        setTipo("");
        setNumero("");
        setDimensiones("");
        setImagen(null);
        setJornadas([{ dia: "Lunes", inicio: "", fin: "", precio: "" }]);
        inputImagenRef.current.value = "";

        setTimeout(() => {
          navigate(`/lugares/${lugarId}/canchas`);
        }, 1000);
      } else {
        const textoError = await res.text();
        console.error("Error al crear cancha, status:", res.status, "respuesta:", textoError);
      }
    } catch (err) {
      console.error("Fallo de red:", err);
    }

    setTimeout(() => setCreacionExitosa(false), 5000);
  };

  return (
    <div className="m-12">
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-[#213A58]">Crear una cancha</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold mb-1 texto-etiqueta text-black">Nombre de la cancha:</label>
            <input
              className="input input-bordered w-full bg-transparent text-[#213A58] border-black"
              type="text"
              value={nombre}
              maxLength={70}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 texto-etiqueta text-black">Tipo de cancha:</label>
            <select
              className="select select-bordered w-full bg-transparent text-[#213A58] border-black"
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
            <label className="block text-sm font-semibold mb-1 texto-etiqueta text-black">Número de cancha:</label>
            <input
              className="input input-bordered w-full bg-transparent text-[#213A58] border-black"
              type="text"
              value={numero}
              maxLength={40}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 texto-etiqueta text-black">Dimensiones:</label>
            <input
              className="input input-bordered w-full bg-transparent text-[#213A58] border-black"
              type="text"
              placeholder="Ej: 42m x 20m"
              value={dimensiones}
              maxLength={40}
              onChange={(e) => setDimensiones(e.target.value)}
            />
          </div>

          <div className=" text-black">
            <p className="font-semibold texto-etiqueta">¿Cómo funciona la sección de jornadas?</p>
            <p>En esta sección puedes ingresar los horarios disponibles para alquilar tu cancha y el precio por hora en ese rango de tiempo.</p>
            <p>Por ejemplo, si ingresas una jornada de:</p>
            <li>
              Hora de inicio: 08:00 AM
            </li>
            <li>
              Hora de fin: 11:00 AM
            </li>
            <li>
              Precio por hora: $20
            </li>
            <p>El sistema automáticamente dividirá ese rango en bloques de una hora, generando 3 horarios disponibles para reservas:</p>
            <li>
              08:00 AM – 09:00 AM
            </li>
            <li>
              09:00 AM – 10:00 AM
            </li>
            <li>
              10:00 AM – 11:00 AM
            </li>
            <p>
              Cada bloque se mostrará en el sistema con el precio de $20 por hora que hayas definido.
            </p>
            <p className="font-semibold texto-etiqueta">Recuerda</p>
            <p>Puedes ingresar tantas jornadas como necesites para un mismo día. Esto te permite manejar precios diferentes según la hora (por ejemplo, más caro en la noche o los fines de semana).</p>
          </div>

          {jornadas.map((j, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center justify-center mb-4 border-b pb-2">
              <div>
                <label className="block text-xs texto-etiqueta text-black">Día</label>
                <select
                  className="select select-bordered w-full bg-transparent text-[#213A58] border-black"
                  value={j.dia}
                  onChange={(e) => handleJornadaChange(i, "dia", e.target.value)}
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
                <label className="block text-xs texto-etiqueta text-black">Horario de inicio</label>
                <input
                  type="time"
                  className="input input-bordered w-full bg-transparent text-[#213A58] border-black"
                  value={j.inicio}
                  onChange={(e) => handleJornadaChange(i, "inicio", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs texto-etiqueta text-black">Horario de fin</label>
                <input
                  type="time"
                  className="input input-bordered w-full bg-transparent text-[#213A58] border-black"
                  value={j.fin}
                  onChange={(e) => handleJornadaChange(i, "fin", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs texto-etiqueta text-black">Precio por hora</label>
                <div className="flex items-center">
                  <span className="px-2 text-sm text-gray-600">$</span>
                  <input
                    type="number"
                    min="0"
                    className="input input-bordered w-full bg-transparent text-[#213A58] border-black"
                    value={j.precio}
                    onChange={(e) => handleJornadaChange(i, "precio", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex grid-row-2 gap-2 ml-6">
                {jornadas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarJornada(i)}
                    className="btn btn-circle btn-error btn-sm text-lg boton-eliminar"
                    title="Eliminar jornada"
                  >
                    −
                  </button>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={agregarJornada}
                  className="btn btn-circle btn-sm text-lg boton-agregar bg-green-300"
                >
                  +
                </button>
              </div>
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold mt-6 mb-1 texto-etiqueta text-black">Foto de la cancha</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              ref={inputImagenRef}
              className="file-input file-input-bordered w-full bg-transparent text-[#213A58] border-black"
            />

            {imagen && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Previsualización:</p>
                <img
                  src={URL.createObjectURL(imagen)}
                  alt="Previsualización"
                  className="h-40 object-cover rounded border mt-2"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="btn boton-cancelar" onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" className="btn btn-primary boton-crear">Crear</button>
          </div>
        </form>

        {creacionExitosa && (
          <div role="alert" className="alert alert-success mt-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>¡Creada con éxito!.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormCancha; 