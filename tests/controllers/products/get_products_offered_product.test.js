describe('Pruebas para la ruta /offered/:idSeller', () => {
    let token = ''; 
  
    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/auth/login') 
        .send({
          correo: 'test@uv.mx',
          contrasenia: 'test123',
        });
  
      token = loginResponse.headers['x-token'];
      expect(token).not.toBeUndefined();
    });
  
    it('Debe retornar los productos ofrecidos por un vendedor', async () => {
      const idSeller = 1; 
  
      const response = await request(app)
        .get(`/offered/${idSeller}`)
        .set('x-token', token);  
  
      expect(response.status).toBe(200); 
      expect(response.body).toHaveProperty('productos');
    });
  
    it('Debe retornar un error si el token es inválido', async () => {
      const response = await request(app)
        .get(`/offered/1`)
        .set('x-token', 'token-invalido'); 
  
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('mensaje', 'Token inválido o expirado');
    });
  
    it('Debe retornar un error si no se proporciona el token', async () => {
      const response = await request(app)
        .get(`/offered/1`);
  
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('mensaje', 'No se proporcionó el token');
    });
  });  