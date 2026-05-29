import { render, screen } from "@testing-library/react";
import Toast from "../components/Toast";

describe("Toast - visibilité", () => {
    test("n'est pas rendu si visible est false", () => {
        render(<Toast visible={false} />);
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    test("est rendu si visible est true", () => {
        render(<Toast visible={true} />);
        expect(screen.getByRole("status")).toBeInTheDocument();
    });
});

describe("Toast - contenu", () => {
    test("affiche le message par défaut", () => {
        render(<Toast visible={true} />);
        expect(
            screen.getByText("Inscription enregistrée avec succès !")
        ).toBeInTheDocument();
    });

    test("affiche un message personnalisé", () => {
        render(<Toast visible={true} message="Bravo, vous êtes inscrit !" />);
        expect(screen.getByText("Bravo, vous êtes inscrit !")).toBeInTheDocument();
    });

    test("affiche l'icône de succès", () => {
        render(<Toast visible={true} />);
        expect(screen.getByText("✓")).toBeInTheDocument();
    });
});

describe("Toast - accessibilité", () => {
    test("a le rôle status", () => {
        render(<Toast visible={true} />);
        expect(screen.getByRole("status")).toBeInTheDocument();
    });

    test("a aria-live polite", () => {
        render(<Toast visible={true} />);
        expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    });
});

describe("Toast - classes CSS", () => {
    test("a les classes toast et toast--success", () => {
        render(<Toast visible={true} />);
        const toast = screen.getByRole("status");
        expect(toast).toHaveClass("toast");
        expect(toast).toHaveClass("toast--success");
    });
});