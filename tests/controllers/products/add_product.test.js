const request = require('supertest');
const app = require('../../../server'); 
const path = require('path');

//add_product test
describe('Test para crear un producto', () => {
  let token = '';  

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

  // Test para crear un producto
  it('Debe crear un producto con éxito', async () => {
    const productoData = {
      nombre: 'Burrito de carne',
      descripcion: 'Descripción del producto',
      precio: '10.50',
      cantidadDisponible: 100,
      disponible: 'true',
      categoria: 'Comida'
    };

    // Usamos el token que obtenemos en el primer test
    const addProductResponse = await request(app)
      .post('/products') 
      .set('x-token', token)  // Enviamos el token en el encabezado
      .field('nombre', productoData.nombre)
      .field('descripcion', productoData.descripcion)
      .field('precio', productoData.precio)
      .field('cantidadDisponible', productoData.cantidadDisponible)
      .field('disponible', productoData.disponible)
      .field('categoria', productoData.categoria)
      .attach('foto', path.join(__dirname, '../../fixtures/burritoDeCarne.jpg'));  


    expect(addProductResponse.status).toBe(201);
    expect(addProductResponse.body).toHaveProperty('success', true);
    expect(addProductResponse.body).toHaveProperty('message', 'Producto creado con éxito');
  });
});

