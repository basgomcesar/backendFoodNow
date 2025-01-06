const request = require('supertest');
const app = require('../../../server'); // Asegúrate de que apunta al archivo principal del servidor

describe('Test para actualizar un producto', () => {
  let token = ''; // Token del usuario autenticado
  let idProducto = ''; // ID del producto a actualizar

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
        descripcion: 'Descripción inicial',
        precio: 50,
        cantidadDisponible: 10,
        disponible: true,
        categoria: 'Prueba',
      });

    expect(createProductResponse.status).toBe(201);
    expect(createProductResponse.body).toHaveProperty('producto');
    idProducto = createProductResponse.body.producto.idProducto; // Guarda el ID del producto creado
  });

  it('Debe actualizar un producto correctamente', async () => {
    const response = await request(app)
      .put(`/update/${idProducto}`) // Endpoint de actualización
      .set('x-token', token)
      .send({
        descripcion: 'Descripción actualizada',
        precio: 60,
        cantidadDisponible: 20,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mensaje', 'Producto actualizado correctamente');
    expect(response.body.producto).toMatchObject({
      idProducto: idProducto.toString(), // Asegúrate de que el ID esté en el formato correcto
      descripcion: 'Descripción actualizada',
      precio: 60,
      cantidadDisponible: 20,
    });
  });

  it('Debe retornar un error 404 si el producto no pertenece al usuario autenticado', async () => {
    const response = await request(app)
      .put(`/update/9999`) // ID de producto inexistente o de otro usuario
      .set('x-token', token)
      .send({
        descripcion: 'Intento de actualización',
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      'mensaje',
      'Producto no encontrado o no pertenece al usuario'
    );
  });

  it('Debe retornar un error 400 si no se proporcionan campos para actualizar', async () => {
    const response = await request(app)
      .put(`/update/${idProducto}`) // Endpoint de actualización
      .set('x-token', token)
      .send({}); // Sin campos

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'mensaje',
      'No se ha proporcionado ningún campo para actualizar'
    );
  });

  it('Debe retornar un error 400 si el precio es negativo', async () => {
    const response = await request(app)
      .put(`/update/${idProducto}`)
      .set('x-token', token)
      .send({
        precio: -10,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'mensaje',
      'El precio no puede ser menor a 0'
    );
  });

  it('Debe retornar un error 400 si la cantidad disponible es negativa', async () => {
    const response = await request(app)
      .put(`/update/${idProducto}`)
      .set('x-token', token)
      .send({
        cantidadDisponible: -5,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'mensaje',
      'La cantidad disponible no puede ser menor a 0'
    );
  });

  it('Debe retornar un error 401 si no se envía un token', async () => {
    const response = await request(app)
      .put(`/update/${idProducto}`) // Sin token
      .send({
        descripcion: 'Intento sin token',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('mensaje', 'No autorizado');
  });

  // Limpia los datos después de las pruebas
  afterAll(async () => {
    await request(app)
      .delete(`/products/${idProducto}`) // Endpoint para eliminar productos
      .set('x-token', token);
  });
});
