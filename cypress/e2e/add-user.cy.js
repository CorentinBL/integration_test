it('ajoute un utilisateur', () => {

    let callCount = 0;

    cy.intercept("GET", "/users", (req) => {
        callCount++;
        console.log("GET /users call #", callCount);
        // ...
        if (callCount <= 2) {
            req.reply({ body: { utilisateurs: [{ id: 1, prenom: "Alice", nom: "Test" }] } });
        } else {
            req.reply({ body: { utilisateurs: [
                        { id: 1, prenom: "Alice", nom: "Test" },
                        { id: 2, prenom: "Jean", nom: "Dupont" }
                    ]}});
        }
    });

    cy.intercept("POST", "/users", {
        statusCode: 201,
        body: { id: 2, prenom: "Jean", nom: "Dupont" }
    }).as("createUser");

    cy.visit('/');

    cy.get('[data-cy=firstName]').type('Jean');
    cy.get('[data-cy=lastName]').type('Dupont');
    cy.get('[data-cy=email]').type('jean@test.fr');
    cy.get('[data-cy=birthDate]').type('1990-01-01');
    cy.get('[data-cy=city]').type('Paris');
    cy.get('[data-cy=postalCode]').type('75001');

    cy.get('[data-testid=submit-button]')
        .should('not.be.disabled')
        .click();

    cy.wait("@createUser");
    cy.contains('Jean');
    cy.contains('Dupont');
});