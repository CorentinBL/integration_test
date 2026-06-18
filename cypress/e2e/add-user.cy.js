describe('Ajout utilisateur', () => {

    it('ajoute un utilisateur', () => {

        cy.visit('/');

        cy.get('[data-cy=nom]')
            .type('Dupont');

        cy.get('[data-cy=prenom]')
            .type('Jean');

        cy.get('[data-cy=email]')
            .type('jean.dupont@test.com');

        cy.get('[data-cy=submit]')
            .click();

        cy.get('[data-cy=users-list]')
            .contains('Jean');

    });

});