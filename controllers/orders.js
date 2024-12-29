const { response } = require("express");
const connection = require("../models/database");
const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../helpers/config");

/**
 * Recupera todos los pedidos del usuario autenticado con estado 'activo'
 * @param {*} req
 * @param {*} res
 */
const get_pending_orders_by_seller = async (req, res = response) => {
  try {
    const uid = req.uid; // El UID se extrae en el middleware validarJWT

    const [pedidos] = await connection.execute(
      `
      SELECT p.idPedido, p.fechaPedido, ep.estadoPedido, u.nombre AS nombreCliente
      FROM pedidos p
      INNER JOIN estadoPedido ep ON p.idEstadoPedido = ep.idEstadoPedido
      INNER JOIN usuarios u ON p.idCliente = u.idUsuario
      WHERE p.idVendedor = ? AND ep.estadoPedido = 'Activo'
      `,
      [uid]
    );

    if (pedidos.length === 0) {
      return res.status(200).json({
        mensaje: "No se encontraron pedidos activos para este usuario",
        pedidos: [],
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
 * Recupera todos los pedidos del cliente autenticado con estado 'Activo'
 * @param {*} req
 * @param {*} res
 */
const get_pending_orders_by_customer = async (req, res = response) => {
  try {
    const uid = req.uid; // El UID se extrae en el middleware validarJWT

    const [pedidos] = await connection.execute(
      `
      SELECT p.idPedido, p.fechaPedido, ep.estadoPedido, u.nombre AS nombreVendedor
      FROM pedidos p
      INNER JOIN estadoPedido ep ON p.idEstadoPedido = ep.idEstadoPedido
      INNER JOIN usuarios u ON p.idVendedor = u.idUsuario
      WHERE p.idCliente = ? AND ep.estadoPedido = 'Activo'
      `,
      [uid]
    );

    if (pedidos.length === 0) {
      return res.status(200).json({
        mensaje: "No se encontraron pedidos activos para este cliente",
        pedidos: [],
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
 * Modifica el estado de un pedido específico a 'Cancelado'
 * @param {*} req
 * @param {*} res
 */
const cancel_order = async (req, res = response) => {
  try {
    const { idPedido } = req.params; // ID del pedido a cancelar
    const uid = req.uid; // ID del usuario autenticado (opcional, depende de la lógica)

    // Verifica que el pedido pertenece al usuario autenticado
    const [pedidoExistente] = await connection.execute(
      `
      SELECT p.idPedido 
      FROM pedidos p
      INNER JOIN usuarios u ON p.idCliente = u.idUsuario
      WHERE p.idPedido = ? AND p.idCliente = ?
      `,
      [idPedido, uid]
    );

    if (pedidoExistente.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontró el pedido o no pertenece al usuario autenticado",
      });
    }

    // Actualiza el estado del pedido a 'Cancelado'
    const [resultado] = await connection.execute(
      `
      UPDATE pedidos 
      SET idEstadoPedido = (SELECT idEstadoPedido FROM estadoPedido WHERE estadoPedido = 'Cancelado')
      WHERE idPedido = ?
      `,
      [idPedido]
    );

    if (resultado.affectedRows === 0) {
      return res.status(400).json({
        mensaje: "No se pudo cancelar el pedido",
      });
    }

    res.status(200).json({
      mensaje: "El pedido se canceló correctamente",
    });
  } catch (error) {
    console.error("Error al cancelar el pedido: ", error);
    const status = error.status || 500;
    res.status(status).json({ mensaje: error.message || "Error interno del servidor" });
  }
};


module.exports = {
  get_pending_orders_by_seller,
  get_pending_orders_by_customer,
  cancel_order,
};