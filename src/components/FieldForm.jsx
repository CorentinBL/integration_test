/**
 * Composant FormField – champ de formulaire avec label et message d'erreur.
 * @param {Object} props
 * @param {string} props.id - Identifiant unique du champ (lie label et input).
 * @param {string} props.label - Libellé du champ.
 * @param {string} props.type - Type HTML de l'input.
 * @param {string} props.value - Valeur courante.
 * @param {string} [props.error] - Message d'erreur à afficher (si présent).
 * @param {Function} props.onChange - Callback appelé à chaque changement.
 * @param {Function} props.onBlur - Callback appelé à la perte de focus.
 * @param {string} [props.placeholder] - Placeholder de l'input.
 * @param {string} [props.min] - Attribut min (pour les inputs date).
 * @param {string} [props.max] - Attribut max (pour les inputs date).
 */
const FieldForm = ({
                       id,
                       label,
                       type = "text",
                       value,
                       error,
                       onChange,
                       onBlur,
                       placeholder,
                       min,
                       max,
                   }) => {
    return (
        <div className="form-field">
            <label htmlFor={id} className="form-label">
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={(e) => onChange(id, e.target.value)}
                onBlur={() => onBlur(id)}
                placeholder={placeholder}
                min={min}
                max={max}
                className={`form-input ${error ? "form-input--error" : ""}`}
                aria-describedby={error ? `${id}-error` : undefined}
                aria-invalid={!!error}
            />
            {error && (
                <span id={`${id}-error`} className="form-error" role="alert">
          {error}
        </span>
            )}
        </div>
    );
};

export default FieldForm;