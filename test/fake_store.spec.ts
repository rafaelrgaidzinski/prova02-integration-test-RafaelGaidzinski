import spec from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Fake Store - Produtos', () => {
  const pactum = spec;
  const reporter = SimpleReporter;
  const baseUrl = 'https://api.escuelajs.co/api/v1';

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
        .stores('productId', 'id')
        .toss();

      console.log('Produto criado:', response.json);
      console.log('ID do produto:', response.json.id);
    });

    it('Consulta o produto criado', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/products/$S{productId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          title: 'Notebook Gamer'
        });

      console.log('Consulta produto criado:', response.json);
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

      console.log('Consulta produto atualizado:', response.json);
    });

    it('Lista produtos com paginação', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/products`)
        .withQueryParams({ offset: 0, limit: 10 })
        .expectStatus(StatusCodes.OK)
        .expectJsonLength(10);

      console.log(response.json);
    });

    it('Deleta um produto', async () => {
      await pactum
        .spec()
        .delete(`${baseUrl}/products/$S{productId}`)
        .expectStatus(StatusCodes.OK)
        .toss();

      console.log(`Produto deletado com sucesso`);
    });
  });

  describe('Filtros de Produtos', () => {
    it('Filtra produtos por título', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/products`)
        .withQueryParams({ title: 'cap' })
        .expectStatus(StatusCodes.OK);

      console.log('Produto filtrado por title:', response.json);
    });

    it('Filtra produtos por faixa de preço', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/products`)
        .withQueryParams({ price_min: 100, price_max: 500 })
        .expectStatus(StatusCodes.OK);

      console.log('Produto filtrado por preço:', response.json);
    });

    it('Filtra produtos por categoria', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/products`)
        .withQueryParams({ categoryId: 1 })
        .expectStatus(StatusCodes.OK);

      console.log('Produto filtrado por categoria:', response.json);
    });
  });
});

describe('Fake Store - Categorias', () => {
  const pactum = spec;
  const reporter = SimpleReporter;
  const baseUrl = 'https://api.escuelajs.co/api/v1';

  pactum.request.setDefaultTimeout(30000);

  beforeAll(() => pactum.reporter.add(reporter));
  afterAll(() => pactum.reporter.end());

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
        .stores('categoryId', 'id')
        .toss();

      console.log('Categoria criada:', response.json);
      console.log('ID da categoria:', response.json.id);
    });

    it('Consulta a categoria criada', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/categories/$S{categoryId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: 'Livros'
        });

      console.log('Categoria consultada:', response.json);
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

      console.log('Categoria consultada:', response.json);
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

      console.log(response.json);
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

      console.log('Produtos da categoria:', response.json);
    });

    it('Deleta uma categoria', async () => {
      await pactum
        .spec()
        .delete(`${baseUrl}/categories/$S{categoryId}`)
        .expectStatus(StatusCodes.OK)
        .toss();

      console.log(`Categoria deletada com sucesso`);
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

    console.log('Categoria buscada por ID:', response.json);
  });
});

describe('Fake Store - Usuários', () => {
  const pactum = spec;
  const reporter = SimpleReporter;
  const baseUrl = 'https://api.escuelajs.co/api/v1';
  const uniqueEmail = `test${Date.now()}@email.com`;
  console.log('Email único para teste:', uniqueEmail);

  pactum.request.setDefaultTimeout(30000);

  beforeAll(() => pactum.reporter.add(reporter));
  afterAll(() => pactum.reporter.end());

  describe('CRUD de Usuários', () => {
    it('Verifica se email está disponível', async () => {
      await pactum
        .spec()
        .post(`${baseUrl}/users/is-available`)
        .withJson({
          email: uniqueEmail
        })
        .expectStatus(StatusCodes.CREATED);
    });

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
        .stores('userId', 'id')
        .toss();

      console.log('Usuário criado:', response.json);
      console.log('ID do usuário:', response.json.id);
    });

    it('Busca o usuário cadastrado por ID', async () => {
      const response = await pactum
        .spec()
        .get(`${baseUrl}/users/$S{userId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          email: uniqueEmail
        });

      console.log('Consulta usuário criado:', response.json);
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

      console.log('Consulta usuário atualizado:', response.json);
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
        .expectStatus(StatusCodes.OK)
        .toss();

      console.log('Usuário deletado com sucesso');
    });
  });
});
