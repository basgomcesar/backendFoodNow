
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



/**
 * @swagger
 * /users/save:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Crea un nuevo usuario con los datos proporcionados en el cuerpo de la petición. Es obligatorio enviar una foto del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del usuario.
 *                 example: Juan Pérez
 *               correo:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *                 example: usuario@ejemplo.com
 *               contrasenia:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: password123
 *               tipo:
 *                 type: string
 *                 description: Tipo de usuario (Vendedor o Cliente).
 *                 example: Vendedor
 *               disponibilidad:
 *                 type: string
 *                 description: Disponibilidad del usuario (true o false).
 *                 example: true
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Foto del usuario en formato binario.
 *     responses:
 *       201:
 *         description: Usuario creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Usuario creado con éxito
 *       400:
 *         description: Error en los datos enviados o foto faltante.
 *       409:
 *         description: El correo ya está registrado.
 *       500:
 *         description: Error interno del servidor al guardar el usuario.
 */

/**
 * @swagger
 * /usuarios:
 *   put:
 *     summary: Actualizar un usuario
 *     description: Actualiza los detalles de un usuario existente. Los campos opcionales se pueden omitir, pero si se envía una foto, debe ser en formato binario. El ID del usuario se obtiene a partir del token JWT.
 *     security:
 *       - bearerAuth: []  # Asumiendo que usas autenticación Bearer Token
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del usuario.
 *                 example: Juan Pérez
 *               correo:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *                 example: usuario@ejemplo.com
 *               contrasenia:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: password123
 *               disponibilidad:
 *                 type: string
 *                 description: Disponibilidad del usuario (true o false).
 *                 example: true
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Foto del usuario en formato binario (opcional).
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       400:
 *         description: Error en los datos enviados.
 *       401:
 *         description: No hay token en la petición o el token no es válido.
 *       404:
 *         description: Usuario no encontrado (si no existe un usuario con el ID del token).
 *       409:
 *         description: El correo ya está registrado por otro usuario.
 *       500:
 *         description: Error interno del servidor al actualizar el usuario.
 */


/**
 * @swagger
 * /usuarios:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario existente. El ID del usuario se obtiene a partir del token JWT enviado en el encabezado de la solicitud.
 *     security:
 *       - bearerAuth: []  # Asumiendo que usas autenticación Bearer Token
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *       401:
 *         description: No hay token en la petición o el token no es válido.
 *       400:
 *         description: ID de usuario inválido en el token.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor al eliminar el usuario.
 */
