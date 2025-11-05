import userData from '../fixtures/userData.json'
import productData from '../fixtures/productData.json'
import { gerarProduto } from '../factories/userFactory'


describe('Produtos', () => {
    let userID, tokenID, productID
    const novoProduto = gerarProduto()

    before(() => {
        cy.cadastrarUsers(userData.loginUser).then((response) => {
            if (response.status === 201) {
                expect(response.body.message).to.equal('Cadastro realizado com sucesso')
                userID = response.body._id
                cy.log(`🆔 Usuário criado: ${userID}`)
            } else if (response.status === 400) {
                expect(response.body.message).to.equal('Este email já está sendo usado')
            }

            cy.login(userData.loginUser.email, userData.loginUser.password).then((response) => {
                if (response.status === 200) {
                    expect(response.body.message).to.equal('Login realizado com sucesso')
                    const rawToken = response.body.authorization
                    tokenID = rawToken.replace('Bearer ', '')
                    cy.log(`🔑 Token capturado: ${tokenID}`)

                    // 3️⃣ Cadastrar produto DEPOIS de ter o token
                    cy.request({
                        method: 'POST',
                        url: '/produtos',
                        headers: {
                            Authorization: `Bearer ${tokenID}`
                        },
                        body: novoProduto,
                        failOnStatusCode: false
                    }).then((response) => {
                        if (response.status === 201) {
                            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
                            productID = response.body._id
                            cy.log(`📦 Produto criado com ID: ${productID}`)
                        } else {
                            cy.log(`⚠️ Falha ao cadastrar produto: ${response.body.message}`)
                        }
                    })
                }
            })
        })
    })

    it('Listar Produtos', () => {
        cy.request('GET', '/produtos').then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            cy.log(`🛒 Total de produtos: ${response.body.produtos.length}`)
        })
    })

    it('Buscar Produto por ID', () => {
        cy.request({
            method: 'GET',
            url: `/produtos/${productID}`,
            failOnStatusCode: false
        }).then((response) => {
            if (response.status === 200) {
                cy.log(`✅ Produto encontrado: ${response.body.nome}`)
            } else {
                cy.log(`❌ Falha ao buscar produto: ${response.status}`)
            }
        })
    })

    it('Editar Produto por ID', () => {
        cy.request({
            method: 'PUT',
            url: `/produtos/${productID}`,
            headers: {
                Authorization: `Bearer ${tokenID}`
            },
            body: novoProduto,
            failOnStatusCode: false
        }).then((response) => {
            if (response.status === 200) {
                expect(response.body.message).to.be.equal("Registro alterado com sucesso")
            } else if (response.status === 201) {
                expect(response.body.message).to.be.equal("Cadastro realizado com sucesso")
            } else if (response.status === 400) {
                expect(response.body.message).to.be.equal("Já existe produto com esse nome")
            } else if (response.status === 401) {
                expect(response.body.message).to.be.equal("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais")
            } else if (response.status === 403) {
                expect(response.body.message).to.be.equal("Rota exclusiva para administradores")
            }

        })

    })

    it('Deletar Produto por ID', () => {
        cy.request({
            method: 'DELETE',
            url: `/produtos/${productID}`,
            failOnStatusCode: false
        }).then((response) => {
            if (response.status === 200) {
                cy.log(`✅ Produto encontrado: ${response.body.nome}`)
            } else {
                cy.log(`❌ Falha ao buscar produto: ${response.status}`)
            }
        })
    })




})
