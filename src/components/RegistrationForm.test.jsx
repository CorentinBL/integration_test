import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import RegistrationForm from "../components/RegistrationForm";

beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
});

afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
});

// ─── Helper : date adulte valide ─────────────────────────────────────────────
function adultDate() {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 25);
    return d.toISOString().split("T")[0];
}

function minorDate() {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 16);
    return d.toISOString().split("T")[0];
}

// ─── Helper : remplir tous les champs ────────────────────────────────────────
function fillForm(overrides = {}) {
    const values = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@exemple.fr",
        birthDate: adultDate(),
        city: "Paris",
        postalCode: "75001",
        ...overrides,
    };

    fireEvent.change(screen.getByLabelText("Prénom"), { target: { value: values.firstName } });
    fireEvent.change(screen.getByLabelText("Nom"), { target: { value: values.lastName } });
    fireEvent.change(screen.getByLabelText("Adresse email"), { target: { value: values.email } });
    fireEvent.change(screen.getByLabelText("Date de naissance"), { target: { value: values.birthDate } });
    fireEvent.change(screen.getByLabelText("Ville"), { target: { value: values.city } });
    fireEvent.change(screen.getByLabelText("Code postal"), { target: { value: values.postalCode } });

    return values;
}

// ═════════════════════════════════════════════════════════════════════════════
// Rendu initial
// ═════════════════════════════════════════════════════════════════════════════
describe("RegistrationForm - rendu", () => {
    test("affiche le titre du formulaire", () => {
        render(<RegistrationForm />);
        expect(screen.getByText("Inscription")).toBeInTheDocument();
    });

    test("affiche tous les champs", () => {
        render(<RegistrationForm />);
        expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
        expect(screen.getByLabelText("Nom")).toBeInTheDocument();
        expect(screen.getByLabelText("Adresse email")).toBeInTheDocument();
        expect(screen.getByLabelText("Date de naissance")).toBeInTheDocument();
        expect(screen.getByLabelText("Ville")).toBeInTheDocument();
        expect(screen.getByLabelText("Code postal")).toBeInTheDocument();
    });

    test("affiche le bouton Sauvegarder", () => {
        render(<RegistrationForm />);
        expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    });

    test("le toast n'est pas visible au départ", () => {
        render(<RegistrationForm />);
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// Bouton désactivé / activé
// ═════════════════════════════════════════════════════════════════════════════
describe("RegistrationForm - bouton soumettre", () => {
    test("est désactivé quand le formulaire est vide", () => {
        render(<RegistrationForm />);
        expect(screen.getByTestId("submit-button")).toBeDisabled();
    });

    test("reste désactivé si seulement quelques champs sont remplis", () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByLabelText("Prénom"), { target: { value: "Jean" } });
        fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Dupont" } });
        expect(screen.getByTestId("submit-button")).toBeDisabled();
    });

    test("s'active quand tous les champs sont remplis", () => {
        render(<RegistrationForm />);
        fillForm();
        expect(screen.getByTestId("submit-button")).not.toBeDisabled();
    });

    test("se désactive si un champ est vidé après avoir été rempli", () => {
        render(<RegistrationForm />);
        fillForm();
        fireEvent.change(screen.getByLabelText("Prénom"), { target: { value: "" } });
        expect(screen.getByTestId("submit-button")).toBeDisabled();
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// Erreurs de validation
// ═════════════════════════════════════════════════════════════════════════════
describe("RegistrationForm - erreurs", () => {
    test("affiche une erreur sur prénom invalide après blur", () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByLabelText("Prénom"), { target: { value: "Jean2" } });
        fireEvent.blur(screen.getByLabelText("Prénom"));
        expect(screen.getByText(/chiffres ou de caractères spéciaux/i)).toBeInTheDocument();
    });

    test("affiche une erreur sur nom invalide après blur", () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Dupont!" } });
        fireEvent.blur(screen.getByLabelText("Nom"));
        expect(screen.getAllByText(/chiffres ou de caractères spéciaux/i).length).toBeGreaterThan(0);
    });

    test("affiche une erreur sur email invalide après blur", () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByLabelText("Adresse email"), { target: { value: "pasunemail" } });
        fireEvent.blur(screen.getByLabelText("Adresse email"));
        expect(screen.getByText(/adresse email n'est pas valide/i)).toBeInTheDocument();
    });

    test("affiche une erreur si mineur après blur", () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByLabelText("Date de naissance"), { target: { value: minorDate() } });
        fireEvent.blur(screen.getByLabelText("Date de naissance"));
        expect(screen.getByText(/18 ans/i)).toBeInTheDocument();
    });

    test("affiche une erreur sur ville invalide après blur", () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByLabelText("Ville"), { target: { value: "Paris9!" } });
        fireEvent.blur(screen.getByLabelText("Ville"));
        expect(screen.getAllByText(/chiffres ou de caractères spéciaux/i).length).toBeGreaterThan(0);
    });

    test("affiche une erreur sur code postal invalide après blur", () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByLabelText("Code postal"), { target: { value: "123" } });
        fireEvent.blur(screen.getByLabelText("Code postal"));
        expect(screen.getByText(/exactement 5 chiffres/i)).toBeInTheDocument();
    });

    test("l'input a la classe form-input--error si invalide", () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByLabelText("Adresse email"), { target: { value: "bad" } });
        fireEvent.blur(screen.getByLabelText("Adresse email"));
        expect(screen.getByLabelText("Adresse email")).toHaveClass("form-input--error");
    });

    test("l'erreur disparaît quand le champ redevient valide", () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByLabelText("Adresse email"), { target: { value: "bad" } });
        fireEvent.blur(screen.getByLabelText("Adresse email"));
        expect(screen.getByText(/adresse email n'est pas valide/i)).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText("Adresse email"), { target: { value: "bon@exemple.fr" } });
        expect(screen.queryByText(/adresse email n'est pas valide/i)).not.toBeInTheDocument();
    });

    test("affiche toutes les erreurs à la soumission si les données sont invalides", () => {
        render(<RegistrationForm />);
        fillForm({ firstName: "Jean2", email: "notvalid", postalCode: "abc" });
        fireEvent.click(screen.getByTestId("submit-button"));
        expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// Inscription réussie
// ═════════════════════════════════════════════════════════════════════════════
describe("RegistrationForm - Inscription réussie", () => {
    test("affiche le toast de succès", async () => {
        render(<RegistrationForm />);
        fillForm();
        fireEvent.click(screen.getByTestId("submit-button"));
        await waitFor(() => {
            expect(screen.getByText(/inscription enregistrée avec succès/i)).toBeInTheDocument();
        });
    });

    test("vide tous les champs après soumission", async () => {
        render(<RegistrationForm />);
        fillForm();
        fireEvent.click(screen.getByTestId("submit-button"));
        await waitFor(() => {
            expect(screen.getByLabelText("Prénom")).toHaveValue("");
            expect(screen.getByLabelText("Nom")).toHaveValue("");
            expect(screen.getByLabelText("Adresse email")).toHaveValue("");
            expect(screen.getByLabelText("Ville")).toHaveValue("");
            expect(screen.getByLabelText("Code postal")).toHaveValue("");
        });
    });

    test("le bouton est désactivé après réinitialisation", async () => {
        render(<RegistrationForm />);
        fillForm();
        fireEvent.click(screen.getByTestId("submit-button"));
        await waitFor(() => {
            expect(screen.getByTestId("submit-button")).toBeDisabled();
        });
    });

    test("appelle saveRegistration", () => {
        render(<RegistrationForm />);
        fillForm();
        fireEvent.click(screen.getByTestId("submit-button"));
        expect(storage.saveRegistration).toHaveBeenCalledTimes(1);
    });

    test("le toast disparaît après 3 secondes", async () => {
        render(<RegistrationForm />);
        fillForm();
        fireEvent.click(screen.getByTestId("submit-button"));

        await waitFor(() => {
            expect(screen.getByRole("status")).toBeInTheDocument();
        });

        act(() => jest.advanceTimersByTime(3000));

        await waitFor(() => {
            expect(screen.queryByRole("status")).not.toBeInTheDocument();
        });
    });

    test("ne sauvegarde pas si le formulaire est invalide", () => {
        render(<RegistrationForm />);
        fillForm({ email: "invalid", postalCode: "abc" });
        fireEvent.click(screen.getByTestId("submit-button"));
        expect(storage.saveRegistration).not.toHaveBeenCalled();
    });
});