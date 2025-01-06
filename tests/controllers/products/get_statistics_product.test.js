const request = require('supertest');
const app = require('../../../server'); 

describe('Pruebas para la ruta /statistics/:idSeller/:year/:month', () => {
  let token = '';  

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/auth/login') 
      .send({
        correo: 'test@uv.mx',
        contrasenia: 'test123',
      });

    token = loginResponse.headers['x-token'];
    expect(token).not.toBeUndefined();
  });

  it('Debe retornar las estadísticas de productos vendidos para un vendedor en un mes y año específico', async () => {
    const idSeller = 1;  
    const year = 2024;  
    const month = 5;  

    const response = await request(app)
      .get(`/statistics/${idSeller}/${year}/${month}`)
      .set('x-token', token); 

    expect(response.status).toBe(200); 
    expect(response.body).toHaveProperty('productos'); 
  });

  it('Debe retornar un error si faltan parámetros', async () => {
    const response = await request(app)
      .get(`/statistics/1/2024`)
      .set('x-token', token); 

    expect(response.status).toBe(400); 
    expect(response.body).toHaveProperty('mensaje', 'Faltan parámetros requeridos: idSeller, year, month');
  });

  it('Debe retornar un error si el token es inválido', async () => {
    const response = await request(app)
      .get(`/statistics/1/2024/5`)
      .set('x-token', 'token-invalido'); 

    expect(response.status).toBe(401); 
    expect(response.body).toHaveProperty('mensaje', 'Token inválido o expirado');
  });
});