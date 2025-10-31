import userData from '../fixtures/userData.json'
let userID;

describe('Gerencie os usuários, consulte dados para login e cadastre administrador', () => {
  it('Listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'https://serverest.dev/usuarios'
    }).then((response) => {

      // Validações básicas da resposta
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
      expect(response.body.usuarios).to.be.an('array')

      // Armazena os usuários retornados
      const usuarios = response.body.usuarios

      //Mostra a quantidade total
      cy.log(`Quantidade total de usuários: ${usuarios.length}`)

      // Mostra todos os usuários em formato de tabela no console
      console.table(usuarios)

      //Mostra nome e email de cada usuário no log do Cypress
      usuarios.forEach((u, i) => {
        cy.log(`${i + 1}. ${u.nome} - ${u.email}`)
      })
    })
  });

  it('Cadastrar usuário', () => {
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/usuarios',
      body: userData.usuario,
      failOnStatusCode: false
    }).then((response) => {

      if (response.status === 201) {
        cy.log('Usuário criado com sucesso!')
        cy.expect(response.body.message).to.be.equal('Cadastro realizado com sucesso')
        userID = response.body._id //Armazena o ID para outros testes
        cy.log(`${userID}`)
      } else if (response.status === 400) {
        cy.log('Usuário já cadastrado!')
        cy.expect(response.body.message).to.be.equal('Este email já está sendo usado')
        userID = response.body._id //Armazena o ID para outros testes
        cy.log(`${userID}`)

      } else {
        cy.log('🚨 Status inesperado:', response.status)
        throw new Error(`Status inesperado: ${response.status}`)
      }

    })
  });

  it('Deve cadastrar usuário cadastrado e ver se o endpoint é de erro', () => {
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/usuarios',
      body: userData.usuario,
      failOnStatusCode: false
    }).then((response) => {

      if (response.status === 201) {
        cy.log('Usuário criado com sucesso!')
        cy.expect(response.body.message).to.be.equal('Cadastro realizado com sucesso')
        userID = response.body._id //Armazena o ID para outros testes
        cy.log(`${userID}`)
      } else if (response.status === 400) {
        cy.log('Usuário já cadastrado!')
        cy.expect(response.body.message).to.be.equal('Este email já está sendo usado')
        cy.log(`${userID}`)

      } else {
        cy.log('🚨 Status inesperado:', response.status)
        throw new Error(`Status inesperado: ${response.status}`)
      }

    })
  });

  it('Buscar usuário por ID', () => {
    cy.request({
      method: 'GET',
      url: `https://serverest.dev/usuarios/${userID}`,
    }).then((response) => {

      if (response.status === 200) {
        expect(response.body.nome).to.be.eql(userData.usuario.nome)
        expect(response.body.email).to.be.eql(userData.usuario.email)
        expect(response.body.password).to.be.eql(userData.usuario.password)
        expect(response.body.administrador).to.be.eql(userData.usuario.administrador)
      } else if (response.status === 400) {
        expect(response.body.message).to.be.eql('Usuário não encontrado')

      }
    })

  });

  it('Editar usuário', () => {
    cy.request({
      method: 'PUT',
      url: `https://serverest.dev/usuarios/${userID}`,
      body: {
        nome: "MagQA",
        email: "magqa@qa.com.br",
        password: "roque",
        administrador: "true"
      }
    }).then((response) => {
      if(response.status === 200){
        expect(response.body.message).to.be.eql('Registro alterado com sucesso')
      }else if(response.status === 201){
        expect(response.body.message).to.be.eql('Cadastro realizado com sucesso')

      }else if(response.status === 400){
        expect(response.body.message).to.be.eql('Este email já está sendo usado')
      }

    })
  });

  it('Excluir usuário', () => {
    cy.request({
      method: 'DELETE',
      url: `https://serverest.dev/usuarios/${userID}`,
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body.message).to.be.eql('Registro excluído com sucesso')
      } else if (response.status === 400) {
        expect(response.body.message).to.be.eql('Não é permitido excluir usuário com carrinho cadastrado')

      }

    })
  });
})