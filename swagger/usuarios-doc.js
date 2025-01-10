/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Operaciones relacionadas con usuarios
 */



/**
 * @swagger
 * /usuarios/{idUsuario}:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener usuario por ID
 *     description: Obtiene la información de un usuario específico utilizando su ID.
 *     parameters:
 *       - name: idUsuario
 *         in: path
 *         required: true
 *         description: ID del usuario a obtener.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idUsuario:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: Juan Pérez
 *                 correo:
 *                   type: string
 *                   example: usuario@ejemplo.com
 *                 disponibilidad:
 *                   type: boolean
 *                   example: true
 *                 ubicacion:
 *                   type: string
 *                   example: CDMX
 *       400:
 *         description: Faltan parámetros obligatorios.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /usuarios/{idUsuario}/disponibilidad:
 *   put:
 *     tags:
 *       - Usuarios
 *     summary: Cambiar disponibilidad de un usuario
 *     description: Actualiza el estado de disponibilidad de un usuario utilizando su ID.
 *     parameters:
 *       - name: idUsuario
 *         in: path
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disponibilidad:
 *                 type: boolean
 *                 description: Nuevo valor de disponibilidad.
 *                 example: true
 *     responses:
 *       200:
 *         description: Disponibilidad actualizada correctamente.
 *       400:
 *         description: Parámetros inválidos o faltantes.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /usuarios/{idUsuario}:
 *   put:
 *     tags:
 *       - Usuarios
 *     summary: Actualizar disponibilidad y ubicación de un usuario
 *     description: Permite actualizar múltiples campos (disponibilidad y/o ubicación) de un usuario.
 *     parameters:
 *       - name: idUsuario
 *         in: path
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disponibilidad:
 *                 type: boolean
 *                 description: Nuevo valor de disponibilidad.
 *                 example: true
 *               ubicacion:
 *                 type: string
 *                 description: Nueva ubicación del usuario.
 *                 example: CDMX
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idUsuario:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: Juan Pérez
 *                 correo:
 *                   type: string
 *                   example: usuario@ejemplo.com
 *                 disponibilidad:
 *                   type: boolean
 *                   example: true
 *                 ubicacion:
 *                   type: string
 *                   example: CDMX
 *                 mensaje:
 *                   type: string
 *                   example: Usuario actualizado correctamente.
 *       400:
 *         description: No se proporcionaron campos para actualizar.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */



/**
 * @swagger
 * /users/save:
 *   post:
 *     tags:
 *       - Usuarios
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
 *     tags:
 *       - Usuarios
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
 *     tags:
 *       - Usuarios
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
