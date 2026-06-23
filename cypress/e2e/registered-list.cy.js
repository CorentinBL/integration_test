describe("Liste des inscrits", () => {

    it("affiche la liste des utilisateurs", () => {

        let callCount = 0;

        cy.intercept("GET", "/users", (req) => {
            callCount++;
            req.reply({
                body: {
                    utilisateurs: [
                        { id: 1, prenom: "Alice", nom: "Martin" },
                        { id: 2, prenom: "Bob", nom: "Dupont" }
                    ]
                }
            });
        }).as("getUsers");

        cy.visit("/");
        cy.wait("@getUsers");

        cy.contains("Alice");
        cy.contains("Bob");
        cy.contains("Inscrits (2)");
    });

    it("affiche un message si aucun inscrit", () => {

        cy.intercept("GET", "/users", {
            body: { utilisateurs: [] }
        }).as("getUsers");

        cy.visit("/");
        cy.wait("@getUsers");

        cy.contains("Aucun inscrit pour le moment");
        cy.contains("Inscrits (0)");
    });

});