describe('Teste de API - Serverest', () => {

  let userID;

  it.only('Deve listar todos os usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'https://serverest.dev/usuarios'
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
      expect(response.body.usuarios).to.be.an('array')
    })
  });

  it('Deve cadastrar usuário', () => {
    const usuario = {
      "nome": "Silva",
      "email": "silva@qa.com.br",
      "password": "silva",
      "administrador": "true"
    }

    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/usuarios',
      body: usuario
    }).then((response) => {
      expect(response.status).to.equal(201)
    })
  });

  it('Deve cadastrar usuário ou avisar se já existe', () => {

    const usuario = {
      "nome": "Silva3",
      "email": "silva3@qa.com.br",
      "password": "silva",
      "administrador": "true"
    }

    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/usuarios',
      body: usuario,
      failOnStatusCode: false
    }).then((response) => {

      if (response.status === 201) {
        cy.log('Usuário criado com sucesso!')
        cy.expect(response.body.message).to.be.equal('Cadastro realizado com sucesso')
      } else if (response.status === 400) {
        cy.log('Usuário já cadastrado!')
        cy.expect(response.body.message).to.be.equal('Este email já está sendo usado')
      } else {
        cy.log('🚨 Status inesperado:', response.status)
        throw new Error(`Status inesperado: ${response.status}`)
      }

    })
    it('should delete the user successfully and confirm their removal from the system', () => {
      cy.request('DELETE', `/usuarios/${userId}`).then(({ status }) => {
        expect(status).to.eq(200)

        cy.request({
          method: 'GET',
          url: `/usuarios/${userId}`,
          failOnStatusCode: false
        }).then(({ status }) => {
          expect(status).to.eq(400)
        })
      })
    })

  });

})