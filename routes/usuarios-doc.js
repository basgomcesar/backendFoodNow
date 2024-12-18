
/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene la lista de usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */


/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Verifica las credenciales del usuario en la base de datos y retorna un token JWT si son válidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *                 example: usuario@ejemplo.com
 *               contrasenia:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Retorna el usuario autenticado y el token JWT en el encabezado.
 *         headers:
 *           x-token:
 *             schema:
 *               type: string
 *             description: Token JWT generado para la autenticación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idUsuario:
 *                   type: integer
 *                   description: ID del usuario.
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   description: Nombre del usuario.
 *                   example: Juan Pérez
 *                 correo:
 *                   type: string
 *                   description: Correo electrónico del usuario.
 *                   example: usuario@ejemplo.com
 *       401:
 *         description: Credenciales inválidas. El correo o la contraseña no son correctos.
 *       500:
 *         description: Error interno en el servidor.
 */
