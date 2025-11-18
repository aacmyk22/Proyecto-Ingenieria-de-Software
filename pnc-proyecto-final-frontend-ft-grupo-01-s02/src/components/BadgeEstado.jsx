// src/components/BadgeEstado.jsx
// Badge para mostrar el estado de una cancha o reserva.

const normalizar = (texto = "") =>
  texto
    .toString()
    .trim()
    .toLowerCase();

function BadgeEstado({ estado }) {
  const estadoNormalizado = normalizar(estado);

  let extraClass = "badge-estado--disponible";
  let label = estado;

  if (estadoNormalizado.includes("pend")) {
    extraClass = "badge-estado--pendiente";
    label = "Pendiente";
  } else if (estadoNormalizado.includes("reserv")) {
    extraClass = "badge-estado--reservada";
    label = "Reservada";
  } else if (
    estadoNormalizado.includes("cancel") ||
    estadoNormalizado.includes("inact")
  ) {
    extraClass = "badge-estado--cancelada";
    label = "Cancelada";
  } else if (estadoNormalizado.includes("disp")) {
    extraClass = "badge-estado--disponible";
    label = "Disponible";
  }

  return (
    <span className={["badge-estado", extraClass].join(" ")}>
      {label}
    </span>
  );
}

export default BadgeEstado;
