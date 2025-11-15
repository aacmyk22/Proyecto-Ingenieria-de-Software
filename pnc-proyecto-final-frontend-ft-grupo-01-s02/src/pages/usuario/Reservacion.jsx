import { useEffect, useState } from "react";
import Dropdown from "../../components/Dropdown";
import CalendarioReservas from "../../components/CalendarioReservas";
import SelectorHoras from "../../components/SelectorHoras";


function Reservacion() {
    const [opciones, setOpciones] = useState([]);
    const [seleccionado, setSeleccionado] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHours, setSelectedHours] = useState([]);
    const [fechasOcupadas, setFechasOcupadas] = useState([]);
    const [horasOcupadas, setHorasOcupadas] = useState([]);
    const [numeroTarjeta, setNumeroTarjeta] = useState("");
    const [vencimiento, setVencimiento] = useState("");
    const [cvv, setCvv] = useState("");
    const [formularioValido, setFormularioValido] = useState(false);
    const [pagoExitoso, setPagoExitoso] = useState(false);

    // Simulamos llamada a API
    useEffect(() => {
        const datosSimulados = [
            { label: "El Salvador, uyyy", value: "SV" },
            { label: "Guatemala", value: "GT" },
            { label: "Honduras", value: "HN" },
        ];
        setOpciones(datosSimulados);
    }, []);

    // Fechas ocupadas (desde API)
    useEffect(() => {
        const fechas = ["2025-06-15", "2025-06-17", "2025-06-20"];
        setFechasOcupadas(fechas);
    }, []);

    const canchaSeleccionada = {
        nombre: "Cancha Futbol 5",
        lugar: "Complejo Deportivo A",
        zona: "San Salvador",
        precioPorHora: 10.0,
    };

    const usuario = {
        nombre: "Jennifer López",
        correo: "jenn@example.com",
    };

    useEffect(() => {
        const fechas = ["2025-06-15", "2025-06-17", "2025-06-20"];
        setFechasOcupadas(fechas);
    }, []);

    useEffect(() => {
        if (!selectedDate) return;
        const fechaStr = selectedDate.toISOString().split("T")[0];

        const reservasPorFecha = {
            "2025-06-16": ["10:00", "13:00"],
            "2025-06-18": ["08:00", "12:00", "15:00"],
        };

        setHorasOcupadas(reservasPorFecha[fechaStr] || []);
        setSelectedHours([]); // reiniciar selección
    }, [selectedDate]);

    const toggleHora = (hora) => {
        setSelectedHours((prev) =>
            prev.includes(hora) ? prev.filter((h) => h !== hora) : [...prev, hora].sort()
        );
    };

    const calcularTotal = () => selectedHours.length * canchaSeleccionada.precioPorHora;

    const horaInicio = selectedHours[0];
    const horaFin = selectedHours.length > 0
        ? `${parseInt(selectedHours[selectedHours.length - 1]) + 1}:00`
        : null;

    // Validaciones 
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

    const handlePagar = () => {
    if (formularioValido && selectedDate && selectedHours.length > 0) {
        setPagoExitoso(true);

        // Limpiar campos
        setNumeroTarjeta("");
        setVencimiento("");
        setCvv("");
        setSelectedDate(null);
        setSelectedHours([]);
        setSeleccionado("");

        setTimeout(() => {
            setPagoExitoso(false);
        }, 5000);
    }
};

    return (
        <div>
            <div className="m-12">
                <div className="w-full bg-white rounded-xl p-6 space-y-6">
                    <h2 className="text-[#213A58] text-2xl flex justify-center font-bold">Crear reservación</h2>

                    <ul>
                        <li className="text-pretty text-black font-semibold">Pasos para reservar tu cancha</li>
                        <li className="text-pretty text-black ">Selecciona tu zona o ciudad:
                            Elige la ubicación donde deseas alquilar una cancha.</li>
                        <li className="text-pretty text-black ">Escoge el lugar disponible:
                            Verás una lista de complejos o centros deportivos registrados en esa zona.</li>
                        <li className="text-pretty text-black ">Filtra por tipo de cancha:
                            Puedes elegir entre canchas de futboll rapido o canchas de grama articifial.</li>
                        <li className="text-pretty text-black "> Elige la cancha específica:
                            Selecciona la cancha que mejor se adapte a lo que estás buscando</li>
                        <li className="text-pretty text-black ">Selecciona la fecha y el horario:
                            Revisa la disponibilidad y escoge el día y hora que prefieras. Solo se mostrarán los horarios habilitados. </li>
                        <li className="text-pretty text-black "> Ingresa tu método de pago:
                            Completa el pago con tu tarjeta de crédito o débito de forma segura desde la plataforma.</li>
                        <li className="text-black font-medium">¡Listo! Solo te queda llegar a jugar.</li>
                    </ul>

                </div>
            </div>
            <div className="m-12">
                <div className="w-full bg-[#213A58] border-2 rounded-xl p-6 space-y-6">
                    <h2 className="text-2xl text-white flex justify-center font-bold">Canchas</h2>
                    {/*Bloque 1 */}
                    <div className="grid grid-cols-2">
                        {/*Dropdowns de las selcciones */}
                        <div className=" grid grid-rows-4 m-6">

                            <Dropdown
                                label="Selecciona zona"
                                options={opciones}
                                value={seleccionado}
                                onChange={setSeleccionado}
                            />
                            <Dropdown
                                label="Selecciona el lugar"
                                options={opciones}
                                value={seleccionado}
                                onChange={setSeleccionado}
                            />
                            <Dropdown
                                label="Selecciona el tipo de cancha"
                                options={opciones}
                                value={seleccionado}
                                onChange={setSeleccionado}
                            />
                            <Dropdown
                                label="Selecciona la cancha"
                                options={opciones}
                                value={seleccionado}
                                onChange={setSeleccionado}
                            />
                        </div>
                        {/*Para traer la imagen subida de la cancha */}
                        <div className="m-6">
                            <img src=".\src\assets\estadio-de-deportes.jpg" alt="" />
                        </div>
                    </div>
                    {/*Bloque 2 */}
                    {/*Calendario y horarios*/}
                    <div className="">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5">
                                <label className="label">
                                    <span className="label text-white mb-2">Calendario de Reservas</span>
                                </label>
                                <CalendarioReservas
                                    fechasOcupadas={fechasOcupadas}
                                    selectedDate={selectedDate}
                                    onDateChange={setSelectedDate}
                                />
                                {selectedDate && (
                                    <p className="text-white">
                                        Fecha seleccionada:{" "}
                                        <span className="text-blue-300">{selectedDate.toLocaleDateString()}</span>
                                    </p>
                                )}
                            </div>

                            <div className="p-5">
                                {selectedDate ? (
                                    <>
                                        <label className="label">
                                            <span className="label text-white mb-2">Horarios Disponibles</span>
                                        </label>
                                        <SelectorHoras
                                            horasOcupadas={horasOcupadas}
                                            horasSeleccionadas={selectedHours}
                                            onHoraClick={toggleHora}
                                        
                                        />
                                        {selectedHours.length > 0 && (
                                            <div className="mt-6 text-white">
                                                <p>Hora de inicio: <strong>{horaInicio}</strong></p>
                                                <p>Hora de fin: <strong>{horaFin}</strong></p>
                                                <p>Total a pagar: <strong>${calcularTotal().toFixed(2)}</strong></p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-white">Selecciona una fecha para ver horarios disponibles.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/*Bloque 3 */}
                    <div className="p-5">
                        <label className="label">
                            <span className="label font-bold text-white mb-2">Datos personales</span>
                        </label>
                        <div className="grid grid-cols-2 text-white">
                            <p>
                                <strong>Usuario:</strong>
                                <p>{usuario.nombre}</p>
                            </p>
                            <p>
                                <strong>Correo:</strong>
                                <p>{usuario.correo}</p>
                            </p>
                        </div>
                    </div>
                    {/*Bloque 4 */}
                    <div className=" border-emerald-400 border p-4 rounded-lg shadow text-white">
                        <h2 className="font-bold mb-4">Detalles de compra</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><strong>Lugar:</strong> {canchaSeleccionada.lugar}</p>
                                <p><strong>Zona:</strong> {canchaSeleccionada.zona}</p>
                                <p><strong>Cancha:</strong> {canchaSeleccionada.nombre}</p>
                            </div>
                            <div>
                                <p><strong>Fecha:</strong> {selectedDate ? selectedDate.toLocaleDateString() : ""}</p>
                                <p><strong>Entrada:</strong> {selectedHours.length > 0 ? selectedHours[0] : ""}</p>
                                <p><strong>Salida:</strong> {
                                    selectedHours.length > 0
                                        ? `${parseInt(selectedHours[selectedHours.length - 1]) + 1}:00`
                                        : ""
                                }</p>
                            </div>
                            <div>
                                <p><strong>Precio Total:</strong> {
                                    selectedHours.length > 0
                                        ? `$${(selectedHours.length * canchaSeleccionada.precioPorHora).toFixed(2)}`
                                        : ""
                                }</p>
                            </div>
                        </div>
                    </div>
                    {/*Bloque 5 */}
                    <div className="mt-8 p-4 rounded-lg  text-white">
                        <h2 className="font-bold mb-4">Forma de Pago</h2>
                        <Dropdown
                            label=""
                            options={opciones}
                            value={seleccionado}
                            onChange={setSeleccionado}
                        />
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text text-white">Número de tarjeta</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered bg-transparent border-white w-full"
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    maxLength={16}
                                    value={numeroTarjeta}
                                    onChange={(e) => setNumeroTarjeta(e.target.value.replace(/\D/g, ""))}
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text text-white">Vencimiento</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered bg-transparent border-white w-full"
                                    placeholder="MM/AA"
                                    maxLength={5}
                                    value={vencimiento}
                                    onChange={(e) => setVencimiento(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text text-white">CVV</span>
                                </label>
                                <input
                                    type="password"
                                    className="input input-bordered bg-transparent border-white w-full"
                                    maxLength={3}
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                                />
                            </div>
                        </div>
                    </div>
                    {/*Bloque 6 */}
                    <div className="mt-6">
                        <button
                            className="btn btn-success mt-4 w-full"
                            disabled={!formularioValido || !(selectedDate && selectedHours.length > 0)}
                            onClick={handlePagar}
                        >
                            Confirmar y pagar
                            <span className="ml-2">
                                {selectedHours.length > 0
                                    ? `$${(selectedHours.length * canchaSeleccionada.precioPorHora).toFixed(2)}`
                                    : ""}
                            </span>
                        </button>

                        {pagoExitoso && (
                            <div role="alert" className="alert alert-success mt-4 shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>¡Pago realizado con éxito! Tu reservación ha sido confirmada.</span>
                            </div>

                        )}
                    </div>


                </div>
            </div>

        </div>
    );
}

export default Reservacion;