describe("Connexion admin", () => {

    beforeEach(() => {
        cy.intercept("GET", "/users", {
            body: { utilisateurs: [] }
        }).as("getUsers");

        cy.visit("/");
        cy.wait("@getUsers");
    });

    it("connecte un administrateur avec succès", () => {
        cy.intercept("POST", "/admin/login", {
            statusCode: 200,
            body: { token: "fake-token" }
        }).as("loginAdmin");

        cy.get('[data-testid=admin-login-btn]').click();
        cy.get('[data-testid=admin-login-form]').should("exist");

        cy.get('[data-cy=admin-email]').type("admin@test.com");
        cy.get('[data-cy=admin-password]').type("password");

        cy.get('[data-testid=admin-submit]')
            .should("not.be.disabled")
            .click();

        cy.wait("@loginAdmin");

        // Vérifie que le formulaire de login disparaît
        cy.get('[data-testid=admin-login-form]').should("not.exist");

        // Vérifie que les boutons admin sont visibles
        cy.get('[data-testid=delete-btn-1]').should("not.exist"); // pas d'users
        cy.get('[data-testid=admin-login-btn]').should("not.exist"); // bouton login caché
    });

    it("désactive le bouton si les champs sont vides", () => {
        cy.get('[data-testid=admin-login-btn]').click();

        cy.get('[data-testid=admin-submit]').should("be.disabled");
    });

    it("affiche une erreur si identifiants invalides", () => {
        cy.intercept("POST", "/admin/login", {
            statusCode: 401,
            body: { detail: "Identifiants invalides" }
        }).as("loginFailed");

        cy.get('[data-testid=admin-login-btn]').click();

        cy.get('[data-cy=admin-email]').type("bad@test.com");
        cy.get('[data-cy=admin-password]').type("wrong");

        cy.get('[data-testid=admin-submit]').click();
        cy.wait("@loginFailed");

        cy.get('[data-testid=admin-error]').should("contain", "Identifiants invalides");
        cy.get('[data-testid=admin-login-form]').should("exist"); // formulaire toujours visible
    });
});