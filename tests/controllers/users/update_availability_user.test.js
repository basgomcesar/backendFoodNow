const request = require('supertest');
const app = require('../../../server');
const path = require('path');

describe('PUT /users/availability/:idUsuario', () => {  
  let validTokenSuccess; 

  beforeAll(async () => {
    try {
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          correo: 'dms19-@hotmail.com', 
          contrasenia: '123456',
        });

      expect(loginResponse.status).toBe(200); 
      expect(loginResponse.headers).toHaveProperty('x-token');  

      validTokenSuccess = loginResponse.headers['x-token']; 
      console.log('Token generado por autenticación:', validTokenSuccess);  
      if (!validTokenSuccess) {
        throw new Error('Token no recibido');
      }
    } catch (error) {
      console.error('Error al autenticar al cliente:', error);
      throw error; 
    }
  });

  // Test 1: Actualizar la disponibilidad y ubicación de un usuario
  it('Debe actualizar la disponibilidad y ubicación de un usuario', async () => {
    const userId = '1';  // ID del usuario
    const availability = 1;  // Disponibilidad ahora es 1, como en Postman
    const location = 'Nueva ubicación';  // Nueva ubicación

    const response = await request(app)
      .put(`/users/availability/${userId}`)  // Ruta actualizada
      .set('x-token', validTokenSuccess)  // Usamos el token obtenido
      .send({ disponibilidad: availability, ubicacion: location });

    console.log('Respuesta de actualización de disponibilidad:', response.body);  // Imprime la respuesta para depuración

    expect(response.status).toBe(200);  // Esperamos un código de estado 200 (OK)
    expect(response.body).toHaveProperty('mensaje', 'Usuario actualizado correctamente');
  });

  // Test 2: Error 401 si no se proporciona un token
  it('Debe devolver un error 401 si no se proporciona un token', async () => {
    const userId = '1';
    const availability = 1;
    const location = 'Nueva ubicación';

    const response = await request(app)
      .put(`/users/availability/${userId}`)  // Ruta actualizada
      .send({ disponibilidad: availability, ubicacion: location });

    console.log('Respuesta de error 401:', response.body);  // Imprime la respuesta para depuración

    expect(response.status).toBe(401);  // Esperamos un error 401
    expect(response.body).toHaveProperty('mensaje', 'No se proporcionó el token');
  });

  // Test 3: Error 400 si los datos no son válidos
  it('Debe devolver un error 400 si los datos no son válidos', async () => {
    const availability = 'no';  // Disponibilidad no válida (esto debe ser un valor 1 o 0)
    const location = '';  // Ubicación no proporcionada
  
    const response = await request(app)
      .put(`/users/availability/123`)  // Ruta actualizada
      .set('x-token', validTokenSuccess)  // Usamos el token válido
      .send({ disponibilidad: availability, ubicacion: location });
  
    console.log('Respuesta de error 400:', response.body);  // Depuración
  
    expect(response.status).toBe(400);  // Código de estado esperado
    expect(response.body).toHaveProperty('mensaje', 'El valor de disponibilidad no es válido');  // Validar mensaje correcto
  });  
});