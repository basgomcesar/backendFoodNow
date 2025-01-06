const request = require('supertest');
const app = require('../../../server'); // Asegúrate de que apunte al archivo de inicialización de tu servidor

describe('Test para obtener pedidos activos por vendedor', () => {
  let token = ''; // Guardará el token del usuario autenticado
  const uidVendedor = '123'; // UID de un vendedor válido en la base de datos

  // Autenticar usuario antes de realizar las pruebas
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/auth/login') // Endpoint de autenticación
      .send({
        correo: 'test@uv.mx',
        contrasenia: 'test123',
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.headers).toHaveProperty('x-token');

    token = loginResponse.headers['x-token'];
  });

  it('Debe retornar una lista de pedidos activos para el vendedor autenticado', async () => {
    const response = await request(app)
    .get('/pending/seller') // Endpoint que llama al método `get_pending_orders_by_seller`
      .set('x-token', token) // Adjunta el token en el encabezado
      .query({ idVendedor: uidVendedor }); // Enviar parámetros si es necesario

    expect(response.status).toBe(200); // Verificar que la respuesta tenga un código 200
    expect(response.body).toHaveProperty('mensaje', 'Pedidos activos obtenidos correctamente');
    expect(response.body).toHaveProperty('pedidos');
    expect(Array.isArray(response.body.pedidos)).toBe(true); // Verifica que sea un array

    if (response.body.pedidos.length > 0) {
      // Verifica la estructura de un pedido en caso de que haya datos
      const pedido = response.body.pedidos[0];
      expect(pedido).toHaveProperty('idPedido');
      expect(pedido).toHaveProperty('fechaPedido');
      expect(pedido).toHaveProperty('cantidad');
      expect(pedido).toHaveProperty('estadoPedido', 'Activo');
      expect(pedido).toHaveProperty('nombreCliente');
    } else {
      console.log('No se encontraron pedidos activos para el vendedor.');
    }
  });

  it('Debe retornar un mensaje cuando no hay pedidos activos para el vendedor', async () => {
    const response = await request(app)
      .get('/orders/active')
      .set('x-token', token)
      .query({ idVendedor: '999' }); // Usa un UID inexistente o sin pedidos

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mensaje', 'No se encontraron pedidos activos para este usuario');
    expect(response.body.pedidos).toEqual([]);
  });

  it('Debe retornar un error 401 si no se envía un token', async () => {
    const response = await request(app)
      .get('/orders/active')
      .query({ idVendedor: uidVendedor }); // Sin token

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('mensaje', 'No autorizado');
  });
});
