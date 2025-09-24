import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Fake Store', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.escuelajs.co/api/v1';
  let userId = '';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('users', () => {
    it('new user', async () => {
      userId = await p
        .spec()
        .post(`${baseUrl}/users`)
        .withJson({
          email: 'rafael@email.com',
          name: 'Rafael',
          password: '1234',
          role: 'admin',
          avatar: 'https://www.photo.com.br/user'
        })
        .expectStatus(StatusCodes.CREATED)
        .returns('id');
      console.log(userId);
    });
  });
});
