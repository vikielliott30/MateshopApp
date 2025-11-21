describe('Update book post Tests', () => {
    Cypress.on('uncaught:exception', (err, runnable) => { return false; })
    let baseUrl;
    
    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl');
    
        if (!baseUrl) {
            baseUrl = 'http://localhost:4200';
        }

    });

    it('should update book post', () => {
        cy.visit(`${baseUrl}/login`);
        cy.wait(500);

        cy.get('input[name="username"]').type('janedoe@gmail.com');
        cy.get('input[name="password"]').type('janespassword');
        cy.get('button').contains('Ingresar').click();
  
        cy.wait(500);
        cy.url().should('include', '/mates');

        cy.get('.bookPost-card').contains('h5', 'test')
            .parents('.bookPost-card')                    
            .find('a.btn-outline-primary')            
            .click();
        cy.wait(500);
        cy.url().should('include', '/edit-mate/22');

        cy.contains('Edit book post');
        cy.get('input[name="title"]').clear().type('updated test');
        cy.get('input[name="author"]').clear().type('updated author');
        cy.get('button').contains('Update').click();
        cy.wait(500);

        cy.visit(`${baseUrl}/mates`);
        cy.wait(500);
        cy.get('.bookPost-card')
            .contains('h5', 'updated test')
            .parents('.bookPost-card')
            .within(() => {
                cy.contains('updated author');
            });
        cy.get('.bookPost-card').should('contain', 'test')
        
    });

    it('should show error and not update book post', () => {
        cy.visit(`${baseUrl}/edit-mate/22`);
        cy.wait(500);
        cy.url().should('include', '/edit-mate/22');

        cy.contains('Edit book post');
        cy.get('input[name="title"]').clear().type('failed updated test');
        cy.get('button').contains('Update').click();
        cy.wait(500);

        cy.visit(`${baseUrl}/books`);
        cy.wait(500);
        
        cy.get('.bookPost-card').should('not.contain', 'failed updated test')
        
    });
    
});