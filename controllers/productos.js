const { response } = require("express");
const connection = require("../models/database");
const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../helpers/config');
/**
 * Obtiene todos los productos asociados al usuario autenticado
 * @param {*} req
 * @param {*} res
 */
const get_productos_by_usuario = async (req, res = response) => {
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
      return res.status(401).json({ error: `Token inválido o expirado ${error}` });
    }

    const [productos] = await connection.execute(
      "SELECT * FROM productos WHERE idUsuario = ?",
      [uid]
    );

    if (productos.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron productos para este usuario",
      });
    }

    res.status(200).json({
      mensaje: "Productos obtenidos correctamente",
      productos,
    });
  } catch (error) {
    console.error("Error al obtener productos del usuario: ", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

/**
 * Actualiza un producto si pertenece al usuario autenticado
 * @param {*} req
 * @param {*} res
 */
const update_producto = async (req, res = response) => {
  try {
    const idUsuario = req.uid; // Obtener el ID del usuario desde el token
    const { idProducto } = req.params;
    const { descripcion, precio, cantidadDisponible } = req.body;

    // Validar que el producto pertenece al usuario autenticado
    const [producto] = await connection.execute(
      "SELECT * FROM productos WHERE idProducto = ? AND idUsuario = ?",
      [idProducto, idUsuario]
    );

    if (producto.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado o no pertenece al usuario" });
    }

    const updates = [];
    const values = [];

    if (descripcion) {
      updates.push("descripcion = ?");
      values.push(descripcion);
    }
    if (precio) {
      updates.push("precio = ?");
      values.push(precio);
    }
    if (cantidadDisponible) {
      updates.push("cantidadDisponible = ?");
      values.push(cantidadDisponible);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        mensaje: "No se ha proporcionado ningún campo para actualizar",
      });
    }

    values.push(idProducto);

    const [resultado] = await connection.execute(
      `UPDATE productos SET ${updates.join(", ")} WHERE idProducto = ?`,
      values
    );

    res.status(200).json({
      mensaje: "Producto actualizado correctamente",
      producto: { idProducto, ...req.body },
    });
  } catch (error) {
    console.error("Error al actualizar producto: ", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

/**
 * Elimina un producto si pertenece al usuario autenticado
 * @param {*} req
 * @param {*} res
 */
const delete_producto = async (req, res = response) => {
  try {
    const idUsuario = req.uid; // Obtener el ID del usuario desde el token
    const { idProducto } = req.params;

    const [producto] = await connection.execute(
      "SELECT * FROM productos WHERE idProducto = ? AND idUsuario = ?",
      [idProducto, idUsuario]
    );

    if (producto.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado o no pertenece al usuario" });
    }

    await connection.execute("DELETE FROM productos WHERE idProducto = ?", [idProducto]);

    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto: ", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

module.exports = {
  get_productos_by_usuario,
  update_producto,
  delete_producto,
};
