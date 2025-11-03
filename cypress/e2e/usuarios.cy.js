import userData from '../fixtures/userData.json'
let userID;

describe('Gerencie os usuários, consulte dados para login e cadastre administrador', () => {
  it('Listar usuários cadastrados', () => {
    cy.listarUsers().then((response) => {
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
    cy.cadastrarUsers(userData.usuario).then((response) => {

      if (response.status === 201) {
        cy.expect(response.body.message).to.be.equal('Cadastro realizado com sucesso')
        userID = response.body._id //Armazena o ID para outros testes
        cy.log(`${userID}`)
      } else if (response.status === 400) {
        cy.expect(response.body.message).to.be.equal('Este email já está sendo usado')

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
        cy.expect(response.body.message).to.be.equal('Cadastro realizado com sucesso')
        userID = response.body._id //Armazena o ID para outros testes
        cy.log(`${userID}`)
      } else if (response.status === 400) {
        cy.expect(response.body.message).to.be.equal('Este email já está sendo usado')
      }

    })
  });

  it('Buscar usuário por ID', () => {
    cy.buscarUsuarioPorId(userID).then((response) => {
      if (response.status === 200) {
        expect(response.body.nome).to.be.equal(userData.usuario.nome)
        expect(response.body.email).to.be.equal(userData.usuario.email)
        expect(response.body.password).to.be.equal(userData.usuario.password)
        expect(response.body.administrador).to.be.equal(userData.usuario.administrador)
      } else if (response.status === 400) {
        expect(response.body.message).to.be.equal('Usuário não encontrado')
      }
    })
  });

  it('Editar usuário', () => {
    cy.editarUsuario(userID, userData.novoUsuario).then((response) => {
      if (response.status === 200) {
        expect(response.body.message).to.be.equal('Registro alterado com sucesso')
      } else if (response.status === 201) {
        expect(response.body.message).to.be.equal('Cadastro realizado com sucesso')

      } else if (response.status === 400) {
        expect(response.body.message).to.be.equal('Este email já está sendo usado')
      }
    })
  });

  it('Excluir usuário', () => {
    cy.excluirUsuario(userID).then((response) => {
      if (response.status === 200) {
        expect(response.body.message).to.be.equal('Registro excluído com sucesso')
      } else if (response.status === 400) {
        expect(response.body.message).to.be.equal('Não é permitido excluir usuário com carrinho cadastrado')
      }
    })
  });
})