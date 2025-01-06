/**
 * @swagger
 * /usuarios/{idUsuario}:
 *   get:
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
