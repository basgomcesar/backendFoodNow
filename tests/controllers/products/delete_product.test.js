const request = require('supertest');
const app = require('../../../server'); // Asegúrate de que apunta al archivo principal del servidor

describe('Test para eliminar un producto', () => {
  let token = ''; // Token del usuario autenticado
  let idProducto = ''; // ID del producto a eliminar

  // Preparar datos antes de las pruebas
  beforeAll(async () => {
    // Autenticar al usuario
    const loginResponse = await request(app)
      .post('/auth/login') // Endpoint de autenticación
      .send({
        correo: 'vendedor@uv.mx',
        contrasenia: 'test123',
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.headers).toHaveProperty('x-token');

    token = loginResponse.headers['x-token'];

    // Crear un producto de prueba
    const createProductResponse = await request(app)
      .post('/products') // Endpoint para crear productos
      .set('x-token', token)
      .send({
        nombre: 'Producto de Prueba',
        descripcion: 'Descripción del producto',
        precio: 50,
        cantidadDisponible: 10,
        disponible: true,
        categoria: 'Prueba',
      });

    expect(createProductResponse.status).toBe(201);
    expect(createProductResponse.body).toHaveProperty('producto');
    idProducto = createProductResponse.body.producto.idProducto; // Guarda el ID del producto creado
  });

  it('Debe eliminar un producto correctamente', async () => {
    const response = await request(app)
      .delete(`/delete/${idProducto}`) // Endpoint de eliminación
      .set('x-token', token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mensaje', 'Producto eliminado correctamente');
  });

  it('Debe retornar un error 404 si el producto no pertenece al usuario autenticado', async () => {
    const response = await request(app)
      .delete(`/delete/9999`) // ID de producto inexistente o de otro usuario
      .set('x-token', token);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      'mensaje',
      'Producto no encontrado o no pertenece al usuario'
    );
  });

  it('Debe retornar un error 401 si no se envía un token', async () => {
    const response = await request(app)
      .delete(`/delete/${idProducto}`) // Sin token

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('mensaje', 'No autorizado');
  });

  // Limpieza
  afterAll(async () => {
    // Intenta eliminar el producto si no fue eliminado durante la prueba principal
    await request(app)
      .delete(`/delete/${idProducto}`)
      .set('x-token', token);
  });
});
