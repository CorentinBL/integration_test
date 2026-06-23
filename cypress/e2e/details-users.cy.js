function loginAdmin() {
    cy.get('[data-testid=admin-login-btn]').click();
    cy.get('[data-cy=admin-email]').type("admin@test.com");
    cy.get('[data-cy=admin-password]').type("password");
    cy.get('[data-testid=admin-submit]').click();
}

describe("Détails utilisateur (admin)", () => {

    beforeEach(() => {
        cy.intercept("POST", "/admin/login", {
            statusCode: 200,
            body: { token: "fake-token" },
        });

        cy.intercept("GET", "/users", {
            body: {
                utilisateurs: [{ id: 1, prenom: "Alice", nom: "Martin" }],
            },
        });

        cy.visit("/");
        loginAdmin();
    });

    it("affiche les détails d'un utilisateur", () => {
        cy.intercept("GET", "/users/1", {
            statusCode: 200,
            body: {
                id: 1,
                prenom: "Alice",
                nom: "Martin",
                email: "alice@test.fr",
                date_naissance: "1990-05-15",
                ville: "Paris",
                code_postal: "75001",
            },
        }).as("getUserDetails");

        cy.get('[data-testid=details-btn-1]').click();
        cy.wait("@getUserDetails");

        cy.contains("alice@test.fr");
        cy.contains("Paris");
        cy.contains("75001");
        cy.contains("1990-05-15");
    });

    it("ferme la modale en cliquant sur Fermer", () => {
        cy.intercept("GET", "/users/1", {
            statusCode: 200,
            body: {
                id: 1,
                prenom: "Alice",
                nom: "Martin",
                email: "alice@test.fr",
                date_naissance: "1990-05-15",
                ville: "Paris",
                code_postal: "75001",
            },
        });

        cy.get('[data-testid=details-btn-1]').click();
        cy.contains("Détails utilisateur").should("exist");

        cy.contains("Fermer").click();
        cy.contains("Détails utilisateur").should("not.exist");
    });

    it("ferme la modale en cliquant sur l'overlay", () => {
        cy.intercept("GET", "/users/1", {
            statusCode: 200,
            body: {
                id: 1,
                prenom: "Alice",
                nom: "Martin",
                email: "alice@test.fr",
                date_naissance: "1990-05-15",
                ville: "Paris",
                code_postal: "75001",
            },
        });

        cy.get('[data-testid=details-btn-1]').click();
        cy.contains("Détails utilisateur").should("exist");

        cy.get('.modal-overlay').click({ force: true });
        cy.contains("Détails utilisateur").should("not.exist");
    });
});
