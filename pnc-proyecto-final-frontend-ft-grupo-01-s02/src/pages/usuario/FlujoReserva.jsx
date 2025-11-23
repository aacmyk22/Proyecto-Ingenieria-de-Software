// src/pages/usuario/FlujoReserva.jsx
// Flujo de reserva unificado en pasos: Cancha → Fecha/Hora → Pago

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import CalendarioReservas from "../../components/CalendarioReservas";
import SelectorHoras from "../../components/SelectorHoras";
import Button from "../../components/Button";
import Input from "../../components/Input";
import api from "../../config/api";
import { useAuth } from "../../context/AuthProvider";

import estadioImg from "/src/assets/estadio-de-deportes.jpg";

// Componente de indicador de pasos
function StepIndicator({ pasoActual, pasos }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {pasos.map((paso, index) => {
        const numeroPaso = index + 1;
        const esActivo = numeroPaso === pasoActual;
        const esCompletado = numeroPaso < pasoActual;

        return (
          <div key={paso.id} className="flex items-center">
            {/* Círculo del paso */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  esCompletado
                    ? "bg-emerald-500 text-white"
                    : esActivo
                    ? "bg-[var(--canchitas-accent)] text-white ring-4 ring-[var(--canchitas-accent)]/30"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {esCompletado ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  numeroPaso
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium hidden sm:block ${
                  esActivo ? "text-[var(--canchitas-accent)]" : "text-gray-500"
                }`}
              >
                {paso.titulo}
              </span>
            </div>

            {/* Línea conectora */}
            {index < pasos.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-1 mx-2 rounded transition-all duration-300 ${
                  esCompletado ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FlujoReserva() {
  const navigate = useNavigate();
  const { user: userFromContext } = useAuth();

  // Estado del paso actual (1, 2, 3)
  const [pasoActual, setPasoActual] = useState(1);

  // Estados para opciones de dropdowns
  const [opcionesZonas, setOpcionesZonas] = useState([]);
  const [opcionesLugares, setOpcionesLugares] = useState([]);
  const [opcionesTipoCancha, setOpcionesTipoCancha] = useState([]);
  const [opcionesCanchas, setOpcionesCanchas] = useState([]);
  const [opcionesMetodoPago, setOpcionesMetodoPago] = useState([]);

  // Estados para valores seleccionados - Paso 1
  const [zonaSeleccionada, setZonaSeleccionada] = useState("");
  const [lugarSeleccionado, setLugarSeleccionado] = useState("");
  const [tipoCanchaSeleccionado, setTipoCanchaSeleccionado] = useState("");
  const [canchaSeleccionada, setCanchaSeleccionada] = useState("");

  // Estados del calendario y horarios - Paso 2
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHours, setSelectedHours] = useState([]);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  // Estados del formulario de pago - Paso 3
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");

  // Estados de carga, errores y éxito
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [pagoExitoso, setPagoExitoso] = useState(false);

  // Estados de errores por campo (validaciones visuales)
  const [erroresCampos, setErroresCampos] = useState({
    zona: "",
    lugar: "",
    cancha: "",
    fecha: "",
    horas: "",
    metodoPago: "",
    numeroTarjeta: "",
    vencimiento: "",
    cvv: ""
  });

  // Estado para rastrear si el usuario intentó continuar (touched)
  const [intentoContinuar, setIntentoContinuar] = useState({
    paso1: false,
    paso2: false,
    paso3: false
  });

  // Info de cancha seleccionada
  const [canchaInfo, setCanchaInfo] = useState({
    nombre: "",
    lugar: "",
    zona: "",
    precioPorHora: 10.0,
  });

  // Usuario
  const usuario = userFromContext || (() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })() || { nombre: "Invitado", correo: "-" };

  // Definición de pasos
  const pasos = [
    { id: 1, titulo: "Cancha" },
    { id: 2, titulo: "Fecha y Hora" },
    { id: 3, titulo: "Pago" },
  ];

  // Cargar datos iniciales
  useEffect(() => {
    cargarZonas();
    cargarTiposCanchas();
    cargarMetodosPago();
  }, []);

  // Cargar lugares cuando cambia la zona
  useEffect(() => {
    if (zonaSeleccionada) {
      cargarLugares(zonaSeleccionada);
      setLugarSeleccionado("");
      setCanchaSeleccionada("");
    } else {
      setOpcionesLugares([]);
    }
  }, [zonaSeleccionada]);

  // Cargar canchas cuando cambia el lugar
  useEffect(() => {
    if (lugarSeleccionado) {
      cargarCanchas(lugarSeleccionado);
      setCanchaSeleccionada("");
    } else {
      setOpcionesCanchas([]);
    }
  }, [lugarSeleccionado]);

  // Cargar fechas ocupadas cuando se selecciona cancha
  useEffect(() => {
    if (canchaSeleccionada) {
      cargarFechasOcupadas(canchaSeleccionada);
      // Actualizar info de cancha
      const canchaOption = opcionesCanchas.find(c => c.value == canchaSeleccionada);
      const lugarOption = opcionesLugares.find(l => l.value == lugarSeleccionado);
      const zonaOption = opcionesZonas.find(z => z.value == zonaSeleccionada);
      setCanchaInfo({
        nombre: canchaOption?.label || "Cancha",
        lugar: lugarOption?.label || "Lugar",
        zona: zonaOption?.label || "Zona",
        precioPorHora: 10.0,
      });
    }
  }, [canchaSeleccionada]);

  // Cargar horas ocupadas cuando cambia la fecha
  useEffect(() => {
    if (selectedDate && canchaSeleccionada) {
      const fechaStr = selectedDate.toISOString().split("T")[0];
      cargarHorasOcupadas(canchaSeleccionada, fechaStr);
      setSelectedHours([]);
    }
  }, [selectedDate, canchaSeleccionada]);

  // FUNCIONES API
  const cargarZonas = async () => {
    try {
      setCargando(true);
      const response = await api.get("/api/zonas");
      const zonasFormateadas = response.data.map((zona) => ({
        label: zona.nombre,
        value: zona.id,
      }));
      setOpcionesZonas(zonasFormateadas);
    } catch (err) {
      console.error("Error al cargar zonas:", err);
      setOpcionesZonas([
        { label: "San Salvador", value: "1" },
        { label: "Santa Tecla", value: "2" },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const cargarLugares = async (zonaId) => {
    try {
      setCargando(true);
      const response = await api.get(`/api/zonas/${zonaId}/lugares`);
      const lugaresFormateados = response.data.map((lugar) => ({
        label: lugar.nombre,
        value: lugar.id,
      }));
      setOpcionesLugares(lugaresFormateados);
    } catch (err) {
      console.error("Error lugares:", err);
      setOpcionesLugares([
        { label: "Complejo Deportivo A", value: "1" },
        { label: "Complejo Deportivo B", value: "2" },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const cargarTiposCanchas = async () => {
    try {
      const response = await api.get("/api/canchas/tipos");
      const tiposFormateados = response.data.map((tipo) => ({
        label: tipo.nombre,
        value: tipo.id,
      }));
      setOpcionesTipoCancha(tiposFormateados);
    } catch (err) {
      console.error("Error tipos cancha:", err);
      setOpcionesTipoCancha([
        { label: "Fútbol 5", value: 1 },
        { label: "Fútbol 7", value: 2 },
      ]);
    }
  };

  const cargarCanchas = async (lugarId) => {
    try {
      setCargando(true);
      const response = await api.get(`/api/lugares/${lugarId}/canchas`);
      const canchasFormateadas = response.data.map((cancha) => ({
        label: cancha.nombre,
        value: cancha.id,
      }));
      if (canchasFormateadas.length === 0) {
        setOpcionesCanchas([
          { label: "Cancha 1 - Sintética", value: 1 },
          { label: "Cancha 2 - Césped Natural", value: 2 },
        ]);
      } else {
        setOpcionesCanchas(canchasFormateadas);
      }
    } catch (err) {
      console.error("Error canchas:", err);
      setOpcionesCanchas([
        { label: "Cancha 1 - Sintética", value: 1 },
        { label: "Cancha 2 - Césped Natural", value: 2 },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const cargarFechasOcupadas = async (canchaId) => {
    try {
      const response = await api.get(`/api/reservas/fechas-ocupadas?canchaId=${canchaId}`);
      setFechasOcupadas(response.data);
    } catch (err) {
      console.error("Error fechas ocupadas:", err);
      setFechasOcupadas([]);
    }
  };

  const cargarHorasOcupadas = async (canchaId, fecha) => {
    try {
      const response = await api.get(`/api/reservas/horas-ocupadas?canchaId=${canchaId}&fecha=${fecha}`);
      setHorasOcupadas(response.data);
    } catch (err) {
      console.error("Error horas ocupadas:", err);
      setHorasOcupadas([]);
    }
  };

  const cargarMetodosPago = async () => {
    try {
      const response = await api.get("/api/metodos-pago");
      const metodosFormateados = response.data.map((metodo) => ({
        label: metodo.nombre,
        value: metodo.id,
      }));
      setOpcionesMetodoPago(metodosFormateados);
    } catch (err) {
      console.error("Error métodos de pago:", err);
      setOpcionesMetodoPago([
        { label: "Tarjeta de Crédito", value: "1" },
        { label: "Tarjeta de Débito", value: "2" },
      ]);
    }
  };

  // Funciones auxiliares
  const toggleHora = (hora) => {
    setSelectedHours((prev) =>
      prev.includes(hora) ? prev.filter((h) => h !== hora) : [...prev, hora].sort()
    );
  };

  const calcularTotal = () => selectedHours.length * canchaInfo.precioPorHora;

  const horaInicio = selectedHours[0] || null;
  const horaFin = selectedHours.length > 0
    ? (() => {
        const ultimaHora = selectedHours[selectedHours.length - 1];
        const [hours] = ultimaHora.split(":");
        const nextHour = parseInt(hours) + 1;
        return `${nextHour.toString().padStart(2, "0")}:00`;
      })()
    : null;

  // Validaciones de formato
  const validarNumeroTarjeta = (num) => /^\d{16}$/.test(num);
  const validarVencimiento = (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v);
  const validarCVV = (c) => /^\d{3}$/.test(c);

  // Función para limpiar error de un campo específico
  const limpiarErrorCampo = (campo) => {
    setErroresCampos(prev => ({ ...prev, [campo]: "" }));
  };

  // Validación por paso con mensajes descriptivos
  const validarPaso1 = (mostrarErrores = false) => {
    const errores = {};

    if (!zonaSeleccionada) {
      errores.zona = "Selecciona una zona para continuar";
    }
    if (!lugarSeleccionado) {
      errores.lugar = "Selecciona un lugar deportivo";
    }
    if (!canchaSeleccionada) {
      errores.cancha = "Selecciona una cancha disponible";
    }

    if (mostrarErrores) {
      setErroresCampos(prev => ({ ...prev, ...errores }));
    }

    return Object.keys(errores).length === 0;
  };

  const validarPaso2 = (mostrarErrores = false) => {
    const errores = {};

    if (!selectedDate) {
      errores.fecha = "Selecciona una fecha para tu reserva";
    }
    if (selectedHours.length === 0) {
      errores.horas = "Selecciona al menos una hora";
    }

    if (mostrarErrores) {
      setErroresCampos(prev => ({ ...prev, ...errores }));
    }

    return Object.keys(errores).length === 0;
  };

  const validarPaso3 = (mostrarErrores = false) => {
    const errores = {};

    if (!metodoPagoSeleccionado) {
      errores.metodoPago = "Selecciona un método de pago";
    }
    if (!numeroTarjeta) {
      errores.numeroTarjeta = "Ingresa el número de tarjeta";
    } else if (!validarNumeroTarjeta(numeroTarjeta)) {
      errores.numeroTarjeta = "El número debe tener 16 dígitos";
    }
    if (!vencimiento) {
      errores.vencimiento = "Ingresa la fecha de vencimiento";
    } else if (!validarVencimiento(vencimiento)) {
      errores.vencimiento = "Formato inválido (MM/AA)";
    }
    if (!cvv) {
      errores.cvv = "Ingresa el CVV";
    } else if (!validarCVV(cvv)) {
      errores.cvv = "Debe tener 3 dígitos";
    }

    if (mostrarErrores) {
      setErroresCampos(prev => ({ ...prev, ...errores }));
    }

    return Object.keys(errores).length === 0;
  };

  // Verificar si el paso actual está completo (para habilitar/deshabilitar botón)
  const pasoActualCompleto = () => {
    if (pasoActual === 1) return validarPaso1(false);
    if (pasoActual === 2) return validarPaso2(false);
    if (pasoActual === 3) return validarPaso3(false);
    return false;
  };

  // Navegación entre pasos
  const siguientePaso = () => {
    setError(null);

    if (pasoActual === 1) {
      setIntentoContinuar(prev => ({ ...prev, paso1: true }));
      if (!validarPaso1(true)) {
        setError("Por favor, completa todos los campos requeridos.");
        return;
      }
      // Limpiar errores del paso 1 al avanzar
      setErroresCampos(prev => ({ ...prev, zona: "", lugar: "", cancha: "" }));
    }

    if (pasoActual === 2) {
      setIntentoContinuar(prev => ({ ...prev, paso2: true }));
      if (!validarPaso2(true)) {
        setError("Por favor, selecciona una fecha y al menos una hora.");
        return;
      }
      // Limpiar errores del paso 2 al avanzar
      setErroresCampos(prev => ({ ...prev, fecha: "", horas: "" }));
    }

    if (pasoActual < 3) {
      setPasoActual(pasoActual + 1);
    }
  };

  const pasoAnterior = () => {
    setError(null);
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  // Procesar pago
  const handlePagar = async () => {
    setIntentoContinuar(prev => ({ ...prev, paso3: true }));
    if (!validarPaso3(true)) {
      setError("Por favor, completa todos los datos de pago correctamente.");
      return;
    }

    try {
      setCargando(true);
      setError(null);

      const usuarioId = usuario?.idUsuario || usuario?.id || usuario?.userId;
      if (!usuarioId) {
        setError("No se pudo identificar al usuario. Inicia sesión nuevamente.");
        return;
      }

      const formatearHora = (hora) => {
        const [hours, minutes] = hora.split(":");
        return `${hours.padStart(2, "0")}:${minutes || "00"}`;
      };

      const reservaData = {
        usuarioId,
        lugarId: parseInt(lugarSeleccionado),
        canchaId: parseInt(canchaSeleccionada),
        metodoPagoId: parseInt(metodoPagoSeleccionado),
        fechaReserva: selectedDate.toISOString().split("T")[0],
        horaEntrada: formatearHora(horaInicio),
        horaSalida: formatearHora(horaFin),
      };

      await api.post("/api/reservas", reservaData);
      setPagoExitoso(true);

      // Redireccionar después de 3 segundos
      setTimeout(() => {
        navigate("/mis_reservaciones");
      }, 3000);

    } catch (err) {
      console.error("Error pago:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "No se pudo procesar el pago. Intenta nuevamente.";
      setError(errorMsg);
    } finally {
      setCargando(false);
    }
  };

  // Renderizar contenido según el paso
  const renderPaso1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[var(--canchitas-primary)]">
          Selecciona tu cancha
        </h2>
        <p className="text-sm text-[var(--canchitas-text-muted)] mt-1">
          Elige la zona, lugar y cancha donde deseas jugar
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Dropdown
            id="zona"
            label="Zona"
            options={opcionesZonas}
            value={zonaSeleccionada}
            onChange={(val) => {
              setZonaSeleccionada(val);
              limpiarErrorCampo("zona");
            }}
            disabled={cargando}
            required
            error={intentoContinuar.paso1 ? erroresCampos.zona : ""}
          />
          <Dropdown
            id="lugar"
            label="Lugar"
            options={opcionesLugares}
            value={lugarSeleccionado}
            onChange={(val) => {
              setLugarSeleccionado(val);
              limpiarErrorCampo("lugar");
            }}
            disabled={cargando || !zonaSeleccionada}
            required
            error={intentoContinuar.paso1 ? erroresCampos.lugar : ""}
          />
          <Dropdown
            id="tipoCancha"
            label="Tipo de cancha (opcional)"
            options={opcionesTipoCancha}
            value={tipoCanchaSeleccionado}
            onChange={setTipoCanchaSeleccionado}
            disabled={cargando}
          />
          <Dropdown
            id="cancha"
            label="Cancha"
            options={opcionesCanchas}
            value={canchaSeleccionada}
            onChange={(val) => {
              setCanchaSeleccionada(val);
              limpiarErrorCampo("cancha");
            }}
            disabled={cargando || !lugarSeleccionado}
            required
            error={intentoContinuar.paso1 ? erroresCampos.cancha : ""}
          />
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src={estadioImg}
            alt="Cancha deportiva"
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
      </div>

      {/* Resumen de selección */}
      {canchaSeleccionada && (
        <div className="bg-[var(--canchitas-accent)]/10 rounded-xl p-4 border border-[var(--canchitas-accent)]/30">
          <p className="text-sm font-medium text-[var(--canchitas-primary)]">
            Cancha seleccionada: <span className="font-bold">{canchaInfo.nombre}</span>
          </p>
          <p className="text-xs text-[var(--canchitas-text-muted)]">
            {canchaInfo.lugar} - {canchaInfo.zona}
          </p>
        </div>
      )}
    </div>
  );

  const renderPaso2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[var(--canchitas-primary)]">
          Elige fecha y horario
        </h2>
        <p className="text-sm text-[var(--canchitas-text-muted)] mt-1">
          Selecciona cuándo quieres reservar
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendario */}
        <div>
          <p className="text-sm font-medium text-[var(--canchitas-primary)] mb-3">
            Fecha de reserva <span className="text-[var(--canchitas-danger)]">*</span>
          </p>
          <div className={intentoContinuar.paso2 && erroresCampos.fecha ? "ring-2 ring-[var(--canchitas-danger)] rounded-lg" : ""}>
            <CalendarioReservas
              fechasOcupadas={fechasOcupadas}
              selectedDate={selectedDate}
              onDateChange={(date) => {
                setSelectedDate(date);
                limpiarErrorCampo("fecha");
              }}
            />
          </div>
          {intentoContinuar.paso2 && erroresCampos.fecha && (
            <p className="mt-2 text-sm text-[var(--canchitas-danger)] flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {erroresCampos.fecha}
            </p>
          )}
          {selectedDate && (
            <p className="mt-3 text-sm text-[var(--canchitas-text-muted)]">
              Fecha: <span className="font-semibold text-[var(--canchitas-primary)]">
                {selectedDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          )}
        </div>

        {/* Horarios */}
        <div>
          <p className="text-sm font-medium text-[var(--canchitas-primary)] mb-3">
            Horarios disponibles <span className="text-[var(--canchitas-danger)]">*</span>
          </p>

          {selectedDate ? (
            <>
              <div className={intentoContinuar.paso2 && erroresCampos.horas ? "ring-2 ring-[var(--canchitas-danger)] rounded-lg p-2" : ""}>
                <SelectorHoras
                  horasOcupadas={horasOcupadas}
                  horasSeleccionadas={selectedHours}
                  onHoraClick={(hora) => {
                    toggleHora(hora);
                    limpiarErrorCampo("horas");
                  }}
                />
              </div>
              {intentoContinuar.paso2 && erroresCampos.horas && (
                <p className="mt-2 text-sm text-[var(--canchitas-danger)] flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {erroresCampos.horas}
                </p>
              )}

              {selectedHours.length > 0 && (
                <div className="mt-4 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <p className="text-sm font-medium text-emerald-800 mb-2">
                    Horario seleccionado
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>Entrada: <strong>{horaInicio}</strong></p>
                    <p>Salida: <strong>{horaFin}</strong></p>
                    <p>Horas: <strong>{selectedHours.length}</strong></p>
                    <p>Total: <strong>${calcularTotal().toFixed(2)}</strong></p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={`bg-gray-50 rounded-xl p-8 text-center border ${intentoContinuar.paso2 && erroresCampos.fecha ? "border-[var(--canchitas-danger)]" : "border-gray-200"}`}>
              <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-500">
                Selecciona una fecha para ver los horarios
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resumen de cancha */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-xs text-[var(--canchitas-text-muted)] mb-1">Reservando en:</p>
        <p className="text-sm font-medium text-[var(--canchitas-primary)]">
          {canchaInfo.nombre} - {canchaInfo.lugar}
        </p>
      </div>
    </div>
  );

  const renderPaso3 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[var(--canchitas-primary)]">
          Confirmar y pagar
        </h2>
        <p className="text-sm text-[var(--canchitas-text-muted)] mt-1">
          Revisa los detalles y completa tu reserva
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Resumen de reserva */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="font-semibold text-[var(--canchitas-primary)] mb-4">
            Resumen de reserva
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--canchitas-text-muted)]">Cancha</span>
              <span className="font-medium">{canchaInfo.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--canchitas-text-muted)]">Lugar</span>
              <span className="font-medium">{canchaInfo.lugar}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--canchitas-text-muted)]">Zona</span>
              <span className="font-medium">{canchaInfo.zona}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span className="text-[var(--canchitas-text-muted)]">Fecha</span>
              <span className="font-medium">
                {selectedDate?.toLocaleDateString("es-ES")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--canchitas-text-muted)]">Horario</span>
              <span className="font-medium">{horaInicio} - {horaFin}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--canchitas-text-muted)]">Duración</span>
              <span className="font-medium">{selectedHours.length} hora(s)</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-base">
              <span className="font-semibold">Total a pagar</span>
              <span className="font-bold text-[var(--canchitas-accent)]">
                ${calcularTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Info usuario */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-[var(--canchitas-text-muted)] mb-1">Reserva a nombre de:</p>
            <p className="text-sm font-medium">{usuario?.nombre}</p>
            <p className="text-xs text-[var(--canchitas-text-muted)]">{usuario?.correo}</p>
          </div>
        </div>

        {/* Formulario de pago */}
        <div className="space-y-4">
          <Dropdown
            id="metodoPago"
            label="Método de pago"
            options={opcionesMetodoPago}
            value={metodoPagoSeleccionado}
            onChange={(val) => {
              setMetodoPagoSeleccionado(val);
              limpiarErrorCampo("metodoPago");
            }}
            disabled={cargando}
            required
            error={intentoContinuar.paso3 ? erroresCampos.metodoPago : ""}
          />

          <Input
            id="numeroTarjeta"
            label="Número de tarjeta"
            placeholder="1234 5678 9012 3456"
            value={numeroTarjeta}
            maxLength={16}
            onChange={(e) => {
              setNumeroTarjeta(e.target.value.replace(/\D/g, ""));
              limpiarErrorCampo("numeroTarjeta");
            }}
            required
            error={intentoContinuar.paso3 ? erroresCampos.numeroTarjeta : (numeroTarjeta && !validarNumeroTarjeta(numeroTarjeta) ? "Debe tener 16 dígitos" : "")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="vencimiento"
              label="Vencimiento"
              placeholder="MM/AA"
              value={vencimiento}
              maxLength={5}
              onChange={(e) => {
                let val = e.target.value.replace(/[^\d/]/g, "");
                if (val.length === 2 && !val.includes("/") && vencimiento.length < val.length) {
                  val = val + "/";
                }
                setVencimiento(val);
                limpiarErrorCampo("vencimiento");
              }}
              required
              error={intentoContinuar.paso3 ? erroresCampos.vencimiento : (vencimiento && !validarVencimiento(vencimiento) ? "Formato MM/AA" : "")}
            />
            <Input
              id="cvv"
              label="CVV"
              type="password"
              placeholder="123"
              value={cvv}
              maxLength={3}
              onChange={(e) => {
                setCvv(e.target.value.replace(/\D/g, ""));
                limpiarErrorCampo("cvv");
              }}
              required
              error={intentoContinuar.paso3 ? erroresCampos.cvv : (cvv && !validarCVV(cvv) ? "3 dígitos" : "")}
            />
          </div>

          <p className="text-xs text-[var(--canchitas-text-muted)] flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Tu pago se procesa de forma segura
          </p>
        </div>
      </div>
    </div>
  );

  // Pantalla de éxito
  if (pagoExitoso) {
    return (
      <div className="min-h-screen bg-[var(--canchitas-bg)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--canchitas-primary)] mb-2">
            ¡Reserva confirmada!
          </h2>
          <p className="text-[var(--canchitas-text-muted)] mb-6">
            Tu reserva ha sido procesada exitosamente. Recibirás un correo con los detalles.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-left text-sm mb-6">
            <p><strong>Cancha:</strong> {canchaInfo.nombre}</p>
            <p><strong>Fecha:</strong> {selectedDate?.toLocaleDateString("es-ES")}</p>
            <p><strong>Horario:</strong> {horaInicio} - {horaFin}</p>
            <p><strong>Total pagado:</strong> ${calcularTotal().toFixed(2)}</p>
          </div>
          <p className="text-xs text-[var(--canchitas-text-muted)]">
            Redirigiendo a tus reservaciones...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-8 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--canchitas-primary)]">
            Reservar cancha
          </h1>
          <p className="text-sm text-[var(--canchitas-text-muted)] mt-2">
            Completa los siguientes pasos para realizar tu reserva
          </p>
        </div>

        {/* Indicador de pasos */}
        <StepIndicator pasoActual={pasoActual} pasos={pasos} />

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 rounded-xl px-4 py-3 text-sm text-red-900 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Contenedor principal */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Contenido del paso actual */}
          {pasoActual === 1 && renderPaso1()}
          {pasoActual === 2 && renderPaso2()}
          {pasoActual === 3 && renderPaso3()}

          {/* Botones de navegación */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            {pasoActual > 1 ? (
              <Button variant="ghost" onClick={pasoAnterior} disabled={cargando}>
                ← Anterior
              </Button>
            ) : (
              <div></div>
            )}

            {pasoActual < 3 ? (
              <Button
                variant="primary"
                onClick={siguientePaso}
                disabled={cargando || !pasoActualCompleto()}
                title={!pasoActualCompleto() ? "Completa todos los campos requeridos" : ""}
              >
                Siguiente →
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handlePagar}
                disabled={cargando || !validarPaso3(false)}
                title={!validarPaso3(false) ? "Completa todos los datos de pago" : ""}
              >
                {cargando ? "Procesando..." : `Pagar $${calcularTotal().toFixed(2)}`}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Estilos para animación */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default FlujoReserva;
