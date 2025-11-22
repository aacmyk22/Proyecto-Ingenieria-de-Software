function SelectorHoras({ horasOcupadas, horasSeleccionadas, onHoraClick }) {
  const todasLasHoras = Array.from({ length: 12 }, (_, i) => {
    const hora = 8 + i;
    return `${hora.toString().padStart(2, '0')}:00`;
  });

  const esHoraOcupada = (hora) => horasOcupadas.includes(hora);

  return (
    <div className="grid grid-cols-3 gap-2">
      {todasLasHoras.map((hora) => {
        const seleccionada = horasSeleccionadas.includes(hora);
        return (
          <button
            key={hora}
            className={`btn btn-sm hover:bg-gray-400 border-black text-black ${
              esHoraOcupada(hora)
                ? "btn-disabled"
                : seleccionada
                ? "btn-primary"
                : "btn-outline"
            }`}
            disabled={esHoraOcupada(hora)}
            onClick={() => onHoraClick(hora)}
          >
            {hora}
          </button>
        );
      })}
    </div>
  );
}

export default SelectorHoras;
