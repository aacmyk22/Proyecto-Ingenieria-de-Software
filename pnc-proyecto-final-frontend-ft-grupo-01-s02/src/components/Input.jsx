// src/components/Input.jsx
// Campo de texto reutilizable con etiqueta, mensaje de error y validaciones visuales.

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
  required = false,
  ...props
}) {
  const hasError = Boolean(error);
  const inputClasses = [
    "input-field",
    hasError ? "input-field--error" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="text-[var(--canchitas-danger)] ml-1">*</span>}
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
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          {...props}
        />

        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}

        {hasError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-[var(--canchitas-danger)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {hasError && (
        <p id={`${id}-error`} className="input-error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
