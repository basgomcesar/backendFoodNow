/**
 * @swagger
 * tags:
 *   - name: Autenticación
 *     description: Endpoints para autenticación de usuarios
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión con correo y contraseña
 *     description: Permite a los usuarios iniciar sesión proporcionando su correo y contraseña.
 *     operationId: login
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *                 example: usuario@ejemplo.com
 *               contrasenia:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario.
 *                 example: mySecretPassword123
 *     responses:
 *       200:
 *         description: Usuario autenticado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idTipoUsuario:
 *                   type: integer
 *                   description: ID del tipo de usuario.
 *                   example: 1
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
 *                 contrasenia:
 *                   type: string
 *                   description: Contraseña del usuario.
 *                   example: mySecretPassword123
 *                 foto:
 *                   type: string
 *                   description: Foto de perfil del usuario en formato base64.
 *                   example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQ..."
 *                 disponibilidad:
 *                   type: integer
 *                   description: Estado de disponibilidad del usuario.
 *                   example: 1
 *                 ubicacion:
 *                   type: string
 *                   description: Ubicación del usuario.
 *                   example: En frente de la tienda
 *         headers:
 *           x-token:
 *             description: Token JWT generado para la sesión del usuario.
 *             schema:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Petición incorrecta, faltan parámetros obligatorios.
 *       401:
 *         description: Credenciales inválidas (correo o contraseña incorrectos).
 *       500:
 *         description: Error interno del servidor.
 */
