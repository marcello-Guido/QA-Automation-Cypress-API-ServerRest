import userData from '../fixtures/userData.json'


describe('Gerencie os usuários, consulte dados para login e cadastre administrador', () => {
    let userID;

    before(() => {
        cy.request({
            method: 'GET',
            url: '/usuarios',
        }).then((res) => {
            const existente = res.body.usuarios.find(u => u.email === userData.loginUser.email);
            if (existente) {
                cy.request({
                    method: 'DELETE',
                    url: `/usuarios/${existente._id}`,
                });
            }
        });

        cy.cadastrarUsers(userData.loginUser).then((response) => {
            expect([201, 400]).to.include(response.status);
            if (response.status === 201) {
                expect(response.body.message).to.eq('Cadastro realizado com sucesso');
                userID = response.body._id;
            } else if (response.status === 400) {
                expect(response.body.message).to.eq('Este email já está sendo usado');
            }
        });
    });

    it('Realizar login', () => {
        cy.login(userData.loginUser.email, userData.loginUser.password).then((response) => {
            if (response.status === 200) {
                expect(response.body.message).to.be.equal('Login realizado com sucesso')
            } else if (response.status === 401) {
                expect(response.body.message).to.be.equal('Email e/ou senha inválidos')
            }
        })
    });

})