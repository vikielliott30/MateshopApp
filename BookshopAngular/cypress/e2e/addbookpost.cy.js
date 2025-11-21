describe('Add book post Tests', () => {
    Cypress.on('uncaught:exception', (err, runnable) => { return false; })
    let baseUrl;
    
    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl');
    
        if (!baseUrl) {
            baseUrl = 'http://localhost:4200';
        }

    });

    it('should add book post', () => {
        cy.visit(`${baseUrl}/login`);
        cy.wait(500);

        cy.get('input[name="username"]').type('janedoe@gmail.com');
        cy.get('input[name="password"]').type('janespassword');
        cy.get('button').contains('Ingresar').click();
  
        cy.wait(500);
        cy.url().should('include', '/mates');

        cy.get('header').within(() => {
            cy.contains('mozziebooks').should('exist');
            cy.contains('Home').should('exist');
            cy.contains('Sell your mates').should('exist').click();
            cy.contains('Logout').should('exist');
            cy.contains('Login').should('not.exist');
        });
        cy.wait(500);
        cy.url().should('include', '/add-mate');

        cy.contains('Add new book post');
        cy.get('input[name="title"]').type('test');
        cy.get('input[name="author"]').type('test');
        cy.get('input[name="genre"]').type('test');
        cy.get('textarea[name="description"]').type('test');
        cy.get('select[name="condition"]').select('used');
        cy.get('input[name="price"]').type('1');
        cy.get('input[name="imageUrl"]').should('exist');
        cy.get('button').contains('Create').click();
        cy.wait(500);

        cy.visit(`${baseUrl}/mates`);
        cy.wait(500);
        cy.get('.bookPost-card').should('contain', 'test')
        
    });

    it('should show error and not add book post', () => {
        cy.visit(`${baseUrl}/add-mate`);
        cy.wait(500);
        cy.url().should('include', '/add-mate');

        cy.contains('Add new book post');
        cy.get('input[name="title"]').type('notadded');
        cy.get('input[name="author"]').type('notadded');
        cy.get('input[name="genre"]').type('notadded');
        cy.get('textarea[name="description"]').type('notadded');
        cy.get('select[name="condition"]').select('used');
        cy.get('input[name="price"]').type('1');
        cy.get('input[name="imageUrl"]').should('exist');

        cy.get('button').contains('Create').click();
        cy.wait(500);

        cy.visit(`${baseUrl}/mates`);
        cy.wait(500);
        
        cy.get('.bookPost-card').should('not.contain', 'notadded')
        
    });

});