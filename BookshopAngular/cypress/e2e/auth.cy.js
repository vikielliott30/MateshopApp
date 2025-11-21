describe('Auth Tests', () => {
    Cypress.on('uncaught:exception', (err, runnable) => { return false; })
    let baseUrl;
    
    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl');
    
        if (!baseUrl) {
            baseUrl = 'http://localhost:4200';
        }

        cy.visit(`${baseUrl}/login`);
        cy.wait(500);
    });

    it('should show login form', () => {
        cy.contains('Login');
        cy.get('input[name="username"]').should('exist');
        cy.get('input[name="password"]').should('exist');
        //cy.get('input[name="insert password"]').should('exist'); // para hacer fallar test integracion
    });
  
    it('should login and redirect to /books', () => {
      cy.get('input[name="username"]').type('janedoe@gmail.com');
      cy.get('input[name="password"]').type('janespassword');
      cy.get('button').contains('Ingresar').click();
  
            cy.wait(500);
            cy.url().should('include', '/mates');
      cy.contains('All our listings');
    });
  
    it('should fail login and show error', () => {
      cy.get('input[name="username"]').type('notuser@gmail.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button').contains('Ingresar').click();
  
      cy.wait(500);
      cy.on('window:alert', (text) => {expect(text).to.contains('Login failed');});
    });

    it('should show all nav options when authenticated', () => {
        cy.get('input[name="username"]').type('janedoe@gmail.com');
        cy.get('input[name="password"]').type('janespassword');
        cy.get('button').contains('Ingresar').click();
        cy.wait(500);

        cy.url().should('include', '/books');

        cy.get('header').within(() => {
        cy.contains('mozziebooks').should('exist');
        cy.contains('Home').should('exist');
        cy.contains('Sell your books').should('exist');
        cy.contains('Logout').should('exist');
        cy.contains('Login').should('not.exist');
        });
    });

    it('should show only limited nav options when not authenticated', () => {
        cy.visit(`${baseUrl}/mates`);
        cy.wait(500);
        cy.get('header').within(() => {
        cy.contains('mozziebooks').should('exist');
        cy.contains('Home').should('exist');
        cy.contains('Login').should('exist');
        cy.contains('Sell your mates').should('not.exist');
        cy.contains('Logout').should('not.exist');
        });
    });

});