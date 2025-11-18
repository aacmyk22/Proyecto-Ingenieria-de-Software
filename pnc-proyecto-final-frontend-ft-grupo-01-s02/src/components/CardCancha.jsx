// src/components/CardCancha.jsx
// Tarjeta genérica para mostrar una cancha con imagen, datos y botón de acción.

import BadgeEstado from "./BadgeEstado";
import Button from "./Button";

function CardCancha({
  nombre,
  ubicacion,
  tipoCancha,
  precioHora,
  estado = "DISPONIBLE",
  imagen,
  onReservar,
  mostrarBoton = true,
}) {
  return (
    <article className="card-cancha">
      {imagen && (
        <div className="card-cancha__image-wrapper">
          <img
            src={imagen}
            alt={nombre}
            className="card-cancha__image"
          />
        </div>
      )}

      <div className="card-cancha__body">
        <header>
          <h2 className="card-cancha__title">{nombre}</h2>
          <div className="card-cancha__meta">
            {ubicacion && <span>{ubicacion}</span>}
            {tipoCancha && <span>{tipoCancha}</span>}
          </div>
        </header>

        <footer className="card-cancha__footer">
          <BadgeEstado estado={estado} />
          {precioHora != null && (
            <span className="card-cancha__price">
              ${Number(precioHora).toFixed(2)} / hora
            </span>
          )}

          {mostrarBoton && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onReservar}
            >
              Reservar cancha
            </Button>
          )}
        </footer>
      </div>
    </article>
  );
}

export default CardCancha;
