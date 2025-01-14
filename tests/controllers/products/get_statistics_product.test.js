const request = require('supertest');
const app = require('../../../server');
const { generarJWT } = require('../../../helpers/generar-jwt');
let validToken;

async function obtenerTokenValido() {
  const token = await generarJWT(1);
  return token;
}

beforeAll(async () => {
  validToken = await obtenerTokenValido();
});

describe('GET /statistics/:year/:month', () => {
  it('Debe devolver estadísticas de productos vendidos', async () => {
    const year = 2025;
    const month = 1;

    const response = await request(app)
      .get(`/products/statistics/${year}/${month}`)
      .set('x-token', validToken);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('productos');
    expect(Array.isArray(response.body.productos)).toBe(true);
  });

  it('Debe devolver un error 401 si no se proporciona un token', async () => {
    const year = 2023;
    const month = 5;

    const response = await request(app)
      .get(`/products/statistics/${year}/${month}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('mensaje', 'No hay token en la petición');
  });

  it('Debe devolver un error 400 si el año o mes no son válidos', async () => {
    const invalidYear = 'invalid';
    const invalidMonth = 'invalid';

    const response = await request(app)
      .get(`/products/statistics/${invalidYear}/${invalidMonth}`)
      .set('x-token', validToken);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('mensaje', 'El año y mes deben ser valores numéricos válidos y el mes debe estar entre 1 y 12.');
  });

  it('Debe devolver un error 404 si no se encuentran productos vendidos en el mes y año especificados', async () => {
    const year = 2023;
    const month = 5;

    const response = await request(app)
      .get(`/products/statistics/${year}/${month}`)
      .set('x-token', validToken);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('mensaje', 'No se encontraron productos vendidos para este vendedor en el mes y año especificados.');
  });
});
