const request = require('supertest');
const app = require('../../../server'); 
const path = require('path');

//delete_user test
describe('Test para actualizar un usuario', () => {
  let token = '';  

  it('Debe generar un token con las credenciales correctas', async () => {
    const loginResponse = await request(app)
      .post('/auth/login') 
      .send({
        correo: 'test2@uv.mx',
        contrasenia: 'test1234',
      });

    expect(loginResponse.status).toBe(200);    
    expect(loginResponse.headers).toHaveProperty('x-token');
    
    token = loginResponse.headers['x-token'];
    console.log("Token recibido:", token);
  });

  it('Debe actualizar un usuario con éxito', async () => {
    const deleteUserResponse = await request(app)
      .delete('/users') 
      .set('x-token', token);  


    expect(deleteUserResponse.status).toBe(200);
    expect(deleteUserResponse.body).toHaveProperty('mensaje', 'Usuario eliminado exitosamente');
});
});

