const { response } = require("express");
const connection = require("../models/database");
const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../helpers/config");

/**
 * Recupera todos los pedidos del usuario autenticado con estado 'activo'
 * @param {*} req
 * @param {*} res
 */
const get_pedidos_activos_by_usuario = async (req, res = response) => {
  try {
    const uid = req.uid; // El UID ya se ha extraído gracias al middleware validarJWT

    const [pedidos] = await connection.execute(
      "SELECT * FROM pedidos WHERE idUsuario = ? AND estado = 'activo'",
      [uid]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron pedidos activos para este usuario",
      });
    }

    res.status(200).json({
      mensaje: "Pedidos activos obtenidos correctamente",
      pedidos,
    });
  } catch (error) {
    console.error("Error al obtener pedidos activos: ", error);
    const status = error.status || 500;
    res.status(status).json({ mensaje: error.message || "Error interno del servidor" });
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

    if (!idPedido || isNaN(idPedido)) {
      return res.status(400).json({ mensaje: "ID del pedido inválido" });
    }

    const [productos] = await connection.execute(
      `SELECT p.* 
       FROM productos p
       INNER JOIN pedido_productos pp ON p.idProducto = pp.idProducto
       WHERE pp.idPedido = ?`,
      [idPedido]
    );

    if (productos.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron productos para este pedido",
      });
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
