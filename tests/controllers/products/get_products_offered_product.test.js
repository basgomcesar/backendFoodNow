const request = require('supertest');
const app = require('../../../server');  

describe('GET /offered/:idSeller', () => {
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

  it('Debe devolver todos los productos ofrecidos por un vendedor', async () => {
    const sellerId = 1;  
    const response = await request(app)
      .get(`/products/offered/${sellerId}`)  
      .set('x-token', validTokenSuccess);  

    console.log('Respuesta de productos:', response.body);  

    expect(response.status).toBe(200);  
    expect(response.body).toHaveProperty('productos');  
    expect(Array.isArray(response.body.productos)).toBe(true); 

    response.body.productos.forEach(producto => {
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
    let validTokenNoProducts;
  
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
        throw new Error('Token no recibido');
      }
    } catch (error) {
      console.error('Error al autenticar al usuario sin productos:', error);
      throw error;
    }
  
    const sellerId = 4; 
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
