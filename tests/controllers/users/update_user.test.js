const request = require('supertest');
const app = require('../../../server'); 
const path = require('path');

//add_product test
describe('Test para actualizar un usuario', () => {
  let token = '';  // Variable para guardar el token

  it('Debe generar un token con las credenciales correctas', async () => {
    const loginResponse = await request(app)
      .post('/auth/login') 
      .send({
        correo: 'test@uv.mx',
        contrasenia: 'test123',
      });

    expect(loginResponse.status).toBe(200);    
    expect(loginResponse.headers).toHaveProperty('x-token');
    
    token = loginResponse.headers['x-token'];
    console.log("Token recibido:", token);
  });

  it('Debe actualizar un usuario con éxito', async () => {
    const userData = {
        nombre: 'Test2',
        correo: 'test2@uv.mx',
        contrasenia: 'test1234'
    };


    const updateUserResponse = await request(app)
      .put('/users') 
      .set('x-token', token) 
      .field('nombre', userData.nombre)
      .field('correo', userData.correo)
      .field('contrasenia', userData.contrasenia)
      .attach('foto', path.join(__dirname, '../../fixtures/user.png'));  


    expect(updateUserResponse.status).toBe(200);
    expect(updateUserResponse.body).toHaveProperty('success', true);
    expect(updateUserResponse.body).toHaveProperty('message', 'Usuario actualizado correctamente');
    });
});

