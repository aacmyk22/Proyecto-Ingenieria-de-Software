// src/components/Dropdown.jsx
// Selector desplegable con soporte para validaciones visuales y errores.

function Dropdown({
    label,
    options,
    value,
    onChange,
    error = "",
    required = false,
    disabled = false,
    id
}) {
    const hasError = Boolean(error);
    const selectClasses = [
        "select select-bordered w-full bg-white text-black",
        hasError ? "dropdown--error" : ""
    ].filter(Boolean).join(" ");

    return (
        <div className="dropdown-group w-full pb-4">
            {label && (
                <label htmlFor={id} className="label">
                    <span className="label-text text-[var(--canchitas-primary-soft)]">
                        {label}
                        {required && <span className="text-[var(--canchitas-danger)] ml-1">*</span>}
                    </span>
                </label>
            )}
            <div className="relative">
                <select
                    id={id}
                    className={selectClasses}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${id}-error` : undefined}
                >
                    <option disabled value="">
                        -- Selecciona --
                    </option>
                    {options.map((opcion) => (
                        <option key={opcion.value} value={opcion.value}>
                            {opcion.label}
                        </option>
                    ))}
                </select>
                {hasError && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
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
                <p id={`${id}-error`} className="dropdown-error-text" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export default Dropdown;
