const { response } = require("express");
const connection = require("../models/database");

/**
 * Obtiene todos los productos asociados al usuario autenticado
 * @param {*} req
 * @param {*} res
 */
const get_productos_by_usuario = async (req, res = response) => {
  try {
    const idUsuario = req.uid; // ID del usuario autenticado extraído del token

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
 * Actualiza un producto si pertenece al usuario autenticado
 * @param {*} req
 * @param {*} res
 */
const update_producto = async (req, res = response) => {
  try {
    const idUsuario = req.uid; // ID del usuario autenticado extraído del token
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

    await connection.execute(
      `UPDATE productos SET ${updates.join(", ")} WHERE idProducto = ? AND idUsuario = ?`,
      [...values, idUsuario]
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
    const idUsuario = req.uid; // ID del usuario autenticado extraído del token
    const { idProducto } = req.params;

    // Validar que el producto pertenece al usuario autenticado
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


/**
 * Registra un usuario en base de datos
 * @param {*} req
 * @param {*} res
 */
const add_product = async (req, res = response) => {
  try {
    const { nombre, descripcion, precio, cantidadDisponible, disponible, categoria } = req.body;

    // Convertir disponible a un entero (1 o 0)
    const disponibleInt = disponible === 'true' ? 1 : 0;

    // Validar que se haya subido un archivo de foto
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Se requiere una foto del producto",
      });
    }
    const foto = req.file.buffer;

    // Validar el campo precio
    const precioRegex = /^\d+(\.\d{1,2})?$/; // Número con hasta 2 decimales
    if (!precioRegex.test(precio)) {
      return res.status(422).json({
        success: false,
        errorCode: "INVALID_PRICE_FORMAT",
        message: "El precio debe ser un número válido con hasta dos decimales",
      });
    }

    // Verificar si el producto ya está registrado para este usuario
    const [existingProduct] = await connection.execute(
      "SELECT * FROM productos WHERE nombre = ? AND idUsuario = ?",
      [nombre, req.uid]
    );

    if (existingProduct.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Ya tienes un producto con este nombre registrado",
      });
    }

    console.log('Categoria: ' + categoria);
    // Guardar el nuevo producto
    const [resultado] = await connection.execute(
      "INSERT INTO productos (nombre, descripcion, precio, cantidadDisponible, disponible, foto, categoria, idUsuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nombre, descripcion, precio, cantidadDisponible, disponibleInt, foto, categoria, req.uid]
    );

    if (resultado.affectedRows > 0) {
      return res.status(201).json({
        success: true,
        message: "Producto creado con éxito",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "No se pudo crear el producto",
      });
    }
  } catch (error) {
    console.error("Error al guardar producto: ", error.message || error);
    res.status(500).json({
      success: false,
      message: "Error al guardar el producto, faltan datos o son incorrectos",
    });
  }
};





module.exports = {
  get_productos_by_usuario,
  update_producto,
  delete_producto,
  add_product,
};
