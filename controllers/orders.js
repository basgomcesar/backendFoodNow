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
      SELECT p.idPedido, p.fechaPedido, p.cantidad, ep.estadoPedido, u.nombre AS nombreCliente
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
      SELECT p.idPedido, p.fechaPedido, p.cantidad, ep.estadoPedido, u.nombre AS nombreVendedor
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
    const { idPedido } = req.params;
    const uid = req.uid;

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

const add_order = async (req, res = response) => {
  try {
    const token = req.header('x-token');
 
    if (!token) {
      return res.status(401).json({ error: "No se proporcionó el token" });
    }
    let uid;
    try {
      // Verificar y extraer el uid del token
      console.log(SECRET_KEY);
      ({ uid } = jwt.verify(token, SECRET_KEY));
    } catch (error) {
      return res
        .status(401)
        .json({ error: `Token inválido o expirado ${error}` });
    }
    const { idProducto, cantidad } = req.body;
    if ( !idProducto || !cantidad) {
      return res.status(400).json({ message: "Datos faltantes" });
    }
    // Agregar al pedido(orden)
    const [result] = await connection.execute(
        "SELECT idVendedor FROM productos WHERE idProducto = ?",
        [idProducto]
    );
    const [insertResult] = await connection.execute(
      "INSERT INTO pedidos (fechaPedido, cantidad, idCliente, idProducto, idEstadoPedido, idVendedor) VALUES (NOW(), ?, ?, ?, 1, ?)",
      [cantidad, uid, idProducto, result[0].idVendedor]
    );

    const orderId = insertResult.insertId;

    //disminuir la cantidad de productos
    await connection.execute(
      "UPDATE productos SET cantidadDisponible = cantidadDisponible - ? WHERE idProducto = ?",
      [cantidad, idProducto]
    );
    

   // Consultar los detalles del pedido recién creado
   const [orderDetails] = await connection.execute(
    `
    SELECT 
      p.cantidad AS cantidad,
      p.fechaPedido AS fechaPedido,
      p.idCliente AS idCliente,
      c.nombre AS nombreCliente,
      c.ubicacion AS ubicacionCliente,
      v.nombre AS nombreVendedor,
      v.ubicacion AS ubicacionVendedor,
      p.idProducto AS idProducto,
      ep.estadoPedido AS estadoPedido
    FROM pedidos p
    INNER JOIN usuarios c ON p.idCliente = c.idUsuario
    INNER JOIN usuarios v ON p.idVendedor = v.idUsuario
    INNER JOIN estadoPedido ep ON p.idEstadoPedido = ep.idEstadoPedido
    WHERE p.idPedido = ?
    `,
    [orderId]
  );

      if (orderDetails.length === 0) {
        return res.status(404).json({ message: "No se encontró la orden creada" });
      }
    

    res.status(201).json({ message: "Orden creada", order: orderDetails[0] });
  } catch (error) {
    console.error("Error al agregar orden: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


module.exports = {
  add_order,
  get_pending_orders_by_seller,
  get_pending_orders_by_customer,
  cancel_order,
};