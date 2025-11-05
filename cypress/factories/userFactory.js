import { faker } from '@faker-js/faker'

export function gerarProduto() {
  return {
    nome: faker.commerce.productName(),
    preco: Number(faker.commerce.price({ min: 100, max: 200, dec: 0 })), // converte para número
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 10, max: 1000 })
  }
}
