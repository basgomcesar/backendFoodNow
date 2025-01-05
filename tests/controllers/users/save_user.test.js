const request = require('supertest');
const app = require('../../../server'); 
const path = require('path');

//save_users test
describe('Test para crear un usuario', () => {
    it('Debe crear un usuario con éxito', async () => {
        const userData = {
            nombre: 'Test',
            correo: 'test@uv.mx',
            contrasenia: 'test123',
            tipo: 'Vendedor',
            disponibilidad: 'true'
        };

    const saverUserResponse = await request(app)
      .post('/users') 
      .field('nombre', userData.nombre)
      .field('correo', userData.correo)
      .field('contrasenia', userData.contrasenia)
      .field('tipo', userData.tipo)
      .field('disponibilidad', userData.disponibilidad)
      .attach('foto', path.join(__dirname, '../../fixtures/user.png'));  


    expect(saverUserResponse.status).toBe(201);
    expect(saverUserResponse.body).toHaveProperty('success', true);
    expect(saverUserResponse.body).toHaveProperty('message', 'Usuario creado con éxito');
    });
});


