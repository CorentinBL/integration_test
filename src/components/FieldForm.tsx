export default function FieldForm ({label, error, ...props}){
    return (
        <div className="field">
        <label htmlFor={props.name}>{label}</label>
        <input {...props} />
            {error && <span className="error">{error}</span>}
        </div>
    );
}