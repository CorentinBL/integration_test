import { render, screen, fireEvent } from "@testing-library/react";
import UsersDetailsModal from "./UsersDetailsModal";

describe("Composant UserDetailsModal", () => {

    // -------------------------
    test("ne s'affiche pas si aucun utilisateur n'est fourni", () => {
        const { container } = render(
            <UsersDetailsModal user={null} onClose={jest.fn()} />
        );

        expect(container.firstChild).toBeNull();
    });

    // -------------------------
    test("affiche les informations utilisateur correctement", () => {
        const userMock = {
            prenom: "Jean",
            nom: "Dupont",
            email: "jean@example.com",
            date_naissance: "2000-01-01",
            ville: "Paris",
            code_postal: "75000",
        };

        render(<UsersDetailsModal user={userMock} onClose={jest.fn()} />);

        expect(screen.getByText("Détails utilisateur")).toBeInTheDocument();

        expect(screen.getByText(/Jean/)).toBeInTheDocument();
        expect(screen.getByText(/Dupont/)).toBeInTheDocument();
        expect(screen.getByText(/jean@example.com/)).toBeInTheDocument();
        expect(screen.getByText(/2000-01-01/)).toBeInTheDocument();
        expect(screen.getByText(/Paris/)).toBeInTheDocument();
        expect(screen.getByText(/75000/)).toBeInTheDocument();
    });

    // -------------------------
    test("appelle onClose lors du clic sur le bouton fermer", () => {
        const onCloseMock = jest.fn();

        const userMock = {
            prenom: "Jean",
            nom: "Dupont",
            email: "jean@example.com",
            date_naissance: "2000-01-01",
            ville: "Paris",
            code_postal: "75000",
        };

        render(<UsersDetailsModal user={userMock} onClose={onCloseMock} />);

        fireEvent.click(screen.getByText("Fermer"));

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    // -------------------------
    test("ferme la modale en cliquant sur l'overlay", () => {
        const onCloseMock = jest.fn();

        const userMock = {
            prenom: "Jean",
            nom: "Dupont",
            email: "jean@example.com",
            date_naissance: "2000-01-01",
            ville: "Paris",
            code_postal: "75000",
        };

        const { container } = render(
            <UsersDetailsModal user={userMock} onClose={onCloseMock} />
        );

        fireEvent.click(container.firstChild); // overlay click

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    // -------------------------
    test("ne ferme pas la modale lorsqu'on clique à l'intérieur", () => {
        const onCloseMock = jest.fn();

        const userMock = {
            prenom: "Jean",
            nom: "Dupont",
            email: "jean@example.com",
            date_naissance: "2000-01-01",
            ville: "Paris",
            code_postal: "75000",
        };

        render(<UsersDetailsModal user={userMock} onClose={onCloseMock} />);

        fireEvent.click(screen.getByText("Détails utilisateur"));

        expect(onCloseMock).not.toHaveBeenCalled();
    });
});