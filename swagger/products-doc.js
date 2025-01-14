/**
 * @swagger
 * tags:
 *   - name: Productos
 *     description: Operaciones relacionadas con productos
 */

/**
 * @swagger
 * /products/statistics/{year}/{month}:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener estadísticas de productos vendidos
 *     description: Recupera las estadísticas de los productos vendidos por año y mes.
 *     parameters:
 *       - name: year
 *         in: path
 *         required: true
 *         description: Año de la estadística.
 *         schema:
 *           type: integer
 *           example: 2023
 *       - name: month
 *         in: path
 *         required: true
 *         description: Mes de la estadística.
 *         schema:
 *           type: integer
 *           example: 5
 *       - name: x-token
 *         in: header
 *         required: true
 *         description: Token de autorización.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente.
 *       400:
 *         description: Parámetros inválidos.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: No se encontraron datos.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /products/offered/{idSeller}:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener productos ofrecidos por un vendedor
 *     description: Lista todos los productos ofrecidos por un vendedor específico.
 *     parameters:
 *       - name: idSeller
 *         in: path
 *         required: true
 *         description: ID del vendedor.
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: x-token
 *         in: header
 *         required: true
 *         description: Token de autorización.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Productos obtenidos correctamente.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Productos
 *     summary: Crear un nuevo producto
 *     description: Permite agregar un nuevo producto proporcionando los datos necesarios.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Smartphone"
 *               descripcion:
 *                 type: string
 *                 example: "Teléfono inteligente de última generación"
 *               precio:
 *                 type: number
 *                 example: 499.99
 *               cantidadDisponible:
 *                 type: integer
 *                 example: 50
 *               disponible:
 *                 type: boolean
 *                 example: true
 *               categoria:
 *                 type: string
 *                 example: "Electrónica"
 *               foto:
 *                 type: string
 *                 format: binary
 *     parameters:
 *       - name: x-token
 *         in: header
 *         required: true
 *         description: Token de autorización.
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Producto creado exitosamente.
 *       400:
 *         description: Datos inválidos o faltantes.
 *       401:
 *         description: No autorizado.
 *       409:
 *         description: Producto duplicado.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /products/orderproducts/{idPedido}:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener productos de un pedido
 *     description: Obtiene los productos asociados a un pedido específico.
 *     parameters:
 *       - name: idPedido
 *         in: path
 *         required: true
 *         description: ID del pedido.
 *         schema:
 *           type: integer
 *           example: 123
 *       - name: x-token
 *         in: header
 *         required: true
 *         description: Token de autorización.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Productos obtenidos correctamente.
 *       400:
 *         description: ID de pedido inválido.
 *       404:
 *         description: No se encontraron productos.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /products/update/{idProducto}:
 *   put:
 *     tags:
 *       - Productos
 *     summary: Actualizar un producto
 *     description: Permite actualizar la información de un producto existente.
 *     parameters:
 *       - name: idProducto
 *         in: path
 *         required: true
 *         description: ID del producto a actualizar.
 *         schema:
 *           type: integer
 *           example: 101
 *       - name: x-token
 *         in: header
 *         required: true
 *         description: Token de autorización.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               cantidadDisponible:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /products/delete/{idProducto}:
 *   delete:
 *     tags:
 *       - Productos
 *     summary: Eliminar un producto
 *     description: Elimina un producto específico.
 *     parameters:
 *       - name: idProducto
 *         in: path
 *         required: true
 *         description: ID del producto a eliminar.
 *         schema:
 *           type: integer
 *           example: 101
 *       - name: x-token
 *         in: header
 *         required: true
 *         description: Token de autorización.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente.
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
