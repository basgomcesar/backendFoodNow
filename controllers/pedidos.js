const { response } = require("express");
const connection = require("../models/database");
const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../helpers/config');

/**
 * Recupera todos los pedidos del usuario autenticado con estado 'activo'
 * @param {*} req
 * @param {*} res
 */
const get_pedidos_activos_by_usuario = async (req, res = response) => {
  try {
    const token = req.header('x-token');

    if (!token) {
      return res.status(401).json({ error: "No se proporcionó el token" });
    }

    let uid;
    try {
      ({ uid } = jwt.verify(token, SECRET_KEY));
    } catch (error) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    const [pedidos] = await connection.execute(
      "SELECT * FROM pedidos WHERE idUsuario = ? AND estado = 'activo'",
      [uid]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron pedidos activos para este usuario" });
    }

    res.status(200).json({
      mensaje: "Pedidos activos obtenidos correctamente",
      pedidos,
    });
  } catch (error) {
    console.error("Error al obtener pedidos activos: ", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

/**
 * Recupera todos los productos asociados a un pedido específico
 * @param {*} req
 * @param {*} res
 */
const get_productos_by_pedido = async (req, res = response) => {
  try {
    const { idPedido } = req.params;

    const [productos] = await connection.execute(
      `SELECT p.* 
       FROM productos p
       INNER JOIN pedidos pd ON p.idProducto = pd.idProducto
       WHERE pd.idPedido = ?`,
      [idPedido]
    );

    if (productos.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron productos para este pedido" });
    }

    res.status(200).json({
      mensaje: "Productos del pedido obtenidos correctamente",
      productos,
    });
  } catch (error) {
    console.error("Error al obtener productos del pedido: ", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

module.exports = {
  get_pedidos_activos_by_usuario,
  get_productos_by_pedido,
};
