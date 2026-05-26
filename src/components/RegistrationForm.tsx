import FieldForm from "./FieldForm";

export default function RegistrationForm() {
    return (
        <div className="registration-form">
            <FieldForm label={"Name"} error={undefined}/>
        </div>
    )
}