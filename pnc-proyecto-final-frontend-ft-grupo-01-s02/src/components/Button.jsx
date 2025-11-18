// src/components/Button.jsx
// Botón reutilizable para la app Canchitas.

function Button({
  variant = "primary",  // "primary" | "secondary" | "ghost"
  size = "md",         // "sm" | "md" | "lg"
  fullWidth = false,
  className = "",
  children,
  ...props
}) {
  const variantClass =
    variant === "secondary"
      ? "btn-secondary"
      : variant === "ghost"
      ? "btn-ghost"
      : "btn-primary";

  const sizeClass =
    size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  const fullClass = fullWidth ? "btn-full" : "";

  const classes = ["btn-base", variantClass, sizeClass, fullClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
