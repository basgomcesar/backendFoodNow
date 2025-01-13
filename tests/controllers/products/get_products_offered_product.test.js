const request = require('supertest');
const app = require('../../../server');

describe('GET /offered/:idSeller', () => {
  let validTokenSuccess;
  let validTokenNoProducts;

  beforeAll(async () => {
    // Generar token para un usuario con productos
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

      if (!validTokenSuccess) {
        throw new Error('Token no recibido para usuario con productos');
      }
    } catch (error) {
      console.error('Error al autenticar al usuario con productos:', error);
      throw error;
    }

    // Generar token para un usuario sin productos
    try {
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          correo: 'juan@example.com',
          contrasenia: 'password123',
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.headers).toHaveProperty('x-token');
      validTokenNoProducts = loginResponse.headers['x-token'];

      if (!validTokenNoProducts) {
        throw new Error('Token no recibido para usuario sin productos');
      }
    } catch (error) {
      console.error('Error al autenticar al usuario sin productos:', error);
      throw error;
    }
  });

  it('Debe devolver todos los productos ofrecidos por un vendedor', async () => {
    const sellerId = 1; // ID de un vendedor con productos
    const response = await request(app)
      .get(`/products/offered/${sellerId}`)
      .set('x-token', validTokenSuccess);

    console.log('Respuesta de productos:', response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('productos');
    expect(Array.isArray(response.body.productos)).toBe(true);

    response.body.productos.forEach((producto) => {
      expect(producto).toHaveProperty('idProducto');
      expect(producto).toHaveProperty('nombreProducto');
      expect(producto).toHaveProperty('descripcion');
      expect(producto).toHaveProperty('precio');
      expect(producto).toHaveProperty('cantidadDisponible');
      expect(producto).toHaveProperty('disponible');
      expect(producto).toHaveProperty('categoria');
      expect(producto).toHaveProperty('nombreVendedor');
      expect(producto).toHaveProperty('correoVendedor');
      expect(producto).toHaveProperty('ubicacionVendedor');
      expect(producto).toHaveProperty('fotoVendedor');
    });
  });

  it('Debe devolver un error 404 si no se encuentran productos ofrecidos', async () => {
    const sellerId = 4; // ID de un vendedor sin productos
    const response = await request(app)
      .get(`/products/offered/${sellerId}`)
      .set('x-token', validTokenNoProducts);

    console.log('Respuesta de error:', response.body);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('mensaje', 'No se encontraron productos registrados');
    expect(response.body).toHaveProperty('productos');
    expect(Array.isArray(response.body.productos)).toBe(true);
    expect(response.body.productos.length).toBe(0);
  });
});