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
        cy.listarUsers().then((res) => {
          const user = res.body.usuarios.find(u => u.email === userData.usuario.email)
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
      expect(response.status).to.equal(200)
      expect(response.body.email).to.eql(userData.usuario.email)
    })
  })

  it('Editar usuário', () => {
    cy.editarUsuario(userID, userData.novoUsuario).then((response) => {
      expect(response.status).to.be.oneOf([200, 201, 400])
      if (response.status === 200) expect(response.body.message).to.eql('Registro alterado com sucesso')
    })
  })

  it('Excluir usuário', () => {
    cy.excluirUsuario(userID).then((response) => {
      if (response.status === 200) {
        expect(response.body.message).to.eql('Registro excluído com sucesso')
      } else if (response.status === 400) {
        expect(response.body.message).to.eql('Não é permitido excluir usuário com carrinho cadastrado')
      }
    })
  })
})
