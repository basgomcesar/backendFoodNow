const request = require('supertest');
const app = require('../../../server');

describe('Pruebas para la ruta PUT /availability/:idUsuario', () => {
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

  it('Debe actualizar la disponibilidad y la ubicación de un usuario', async () => {
    const idUsuario = 1; 
    const requestBody = {
      disponibilidad: 'true',
      ubicacion: 'Ciudad de México',
    };

    const response = await request(app)
      .put(`/availability/${idUsuario}`)
      .set('x-token', token)  
      .send(requestBody);

    expect(response.status).toBe(200); 
    expect(response.body).toHaveProperty('mensaje', 'Usuario actualizado correctamente');
    expect(response.body).toHaveProperty('disponibilidad', true);  
    expect(response.body).toHaveProperty('ubicacion', 'Ciudad de México'); 
  });

  it('Debe retornar un error si no se proporciona ningún campo para actualizar', async () => {
    const idUsuario = 1;  
    const requestBody = {};  

    const response = await request(app)
      .put(`/availability/${idUsuario}`)
      .set('x-token', token)  
      .send(requestBody);

    expect(response.status).toBe(400); 
    expect(response.body).toHaveProperty('error', 'Se debe proporcionar al menos un campo para actualizar');
  });

  it('Debe retornar un error si el usuario no existe', async () => {
    const idUsuario = 9999;
    const requestBody = {
      disponibilidad: 'true',
      ubicacion: 'Guadalajara',
    };

    const response = await request(app)
      .put(`/availability/${idUsuario}`)
      .set('x-token', token) 
      .send(requestBody);

    expect(response.status).toBe(404);  
    expect(response.body).toHaveProperty('mensaje', 'Usuario no encontrado');
  });

  it('Debe retornar un error si el token es inválido', async () => {
    const idUsuario = 1;
    const requestBody = {
      disponibilidad: 'true',
      ubicacion: 'Monterrey',
    };

    const response = await request(app)
      .put(`/availability/${idUsuario}`)
      .set('x-token', 'token-invalido')
      .send(requestBody); 

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('mensaje', 'Token inválido o expirado');
  });

  it('Debe retornar un error si no se proporciona el token', async () => {
    const idUsuario = 1;
    const requestBody = {
      disponibilidad: 'true',
      ubicacion: 'Querétaro',
    };

    const response = await request(app)
      .put(`/availability/${idUsuario}`)
      .send(requestBody);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('mensaje', 'No se proporcionó el token');
  });
});