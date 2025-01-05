const { response } = require("express");
const connection = require("../models/database");
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../helpers/config');

const get_orders = async (req, res = response) => {
  try {
    //TODO
  } catch (error) {
    console.error("Error al obtener órdenes: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const get_order_by_id = async (req, res = response) => {
  try {
    //TODO
  } catch (error) {
    console.error("Error al obtener orden por ID: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
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

const update_order = async (req, res = response) => {
  try {
    res.json({
      message: "Actualizar orden",
    });
  } catch (error) {
    console.error("Error al actualizar orden: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const delete_order = async (req, res = response) => {
  try {
    res.json({
      message: "Eliminar orden",
    });
  } catch (error) {
    console.error("Error al eliminar orden: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  get_orders,
  get_order_by_id,
  add_order,
  update_order,
  delete_order,
};
