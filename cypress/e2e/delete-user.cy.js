function loginAdmin() {
    cy.get('[data-testid=admin-login-btn]').click();
    cy.get('[data-cy=admin-email]').type("admin@test.com");
    cy.get('[data-cy=admin-password]').type("password");
    cy.get('[data-testid=admin-submit]').click();
}

describe("Suppression utilisateur (admin)", () => {

    it("supprime un utilisateur", () => {
        let callCount = 0;

        cy.intercept("GET", "/users", (req) => {
            callCount++;
            if (callCount <= 2) {
                req.reply({
                    body: {
                        utilisateurs: [{ id: 1, prenom: "Jean", nom: "Dupont" }],
                    },
                });
            } else {
                req.reply({ body: { utilisateurs: [] } });
            }
        });

        cy.intercept("POST", "/admin/login", {
            statusCode: 200,
            body: { token: "fake-token" },
        });

        cy.intercept("DELETE", "/users/1", { statusCode: 200 }).as("deleteUser");

        cy.visit("/");
        loginAdmin();

        cy.get('[data-testid=delete-btn-1]').click();
        cy.wait("@deleteUser");

        cy.contains("Jean").should("not.exist");
    });

    it("les boutons de suppression sont absents sans token admin", () => {
        cy.intercept("GET", "/users", {
            body: {
                utilisateurs: [{ id: 1, prenom: "Jean", nom: "Dupont" }],
            },
        });

        cy.visit("/");

        cy.get('[data-testid=delete-btn-1]').should("not.exist");
    });
});