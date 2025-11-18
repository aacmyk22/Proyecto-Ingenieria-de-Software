// src/components/Input.jsx
// Campo de texto reutilizable con etiqueta y mensaje de error opcional.

function Input({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
  className = "",
  ...props
}) {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        className={["input-field", error ? "input-field--error" : "", className]
          .filter(Boolean)
          .join(" ")}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />

      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
}

export default Input;
