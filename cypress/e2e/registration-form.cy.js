const VALID_USER = {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean@test.fr",
    birthDate: "1990-01-01",
    city: "Paris",
    postalCode: "75001",
};


function fillForm(user = VALID_USER) {
    cy.get('[data-cy=firstName]').type(user.firstName);
    cy.get('[data-cy=lastName]').type(user.lastName);
    cy.get('[data-cy=email]').type(user.email);
    cy.get('[data-cy=birthDate]').type(user.birthDate);
    cy.get('[data-cy=city]').type(user.city);
    cy.get('[data-cy=postalCode]').type(user.postalCode);
}

describe("Formulaire d'inscription", () => {

    beforeEach(() => {
        cy.intercept("GET", "/users", { body: { utilisateurs: [] } }).as("getUsers");
        cy.visit("/");
        cy.wait("@getUsers");
    });

    it("désactive le bouton submit si le formulaire est vide", () => {
        cy.get('[data-testid=submit-button]').should("be.disabled");
    });

    it("désactive le bouton submit si un champ est manquant", () => {
        cy.get('[data-cy=firstName]').type("Jean");
        cy.get('[data-cy=lastName]').type("Dupont");
        // email manquant intentionnellement
        cy.get('[data-cy=birthDate]').type("1990-01-01");
        cy.get('[data-cy=city]').type("Paris");
        cy.get('[data-cy=postalCode]').type("75001");

        cy.get('[data-testid=submit-button]').should("be.disabled");
    });

    it("affiche une erreur si l'email est invalide", () => {
        fillForm({ ...VALID_USER, email: "invalid-email" });
        cy.get('[data-cy=email]').focus().blur();
        cy.get('#email-error').should("contain", "n'est pas valide");
    });

    it("affiche une erreur si le code postal est invalide", () => {
        fillForm({ ...VALID_USER, postalCode: "123" });
        cy.get('[data-cy=postalCode]').focus().blur();
        cy.get('#postalCode-error').should("contain", "5 chiffres");
    });

    it("affiche une erreur si l'utilisateur est mineur", () => {
        const minorDate = new Date();
        minorDate.setFullYear(minorDate.getFullYear() - 17);
        const minorDateStr = minorDate.toISOString().split("T")[0];

        fillForm({ ...VALID_USER, birthDate: minorDateStr });
        cy.get('[data-cy=birthDate]').focus().blur();
        cy.get('#birthDate-error').should("contain", "18 ans");
    });

    it("affiche une erreur si le prénom contient des chiffres", () => {
        fillForm({ ...VALID_USER, firstName: "Jean123" });
        cy.get('[data-cy=firstName]').focus().blur();
        cy.get('#firstName-error').should("contain", "chiffres");
    });

    it("ajoute un utilisateur avec succès", () => {
        let callCount = 0;

        cy.intercept("GET", "/users", (req) => {
            callCount++;
            if (callCount <= 2) {
                req.reply({ body: { utilisateurs: [] } });
            } else {
                req.reply({
                    body: {
                        utilisateurs: [{ id: 1, prenom: "Jean", nom: "Dupont" }],
                    },
                });
            }
        });

        cy.intercept("POST", "/users", {
            statusCode: 201,
            body: { id: 1, prenom: "Jean", nom: "Dupont" },
        }).as("createUser");

        cy.visit("/");
        fillForm();

        cy.get('[data-testid=submit-button]')
            .should("not.be.disabled")
            .click();

        cy.wait("@createUser");

        cy.contains("Jean");
        cy.contains("Dupont");
    });

    it("affiche une erreur si le serveur retourne 500", () => {
        cy.intercept("POST", "/users", {
            statusCode: 500,
            body: { detail: "Database error" },
        }).as("createUserFail");

        fillForm();

        cy.get('[data-testid=submit-button]').click();
        cy.wait("@createUserFail");

        cy.get('[data-testid=form-error]').should("exist");
    });
});
