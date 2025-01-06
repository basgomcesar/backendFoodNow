const request = require('supertest');
const app = require('../../../server'); // Asegúrate de que apunta al archivo principal del servidor

describe('Test para cancelar un pedido', () => {
  let token = ''; // Guardará el token del cliente autenticado
  const uidCliente = '456'; // UID del cliente que tiene el pedido
  let idPedido = ''; // ID del pedido a cancelar

  // Autenticar cliente antes de realizar las pruebas
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/auth/login') // Endpoint de autenticación
      .send({
        correo: 'cliente@uv.mx',
        contrasenia: 'test123',
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.headers).toHaveProperty('x-token');

    token = loginResponse.headers['x-token'];

    // Crear un pedido de prueba para cancelar
    const createOrderResponse = await request(app)
      .post('/orders') // Endpoint de creación de pedidos (ajusta según tu API)
      .set('x-token', token)
      .send({
        idProducto: 1, // Asegúrate de que este producto existe
        cantidad: 1,
      });

    expect(createOrderResponse.status).toBe(201);
    expect(createOrderResponse.body).toHaveProperty('order');
    idPedido = createOrderResponse.body.order.idPedido; // Guarda el ID del pedido creado
  });

  it('Debe cancelar un pedido correctamente', async () => {
    const response = await request(app)
      .put(`/cancelorder/${idPedido}`) // Endpoint de cancelación
      .set('x-token', token); // Adjunta el token en el encabezado

    expect(response.status).toBe(200); // Verifica que la respuesta tenga un código 200
    expect(response.body).toHaveProperty('mensaje', 'El pedido se canceló correctamente');
  });

  it('Debe retornar un error 404 si el pedido no pertenece al cliente autenticado', async () => {
    const response = await request(app)
      .put(`/cancelorder/9999`) // ID de pedido inexistente o de otro cliente
      .set('x-token', token);

    expect(response.status).toBe(404); // Verifica que la respuesta sea un error 404
    expect(response.body).toHaveProperty(
      'mensaje',
      'No se encontró el pedido o no pertenece al usuario autenticado'
    );
  });

  it('Debe retornar un error 401 si no se envía un token', async () => {
    const response = await request(app)
      .put(`/cancelorder/${idPedido}`); // Sin token

    expect(response.status).toBe(401); // Verifica que sea un error de autenticación
    expect(response.body).toHaveProperty('mensaje', 'No autorizado');
  });

  it('Debe retornar un error 400 si el pedido no se puede cancelar', async () => {
    // Supongamos que el pedido ya fue entregado y no puede cancelarse
    const deliveredOrderResponse = await request(app)
      .put(`/cancelorder/${idPedido}`) // Intenta cancelar un pedido ya entregado
      .set('x-token', token);

    expect(deliveredOrderResponse.status).toBe(400);
    expect(deliveredOrderResponse.body).toHaveProperty('mensaje', 'No se pudo cancelar el pedido');
  });
});
