import userData from '../fixtures/userData.json'

describe('Gerencie os usuários, consulte dados para login e cadastre administrador', () => {
  let userID;

  before(() => {
    // Cria um usuário antes de rodar os testes
    cy.cadastrarUsers(userData.usuario).then((response) => {
      if (response.status === 201) {
        userID = response.body._id
        Cypress.env('userID', userID) // opcional
        cy.log(`Usuário criado com ID: ${userID}`)
      } else {
        // Caso já exista, busca o ID do existente
        cy.listarUsers().then((response) => {
          const user = response.body.usuarios.find(u => u.email === userData.usuario.email)
          if (user) {
            userID = user._id
            Cypress.env('userID', userID)
            cy.log(`Usuário já existente, ID reutilizado: ${userID}`)
          }
        })
      }
    })
  });

  it('Listar usuários cadastrados', () => {
    cy.listarUsers().then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body.usuarios).to.be.an('array')
      cy.log(`Total de usuários: ${response.body.usuarios.length}`)
    })
  })

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

      expect(response.status).to.equal(200)
      expect(response.body.email).to.eql(userData.usuario.email)
    })
  })

  it('Editar usuário', () => {
    cy.editarUsuario(userID, userData.novoUsuario).then((response) => {
      if (response.status === 200) {
        expect(response.body.message).to.be.equal('Registro alterado com sucesso')
      } else if (response.status === 201) {
        expect(response.body.message).to.be.equal('Cadastro realizado com sucesso')

      } else if (response.status === 400) {
        expect(response.body.message).to.be.equal('Este email já está sendo usado')
      }

      expect(response.status).to.be.oneOf([200, 201, 400])
      if (response.status === 200) expect(response.body.message).to.eql('Registro alterado com sucesso')
    })
  })

  it('Excluir usuário', () => {
    cy.excluirUsuario(userID).then((response) => {
      if (response.status === 200) {
        expect(response.body.message).to.be.equal('Registro excluído com sucesso')
      } else if (response.status === 400) {
        expect(response.body.message).to.be.equal('Não é permitido excluir usuário com carrinho cadastrado')
        expect(response.body.message).to.eql('Registro excluído com sucesso')
      } else if (response.status === 400) {
        expect(response.body.message).to.eql('Não é permitido excluir usuário com carrinho cadastrado')
      }
    })
  })
})