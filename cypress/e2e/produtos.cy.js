import dataUser from '../fixtures/userData.json'
import productData from '../fixtures/productData.json'

describe('Produtos', () => {
    it('Listar Produtos', () => {
        cy.request({
            method: 'GET',
            url: '/produtos'
        }).then((response) => {
            expect(response.status).to.be.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.body.produtos).to.be.an('array')

            const produtos = response.body.produtos

            //Mostra a quantidade total
            cy.log(`Quantidade total de produtos: ${produtos.length}`)

            // Mostra todos os usuários em formato de tabela no console
            console.table(produtos)

        })
    });

    it('Cadastrar produto', () => {
        cy.request({
            method: 'POST',
            url: '/produtos',
            body: productData.product1,
            failOnStatusCode: false

        }).then((response) => {
            if (response.status === 201) {
                expect(response.body.message).to.be.equal('Cadastro realizado com sucesso')
            } else if (response.status === 400) {
                expect(response.body.message).to.be.equal('Já existe produto com esse nome')
            } else if (response.status === 401) {
                expect(response.body.message).to.be.equal('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
            } else if (response.status === 403) {
                expect(response.body.message).to.be.equal('Rota exclusiva para administradores')
            }
        })
    });
})