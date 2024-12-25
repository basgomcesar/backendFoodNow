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
    const uid = req.uid; // El UID se extrae en el middleware validarJWT

    const [pedidos] = await connection.execute(
      `
      SELECT p.idPedido, p.fechaPedido, ep.estadoPedido, u.nombre AS nombreCliente
      FROM pedidos p
      INNER JOIN estadoPedido ep ON p.idEstadoPedido = ep.idEstadoPedido
      INNER JOIN usuarios u ON p.idCliente = u.idUsuario
      WHERE p.idVendedor = 1 AND ep.estadoPedido = 'Activo'
      `,
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

module.exports = {
  get_pedidos_activos_by_usuario,
};