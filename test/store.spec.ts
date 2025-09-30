import spec from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Fake Store - Produtos', () => {
  const pactum = spec;
  const reporter = SimpleReporter;
  const baseUrl = 'https://api.escuelajs.co/api/v1';
  const uniqueEmail = `test${Date.now()}@email.com`;

  pactum.request.setDefaultTimeout(30000);

  beforeAll(() => pactum.reporter.add(reporter));
  afterAll(() => pactum.reporter.end());

  describe('CRUD de Produtos', () => {
    it('Cria um novo produto', async () => {
      const response = await pactum
        .spec()
        .post(`${baseUrl}/products`)
        .withJson({
          title: 'Notebook Gamer',
          price: 2500,
          description: 'Notebook de alto desempenho para gamers',
          categoryId: 1,
          images: ['https://example.com/notebook.jpg']
        })
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          title: 'Notebook Gamer',
          price: 2500
        })
        .stores('productId', 'id');
    });

    it('Consulta o produto criado', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/products/$S{productId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          title: 'Notebook Gamer'
        });
    });

    it('Atualiza um produto existente', async () => {
      await pactum
        .spec()
        .put(`${baseUrl}/products/$S{productId}`)
        .withJson({
          title: 'Notebook Gamer Pro',
          price: 3000,
          description: 'Notebook de alto desempenho para gamers',
          categoryId: 1,
          images: ['https://example.com/notebook.jpg']
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          title: 'Notebook Gamer Pro',
          price: 3000
        });
    });

    it('Consulta o produto atualizado', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/products/$S{productId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          title: 'Notebook Gamer Pro'
        });
    });

    it('Lista produtos com paginação', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/products`)
        .withQueryParams({ offset: 0, limit: 10 })
        .expectStatus(StatusCodes.OK)
        .expectJsonLength(10);
    });

    it('Deleta um produto', async () => {
      await pactum
        .spec()
        .delete(`${baseUrl}/products/$S{productId}`)
        .expectStatus(StatusCodes.OK);
    });

    it('Filtra produtos por categoria', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/products`)
        .withQueryParams({ categoryId: 1 })
        .expectStatus(StatusCodes.OK);
    });
  });

  describe('CRUD de Categorias', () => {
    it('Cria uma nova categoria', async () => {
      const response = await pactum
        .spec()
        .post(`${baseUrl}/categories`)
        .withJson({
          name: 'Livros',
          image: 'https://example.com/books.jpg'
        })
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          name: 'Livros'
        })
        .stores('categoryId', 'id');
    });

    it('Consulta a categoria criada', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/categories/$S{categoryId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: 'Livros'
        });
    });

    it('Atualiza uma categoria', async () => {
      await pactum
        .spec()
        .put(`${baseUrl}/categories/$S{categoryId}`)
        .withJson({
          name: 'Livros e Revistas',
          image: 'https://example.com/books.jpg'
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: 'Livros e Revistas'
        });
    });

    it('Consulta a categoria atualizada', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/categories/$S{categoryId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: 'Livros e Revistas'
        });
    });

    it('Busca uma categoria específica por ID', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/categories/1`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: 1,
          name: 'Clothes'
        });
    });

    it('Lista todas as categorias', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/categories`)
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              image: { type: 'string' }
            }
          }
        });
    });

    it('Lista produtos de uma categoria', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/categories/1/products`)
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              title: { type: 'string' },
              category: {
                type: 'object',
                properties: {
                  id: { type: 'number' }
                }
              }
            }
          }
        });
    });

    it('Deleta uma categoria', async () => {
      await pactum
        .spec()
        .delete(`${baseUrl}/categories/$S{categoryId}`)
        .expectStatus(StatusCodes.OK);
    });
  });

  describe('CRUD de Usuários', () => {
    it('Cadastra um novo usuário', async () => {
      const response = await pactum
        .spec()
        .post(`${baseUrl}/users`)
        .withJson({
          email: uniqueEmail,
          name: 'João Silva',
          password: 'senha123',
          role: 'admin',
          avatar: 'https://example.com/avatar.jpg'
        })
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          email: uniqueEmail,
          name: 'João Silva'
        })
        .stores('userId', 'id');
    });

    it('Busca o usuário cadastrado por ID', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/users/$S{userId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          email: uniqueEmail
        });
    });

    it('Atualiza dados do usuário', async () => {
      await pactum
        .spec()
        .put(`${baseUrl}/users/$S{userId}`)
        .withJson({
          email: uniqueEmail,
          name: 'João Pedro Silva',
          password: 'senha123',
          role: 'admin',
          avatar: 'https://example.com/avatar.jpg'
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: 'João Pedro Silva'
        });
    });

    it('Consulta o usuário atualizado', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/users/$S{userId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: 'João Pedro Silva'
        });
    });

    it('Lista todos os usuários', async () => {
      await pactum
        .spec()
        .get(`${baseUrl}/users`)
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              email: { type: 'string' },
              name: { type: 'string' },
              role: { type: 'string' }
            }
          }
        });
    });

    it('Deleta um usuário', async () => {
      await pactum
        .spec()
        .delete(`${baseUrl}/users/$S{userId}`)
        .expectStatus(StatusCodes.OK);
    });
  });
});
