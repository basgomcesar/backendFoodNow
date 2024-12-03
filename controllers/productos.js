const { response } = require("express");
const connection = require("../models/database");

/**
 * Obtiene todos los productos asociados a un usuario
 * @param {*} req
 * @param {*} res
 */
const get_productos_by_usuario = async (req, res = response) => {
    try {
      const { idUsuario } = req.params;
  
      const [productos] = await connection.execute(
        "SELECT * FROM productos WHERE idUsuario = ?",
        [idUsuario]
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
 * Actualiza un producto en la base de datos
 * @param {*} req
 * @param {*} res
 */
const update_producto = async (req, res = response) => {
  try {
    const { idProducto } = req.params;
    const { descripcion, precio, cantidadDisponible } = req.body;

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

    // Validar si se proporcionó al menos un campo para actualizar
    if (updates.length === 0) {
      return res.status(400).json({
        mensaje: "No se ha proporcionado ningún campo para actualizar",
      });
    }

    values.push(idProducto); // Añadimos el idProducto para la cláusula WHERE

    const [resultado] = await connection.execute(
      `UPDATE productos SET ${updates.join(", ")} WHERE idProducto = ?`,
      values
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Consultamos el producto actualizado para enviar como respuesta
    const [productoActualizado] = await connection.execute(
      "SELECT * FROM productos WHERE idProducto = ?",
      [idProducto]
    );

    res.status(200).json({
      mensaje: "Producto actualizado correctamente",
      producto: productoActualizado[0],
    });
  } catch (error) {
    console.error("Error al actualizar producto: ", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

/**
 * Elimina un producto de la base de datos
 * @param {*} req
 * @param {*} res
 */
const delete_producto = async (req, res = response) => {
  try {
    const { idProducto } = req.params;

    const [resultado] = await connection.execute(
      "DELETE FROM productos WHERE idProducto = ?",
      [idProducto]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto: ", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

module.exports = {
    update_producto,
    delete_producto,
    get_productos_by_usuario,
  };
  
