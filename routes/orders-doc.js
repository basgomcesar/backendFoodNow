/**
 * @swagger
 * /orders/pending/seller:
 *   get:
 *     summary: Obtener órdenes pendientes por vendedor
 *     description: Obtiene las órdenes pendientes para un vendedor.
 *     parameters:
 *       - name: x-token
 *         in: header
 *         required: true
 *         description: Token de autorización para acceder a esta ruta.
 *         schema:
 *           type: string
 *           example: "your_token_here"
 *     responses:
 *       200:
 *         description: Órdenes pendientes obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   orderId:
 *                     type: integer
 *                     example: 123
 *                   sellerId:
 *                     type: integer
 *                     example: 1
 *                   status:
 *                     type: string
 *                     example: "pending"
 *       400:
 *         description: Token inválido o faltante.
 *       401:
 *         description: No autorizado, token requerido.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /orders/pending/customer:
 *   get:
 *     summary: Obtener órdenes pendientes por cliente
 *     description: Obtiene las órdenes pendientes para un cliente.
 *     parameters:
 *       - name: x-token
 *         in: header
 *         required: true
 *         description: Token de autorización para acceder a esta ruta.
 *         schema:
 *           type: string
 *           example: "your_token_here"
 *     responses:
 *       200:
 *         description: Órdenes pendientes obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   orderId:
 *                     type: integer
 *                     example: 456
 *                   customerId:
 *                     type: integer
 *                     example: 2
 *                   status:
 *                     type: string
 *                     example: "pending"
 *       400:
 *         description: Token inválido o faltante.
 *       401:
 *         description: No autorizado, token requerido.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /orders/cancelorder/{idPedido}:
 *   put:
 *     summary: Cancelar una orden
 *     description: Cancela una orden específica utilizando su ID.
 *     parameters:
 *       - name: idPedido
 *         in: path
 *         required: true
 *         description: ID de la orden a cancelar.
 *         schema:
 *           type: integer
 *           example: 123
 *       - name: x-token
 *         in: header
 *         required: true
 *         description: Token de autorización para cancelar la orden.
 *         schema:
 *           type: string
 *           example: "your_token_here"
 *     responses:
 *       200:
 *         description: Orden cancelada correctamente.
 *       400:
 *         description: Token inválido o faltante.
 *       404:
 *         description: Orden no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /orders/confirmOrder/{idPedido}:
 *   put:
 *     summary: Confirmar una orden
 *     description: Confirma una orden específica utilizando su ID.
 *     parameters:
 *       - name: idPedido
 *         in: path
 *         required: true
 *         description: ID de la orden a confirmar.
 *         schema:
 *           type: integer
 *           example: 123
 *       - name: x-token
 *         in: header
 *         required: true
 *         description: Token de autorización para confirmar la orden.
 *         schema:
 *           type: string
 *           example: "your_token_here"
 *     responses:
 *       200:
 *         description: Orden confirmada correctamente.
 *       400:
 *         description: Token inválido o faltante.
 *       404:
 *         description: Orden no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
