// src/pages/reservas/Reservacion.jsx

import { useEffect, useState } from "react";
import Dropdown from "../../components/Dropdown";
import CalendarioReservas from "../../components/CalendarioReservas";
import SelectorHoras from "../../components/SelectorHoras";
import Button from "../../components/Button";
import Input from "../../components/Input";
import api from "../../config/api";
import { useAuth } from "../../context/AuthProvider";

import estadioImg from "/src/assets/estadio-de-deportes.jpg";

function Reservacion() {
  // Estados para opciones de dropdowns
  const [opcionesZonas, setOpcionesZonas] = useState([]);
  const [opcionesLugares, setOpcionesLugares] = useState([]);
  const [opcionesTipoCancha, setOpcionesTipoCancha] = useState([]);
  const [opcionesCanchas, setOpcionesCanchas] = useState([]);
  const [opcionesMetodoPago, setOpcionesMetodoPago] = useState([]);

  // Estados para valores seleccionados
  const [zonaSeleccionada, setZonaSeleccionada] = useState("");
  const [lugarSeleccionado, setLugarSeleccionado] = useState("");
  const [tipoCanchaSeleccionado, setTipoCanchaSeleccionado] = useState("");
  const [canchaSeleccionada, setCanchaSeleccionada] = useState("");
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState("");

  // Estados del calendario y horarios
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHours, setSelectedHours] = useState([]);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  // Estados del formulario de pago
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");
  const [formularioValido, setFormularioValido] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);

  // Estados de carga y errores
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Información de la cancha (temporal - debería venir de la API)
  const [canchaInfo, setCanchaInfo] = useState({
    nombre: "Cancha Fútbol 5",
    lugar: "Complejo Deportivo A",
    zona: "San Salvador",
    precioPorHora: 10.0,
  });

  // ✅ Usuario desde AuthProvider / localStorage (en vez de hardcodeado)
  const { user: userFromContext } = useAuth();

  const usuario =
    userFromContext ||
    (() => {
      try {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    })() ||
    {
      nombre: "Invitado",
      correo: "-",
    };

  // ✅ CARGAR ZONAS al montar el componente
  useEffect(() => {
    console.log("🚀 Componente montado");
    cargarZonas();
    cargarTiposCanchas();
    cargarMetodosPago();
  }, []);

  // ✅ CARGAR CANCHAS cuando cambia el lugar
  useEffect(() => {
    if (lugarSeleccionado) {
      console.log("🏢 Lugar seleccionado:", lugarSeleccionado);
      cargarCanchas(lugarSeleccionado);
    } else {
      setOpcionesCanchas([]);
      setCanchaSeleccionada("");
    }
  }, [lugarSeleccionado]);

  // ✅ CARGAR LUGARES cuando cambia la zona
  useEffect(() => {
    if (zonaSeleccionada) {
      cargarLugares(zonaSeleccionada);
    } else {
      setOpcionesLugares([]);
      setLugarSeleccionado("");
    }
  }, [zonaSeleccionada]);

  // ✅ CARGAR CANCHAS cuando cambia el tipo de cancha
  useEffect(() => {
    if (tipoCanchaSeleccionado) {
      cargarCanchas(lugarSeleccionado);
    } else {
      setOpcionesCanchas([]);
      setCanchaSeleccionada("");
    }
  }, [tipoCanchaSeleccionado]);

  // ✅ CARGAR FECHAS OCUPADAS cuando cambia la cancha
  useEffect(() => {
    if (canchaSeleccionada) {
      cargarFechasOcupadas(canchaSeleccionada);
    }
  }, [canchaSeleccionada]);

  // ✅ CARGAR HORARIOS OCUPADOS cuando cambia la fecha
  useEffect(() => {
    if (selectedDate && canchaSeleccionada) {
      const fechaStr = selectedDate.toISOString().split("T")[0];
      cargarHorasOcupadas(canchaSeleccionada, fechaStr);
      setSelectedHours([]); // reiniciar selección
    }
  }, [selectedDate, canchaSeleccionada]);

  // 🔌 FUNCIONES PARA LLAMAR A LA API

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
      setError("No se pudieron cargar las zonas");
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
      console.log(`📡 GET /api/zonas/${zonaId}/lugares`);
      setCargando(true);
      const response = await api.get(`/api/zonas/${zonaId}/lugares`);
      console.log("✅ Lugares:", response.data);

      const lugaresFormateados = response.data.map((lugar) => ({
        label: lugar.nombre,
        value: lugar.id,
      }));
      setOpcionesLugares(lugaresFormateados);
    } catch (err) {
      console.error("❌ Error lugares:", err);
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
      console.log("📡 GET /api/canchas/tipos");
      const response = await api.get("/api/canchas/tipos");
      console.log("✅ Tipos de cancha:", response.data);

      const tiposFormateados = response.data.map((tipo) => ({
        label: tipo.nombre,
        value: tipo.id,
      }));

      console.log("🔍 Tipos formateados:", tiposFormateados);
      setOpcionesTipoCancha(tiposFormateados);
    } catch (err) {
      console.error("❌ Error tipos cancha:", err);
      setOpcionesTipoCancha([
        { label: "Fútbol 5", value: 1 },
        { label: "Fútbol 7", value: 2 },
      ]);
    }
  };

  const cargarCanchas = async (lugarId) => {
    try {
      console.log(`📡 GET /api/lugares/${lugarId}/canchas`);
      setCargando(true);
      const response = await api.get(`/api/lugares/${lugarId}/canchas`);
      console.log("✅ Canchas:", response.data);

      const canchasFormateadas = response.data.map((cancha) => ({
        label: cancha.nombre,
        value: cancha.id,
      }));

      if (canchasFormateadas.length === 0) {
        console.warn("⚠️ No hay canchas en la BD, usando datos de respaldo");
        setOpcionesCanchas([
          { label: "Cancha 1 - Sintética", value: 1 },
          { label: "Cancha 2 - Césped Natural", value: 2 },
        ]);
      } else {
        setOpcionesCanchas(canchasFormateadas);
      }
    } catch (err) {
      console.error("❌ Error canchas:", err);
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
      const response = await api.get(
        `/api/reservas/fechas-ocupadas?canchaId=${canchaId}`
      );
      setFechasOcupadas(response.data);
    } catch (err) {
      console.error("Error al cargar fechas ocupadas:", err);
      setFechasOcupadas([]);
    }
  };

  const cargarHorasOcupadas = async (canchaId, fecha) => {
    try {
      const response = await api.get(
        `/api/reservas/horas-ocupadas?canchaId=${canchaId}&fecha=${fecha}`
      );
      setHorasOcupadas(response.data);
    } catch (err) {
      console.error("Error al cargar horas ocupadas:", err);
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
      console.error("Error al cargar métodos de pago:", err);
      setOpcionesMetodoPago([
        { label: "Tarjeta de Crédito", value: "1" },
        { label: "Tarjeta de Débito", value: "2" },
      ]);
    }
  };

  // Funciones auxiliares
  const toggleHora = (hora) => {
    setSelectedHours((prev) =>
      prev.includes(hora)
        ? prev.filter((h) => h !== hora)
        : [...prev, hora].sort()
    );
  };

  const calcularTotal = () => selectedHours.length * canchaInfo.precioPorHora;

  const horaInicio = selectedHours[0] || null;
  const horaFin =
    selectedHours.length > 0
      ? (() => {
          const ultimaHora = selectedHours[selectedHours.length - 1];
          const [hours] = ultimaHora.split(":");
          const nextHour = parseInt(hours) + 1;
          return `${nextHour.toString().padStart(2, "0")}:00`;
        })()
      : null;

  // Validaciones de tarjeta
  const validarNumeroTarjeta = (num) => /^\d{16}$/.test(num);
  const validarVencimiento = (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v);
  const validarCVV = (c) => /^\d{3}$/.test(c);

  useEffect(() => {
    const esValido =
      validarNumeroTarjeta(numeroTarjeta) &&
      validarVencimiento(vencimiento) &&
      validarCVV(cvv);

    setFormularioValido(esValido);
  }, [numeroTarjeta, vencimiento, cvv]);

  const handlePagar = async () => {
    if (formularioValido && selectedDate && selectedHours.length > 0) {
      try {
        setCargando(true);
        console.log("💳 Procesando pago...");

        // Obtener ID del usuario logeado
        const usuarioId =
          usuario?.idUsuario || usuario?.id || usuario?.userId;

        if (!usuarioId) {
          console.error("❌ ERROR: No se encontró id del usuario");
          setError(
            "No se pudo identificar al usuario. Inicia sesión nuevamente."
          );
          setCargando(false);
          return;
        }

        console.log("👤 Usuario para la reserva:", usuario);
        console.log("🔑 ID del usuario:", usuarioId);

        console.log("🔍 Estados actuales:");
        console.log("  - lugarSeleccionado:", lugarSeleccionado);
        console.log("  - canchaSeleccionada:", canchaSeleccionada);
        console.log("  - metodoPagoSeleccionado:", metodoPagoSeleccionado);
        console.log("  - zonaSeleccionada:", zonaSeleccionada);

        const formatearHora = (hora) => {
          const [hours, minutes] = hora.split(":");
          return `${hours.padStart(2, "0")}:${minutes || "00"}`;
        };

        const reservaData = {
          usuarioId: usuarioId, // ✅ ahora usa el usuario logeado
          lugarId: parseInt(lugarSeleccionado),
          canchaId: parseInt(canchaSeleccionada),
          metodoPagoId: parseInt(metodoPagoSeleccionado),
          fechaReserva: selectedDate.toISOString().split("T")[0],
          horaEntrada: formatearHora(horaInicio),
          horaSalida: formatearHora(horaFin),
        };

        console.log("📤 Datos a enviar:", reservaData);

        if (!lugarSeleccionado) {
          console.error("❌ ERROR: lugarSeleccionado está vacío");
          setError("Debes seleccionar un lugar");
          setCargando(false);
          return;
        }

        const response = await api.post("/api/reservas", reservaData);

        console.log("✅ Reserva creada:", response.data);
        setPagoExitoso(true);

        // Limpiar campos
        setNumeroTarjeta("");
        setVencimiento("");
        setCvv("");
        setSelectedDate(null);
        setSelectedHours([]);
        setZonaSeleccionada("");
        setLugarSeleccionado("");
        setTipoCanchaSeleccionado("");
        setCanchaSeleccionada("");
        setMetodoPagoSeleccionado("");

        setTimeout(() => setPagoExitoso(false), 5000);
      } catch (err) {
        console.error("❌ Error pago:", err);
        console.error("Detalles:", err.response?.data);

        const errorMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "No se pudo procesar el pago. Intenta nuevamente.";
        setError(errorMsg);

        setTimeout(() => setError(null), 5000);
      } finally {
        setCargando(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--canchitas-bg)] px-4 py-10 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Mensaje de error global */}
        {error && (
          <div className="bg-red-50 border border-red-300 rounded-xl px-4 py-3 text-sm text-red-900">
            {error}
          </div>
        )}

        {/* Intro / pasos */}
        <section className="canchitas-section space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-[var(--canchitas-primary)]">
            Crear reservación
          </h1>
          <p className="text-sm text-[var(--canchitas-text-muted)] text-center">
            Sigue estos pasos para reservar tu cancha de forma rápida y segura.
          </p>

          <ul className="mt-2 space-y-1 text-sm text-[var(--canchitas-text)]">
            <li className="font-semibold">Pasos para reservar tu cancha:</li>
            <li>
              <span className="font-medium">1.</span> Selecciona tu zona o
              ciudad y el lugar donde deseas alquilar una cancha.
            </li>
            <li>
              <span className="font-medium">2.</span> Elige el tipo de cancha y
              la cancha específica que mejor se adapte a tu equipo.
            </li>
            <li>
              <span className="font-medium">3.</span> Selecciona la fecha y el
              horario disponible que prefieras.
            </li>
            <li>
              <span className="font-medium">4.</span> Ingresa tu método de pago
              y confirma la reservación.
            </li>
            <li className="font-semibold">
              ¡Listo! Solo te queda llegar a jugar.
            </li>
          </ul>
        </section>

        {/* Layout principal */}
        <section className="grid lg:grid-cols-[2fr,1.5fr] gap-6 items-start">
          {/* Columna izquierda */}
          <div className="space-y-6">
            {/* Selección de cancha */}
            <div className="canchitas-section space-y-4">
              <h2 className="text-lg font-semibold text-[var(--canchitas-primary)]">
                1. Elige tu cancha
              </h2>

              <div className="grid md:grid-cols-2 gap-4 items-start">
                <div className="space-y-3">
                  <Dropdown
                    label="Selecciona zona"
                    options={opcionesZonas}
                    value={zonaSeleccionada}
                    onChange={setZonaSeleccionada}
                    disabled={cargando}
                  />
                  <Dropdown
                    label="Selecciona el lugar"
                    options={opcionesLugares}
                    value={lugarSeleccionado}
                    onChange={setLugarSeleccionado}
                    disabled={cargando || !zonaSeleccionada}
                  />
                  <Dropdown
                    label="Selecciona el tipo de cancha"
                    options={opcionesTipoCancha}
                    value={tipoCanchaSeleccionado}
                    onChange={setTipoCanchaSeleccionado}
                    disabled={cargando}
                  />
                  <Dropdown
                    label="Selecciona la cancha"
                    options={opcionesCanchas}
                    value={canchaSeleccionada}
                    onChange={setCanchaSeleccionada}
                    disabled={cargando || !lugarSeleccionado}
                  />
                </div>

                <div className="rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={estadioImg}
                    alt="Cancha seleccionada"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Calendario y horarios */}
            <div className="canchitas-section space-y-4">
              <h2 className="text-lg font-semibold text-[var(--canchitas-primary)]">
                2. Elige fecha y horario
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Calendario */}
                <div>
                  <p className="text-sm font-medium text-[var(--canchitas-primary)] mb-2">
                    Calendario de reservas
                  </p>
                  <CalendarioReservas
                    fechasOcupadas={fechasOcupadas}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                  />
                  {selectedDate && (
                    <p className="mt-2 text-xs text-[var(--canchitas-text-muted)]">
                      Fecha seleccionada:{" "}
                      <span className="font-semibold">
                        {selectedDate.toLocaleDateString()}
                      </span>
                    </p>
                  )}
                </div>

                {/* Horarios */}
                <div>
                  <p className="text-sm font-medium text-[var(--canchitas-primary)] mb-2">
                    Horarios disponibles
                  </p>

                  {selectedDate ? (
                    <>
                      <SelectorHoras
                        horasOcupadas={horasOcupadas}
                        horasSeleccionadas={selectedHours}
                        onHoraClick={toggleHora}
                      />

                      {selectedHours.length > 0 && (
                        <div className="mt-4 space-y-1 text-sm text-[var(--canchitas-text)]">
                          <p>
                            Hora de inicio:{" "}
                            <strong>{horaInicio}</strong>
                          </p>
                          <p>
                            Hora de fin: <strong>{horaFin}</strong>
                          </p>
                          <p>
                            Total a pagar:{" "}
                            <strong>
                              ${calcularTotal().toFixed(2)}
                            </strong>
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-[var(--canchitas-text-muted)]">
                      Selecciona una fecha para ver los horarios disponibles.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {/* Datos personales */}
            <div className="canchitas-section space-y-3">
              <h2 className="text-lg font-semibold text-[var(--canchitas-primary)]">
                3. Datos personales
              </h2>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-[var(--canchitas-text)]">
                <div>
                  <p className="font-medium">Usuario</p>
                  <p>{usuario?.nombre || "Invitado"}</p>
                </div>
                <div>
                  <p className="font-medium">Correo</p>
                  <p>{usuario?.correo || "-"}</p>
                </div>
              </div>
            </div>

            {/* Detalles de compra */}
            <div className="canchitas-section space-y-3">
              <h2 className="text-lg font-semibold text-[var(--canchitas-primary)]">
                4. Detalles de la reserva
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-[var(--canchitas-text)]">
                <div>
                  <p>
                    <strong>Lugar:</strong> {canchaInfo.lugar}
                  </p>
                  <p>
                    <strong>Zona:</strong> {canchaInfo.zona}
                  </p>
                  <p>
                    <strong>Cancha:</strong> {canchaInfo.nombre}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {selectedDate
                      ? selectedDate.toLocaleDateString()
                      : "-"}
                  </p>
                  <p>
                    <strong>Entrada:</strong>{" "}
                    {selectedHours.length > 0 ? horaInicio : "-"}
                  </p>
                  <p>
                    <strong>Salida:</strong>{" "}
                    {selectedHours.length > 0 ? horaFin : "-"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p>
                    <strong>Precio total:</strong>{" "}
                    {selectedHours.length > 0
                      ? `$${calcularTotal().toFixed(2)}`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Forma de pago */}
            <div className="canchitas-section space-y-4">
              <h2 className="text-lg font-semibold text-[var(--canchitas-primary)]">
                5. Forma de pago
              </h2>

              <Dropdown
                label="Método de pago"
                options={opcionesMetodoPago}
                value={metodoPagoSeleccionado}
                onChange={setMetodoPagoSeleccionado}
                disabled={cargando}
              />

              <div className="grid sm:grid-cols-3 gap-3">
                <Input
                  id="numeroTarjeta"
                  label="Número de tarjeta"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={numeroTarjeta}
                  maxLength={16}
                  onChange={(e) =>
                    setNumeroTarjeta(e.target.value.replace(/\D/g, ""))
                  }
                />
                <Input
                  id="vencimiento"
                  label="Vencimiento"
                  placeholder="MM/AA"
                  value={vencimiento}
                  maxLength={5}
                  onChange={(e) => setVencimiento(e.target.value)}
                />
                <Input
                  id="cvv"
                  label="CVV"
                  type="password"
                  value={cvv}
                  maxLength={3}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  disabled={
                    cargando ||
                    !formularioValido ||
                    !selectedDate ||
                    selectedHours.length === 0
                  }
                  onClick={handlePagar}
                >
                  {cargando
                    ? "Procesando..."
                    : `Confirmar y pagar ${
                        selectedHours.length > 0
                          ? `- $${calcularTotal().toFixed(2)}`
                          : ""
                      }`}
                </Button>

                <p className="text-xs text-center text-[var(--canchitas-text-muted)]">
                  Tu pago se procesa de forma segura. No almacenamos los datos
                  de tu tarjeta.
                </p>

                {pagoExitoso && (
                  <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-300 px-4 py-3 text-sm text-emerald-900 flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      ¡Pago realizado con éxito! Tu reservación ha sido
                      confirmada.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reservacion;
