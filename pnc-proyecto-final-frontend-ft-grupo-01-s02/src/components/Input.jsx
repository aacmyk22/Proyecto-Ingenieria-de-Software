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
  suffix = null,
  ...props
}) {
  const inputClasses = ["input-field", error ? "input-field--error" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={type}
          className={suffix ? `${inputClasses} pr-10` : inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />

        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>

      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
}

export default Input;
