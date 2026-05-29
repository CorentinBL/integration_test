import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FieldForm from "../components/FieldForm";

const defaultProps = {
    id: "firstName",
    label: "Prénom",
    value: "",
    onChange: jest.fn(),
    onBlur: jest.fn(),
};

describe("FieldForm - rendu de base", () => {
    test("affiche le label correctement", () => {
        render(<FieldForm {...defaultProps} />);
        expect(screen.getByText("Prénom")).toBeInTheDocument();
    });

    test("le label est lié à l'input via htmlFor", () => {
        render(<FieldForm {...defaultProps} />);
        expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
    });

    test("affiche le placeholder si fourni", () => {
        render(<FieldForm {...defaultProps} placeholder="Jean" />);
        expect(screen.getByPlaceholderText("Jean")).toBeInTheDocument();
    });

    test("le type par défaut est text", () => {
        render(<FieldForm {...defaultProps} />);
        expect(screen.getByLabelText("Prénom")).toHaveAttribute("type", "text");
    });

    test("applique le type passé en prop", () => {
        render(<FieldForm {...defaultProps} type="email" />);
        expect(screen.getByLabelText("Prénom")).toHaveAttribute("type", "email");
    });

    test("applique les attributs min et max sur un input date", () => {
        render(
            <FieldForm
                {...defaultProps}
                type="date"
                min="1900-01-01"
                max="2006-01-01"
            />
        );
        const input = screen.getByLabelText("Prénom");
        expect(input).toHaveAttribute("min", "1900-01-01");
        expect(input).toHaveAttribute("max", "2006-01-01");
    });
});

describe("FieldForm - gestion des erreurs", () => {
    test("n'affiche pas de message d'erreur si error est absent", () => {
        render(<FieldForm {...defaultProps} />);
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    test("affiche le message d'erreur si error est fourni", () => {
        render(<FieldForm {...defaultProps} error="Champ invalide" />);
        expect(screen.getByRole("alert")).toHaveTextContent("Champ invalide");
    });

    test("ajoute la classe form-input--error si error est présent", () => {
        render(<FieldForm {...defaultProps} error="Erreur" />);
        expect(screen.getByLabelText("Prénom")).toHaveClass("form-input--error");
    });

    test("n'ajoute pas la classe form-input--error sans erreur", () => {
        render(<FieldForm {...defaultProps} />);
        expect(screen.getByLabelText("Prénom")).not.toHaveClass("form-input--error");
    });

    test("aria-invalid est true si error est présent", () => {
        render(<FieldForm {...defaultProps} error="Erreur" />);
        expect(screen.getByLabelText("Prénom")).toHaveAttribute("aria-invalid", "true");
    });

    test("aria-invalid est false sans erreur", () => {
        render(<FieldForm {...defaultProps} />);
        expect(screen.getByLabelText("Prénom")).toHaveAttribute("aria-invalid", "false");
    });

    test("aria-describedby pointe vers le span d'erreur si error présent", () => {
        render(<FieldForm {...defaultProps} error="Erreur" />);
        expect(screen.getByLabelText("Prénom")).toHaveAttribute(
            "aria-describedby",
            "firstName-error"
        );
    });

    test("aria-describedby est absent sans erreur", () => {
        render(<FieldForm {...defaultProps} />);
        expect(screen.getByLabelText("Prénom")).not.toHaveAttribute("aria-describedby");
    });
});

describe("FieldForm - interactions", () => {
    test("appelle onChange avec l'id et la valeur saisie", () => {
        const onChange = jest.fn();
        render(<FieldForm {...defaultProps} onChange={onChange} />);
        fireEvent.change(screen.getByLabelText("Prénom"), {
            target: { value: "Jean" },
        });
        expect(onChange).toHaveBeenCalledWith("firstName", "Jean");
    });

    test("appelle onBlur avec l'id à la perte de focus", () => {
        const onBlur = jest.fn();
        render(<FieldForm {...defaultProps} onBlur={onBlur} />);
        fireEvent.blur(screen.getByLabelText("Prénom"));
        expect(onBlur).toHaveBeenCalledWith("firstName");
    });
});