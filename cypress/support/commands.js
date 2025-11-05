// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// Listar os usuários
Cypress.Commands.add('listarUsers', () => {
    cy.request({
        method: 'GET',
        url: '/usuarios'
    })
})


// Cadastrar usuário
Cypress.Commands.add('cadastrarUsers', (usuario) => {
    cy.request({
        method: 'POST',
        url: '/usuarios',
        body: usuario,
        failOnStatusCode: false
    })
})

// Buscar usuário por ID
Cypress.Commands.add('buscarUsuarioPorId', (id) => {
    cy.request({
        method: 'GET',
        url: `/usuarios/${id}`,
        failOnStatusCode: false
    })
})

// Editar usuário
Cypress.Commands.add('editarUsuario', (id, novoUsuario) => {
    cy.request({
        method: 'PUT',
        url: `/usuarios/${id}`,
        body: novoUsuario,
        failOnStatusCode: false
    })
})

// Excluir usuário
Cypress.Commands.add('excluirUsuario', (id) => {
    cy.request({
        method: 'DELETE',
        url: `/usuarios/${id}`,
        failOnStatusCode: false
    })
})

// Login
Cypress.Commands.add('login', (email, password) =>{
    cy.request({
        method: 'POST',
        url: '/login',
        body: {
            email: email,
            password: password
        }

    })

})