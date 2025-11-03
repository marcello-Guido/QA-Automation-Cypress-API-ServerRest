import userData from '../fixtures/userData.json'
let userID;

describe('Gerencie os usuários, consulte dados para login e cadastre administrador', () => {
    it('Cadastrar usuário', () => {
        cy.cadastrarUsers(userData.loginUser).then((response) => {
            if (response.status === 201) {
                cy.expect(response.body.message).to.be.equal('Cadastro realizado com sucesso')
                userID = response.body._id //Armazena o ID para outros testes
                cy.log(`${userID}`)
            } else if (response.status === 400) {
                cy.expect(response.body.message).to.be.equal('Este email já está sendo usado')
            }
        })
    });

    it('Realizar login', () => {
        cy.login(userData.loginUser.email, userData.loginUser.password).then((response) =>{
            if(response.status === 200){
                expect(response.body.message).to.be.equal('Login realizado com sucesso')
            } else if(response.status === 401){
                expect(response.body.message).to.be.equal('Email e/ou senha inválidos')
            }
        })
    });

    

})