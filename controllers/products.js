const multer = require("multer");
const { response } = require("express");
const connection = require("../models/database");
const { SECRET_KEY } = require('../helpers/config');
const jwt = require('jsonwebtoken');

const get_statistics_products = async (req, res = response) => {
  try {
    const token = req.header('x-token');
    console.log(`Token recibido: ${token}`);

    if (!token) {
      console.log("Token no proporcionado.");
      return res.status(401).json({ mensaje: "No se proporcionó el token" });
    }

    let uid;
    try {
      ({ uid } = jwt.verify(token, SECRET_KEY));
      console.log(`Token verificado. UID extraído: ${uid}`);
    } catch (error) {
      console.error("Error al verificar el token:", error.message);
      return res.status(401).json({ mensaje: `Token inválido o expirado: ${error.message}` });
    }

    const { year, month } = req.params;
    console.log(`Parámetros recibidos - idSeller: ${uid}, year: ${year}, month: ${month}`);

    if (!uid || !year || !month) {
      console.log("Faltan parámetros requeridos.");
      return res.status(400).json({ mensaje: "Faltan parámetros requeridos: idSeller, year, month" });
    }

    if (isNaN(year) || isNaN(month)) {
      console.log("Año o mes no son valores numéricos válidos.");
      return res.status(400).json({ mensaje: "El año y mes deben ser valores numéricos." });
    }

    console.log("Ejecutando consulta SQL...");
    const [productos] = await connection.execute(
      `SELECT 
          p.nombre AS producto, 
          COUNT(ped.idPedido) AS cantidad_vendida
        FROM productos p
        LEFT JOIN pedidos ped 
          ON p.idProducto = ped.idProducto
        LEFT JOIN estadopedido ep
          ON ped.idEstadoPedido = ep.idEstadoPedido
        WHERE 
          p.idVendedor = ? 
          AND ep.estadoPedido = 'entregado' 
          AND MONTH(ped.fechaPedido) = ? 
          AND YEAR(ped.fechaPedido) = ?
        GROUP BY p.idProducto
        ORDER BY cantidad_vendida DESC
        LIMIT 10;`,
      [uid, month, year]
    );

    console.log(`Consulta ejecutada. Productos encontrados: ${productos.length}`);

    if (productos.length === 0) {
      console.log("No se encontraron productos para el vendedor en el mes y año especificados.");
      return res.status(404).json({ mensaje: "No se encontraron productos vendidos para este vendedor en el mes y año especificados." });
    }

    console.log("Productos encontrados, enviando respuesta.");
    res.status(200).json({ productos });
  } catch (error) {
    console.error("Error al obtener las estadísticas de productos:", error);
    res.status(500).json({ mensaje: "Error interno del servidor al obtener las estadísticas de productos." });
  }
};

const get_products_offered = async (req, res = response) => {
  try {
    const [productos] = await connection.execute(`
      SELECT 
          p.idProducto,
          p.nombre AS nombreProducto,
          p.descripcion,
          p.precio,
          p.cantidadDisponible,
          p.disponible,
          p.foto,
          c.categoriaProducto AS categoria,
          u.nombre AS nombreVendedor,
          u.correo AS correoVendedor,
          u.ubicacion AS ubicacionVendedor,
          u.foto AS fotoVendedor
      FROM productos p
      JOIN categoriaProducto c ON p.idcategoriaProducto = c.idcategoriaProducto
      JOIN usuarios u ON p.idVendedor = u.idUsuario;
    `);

    if (productos.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron productos registrados" });
    }

    return res.status(200).json({ productos });
  } catch (error) {
    console.error("Error al obtener todos los productos:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor al obtener los productos" });
  }
};

const add_product = async (req, res = response) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No hay token en la petición',
    });
  }
  try {
    const { nombre, descripcion, precio, cantidadDisponible, disponible, categoria } = req.body;

    const disponibleInt = disponible === 'true' ? 1 : 0;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Se requiere una foto del producto",
      });
    }
    const foto = req.file.buffer;

    const precioRegex = /^\d+(\.\d{1,2})?$/; 
    if (!precioRegex.test(precio)) {
      return res.status(422).json({
        success: false,
        errorCode: "INVALID_PRICE_FORMAT",
        message: "El precio debe ser un número válido con hasta dos decimales",
      });
    }

    const [categoriaRow] = await connection.execute(
      "SELECT idcategoriaProducto FROM categoriaProducto WHERE categoriaProducto = ?",
      [categoria]
    );
    if (categoriaRow.length === 0) {
      return res.status(404).json({
        success: false,
        message: "La categoría especificada no existe",
      });
    }
    const idcategoriaProducto = categoriaRow[0].idcategoriaProducto;

    const [existingProduct] = await connection.execute(
      "SELECT * FROM productos WHERE nombre = ? AND idVendedor = ?",
      [nombre, req.uid]
    );

    if (existingProduct.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Ya tienes un producto con este nombre registrado",
      });
    }

    const [resultado] = await connection.execute(
      "INSERT INTO productos (nombre, descripcion, precio, cantidadDisponible, disponible, foto, idcategoriaProducto, idVendedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nombre, descripcion, precio, cantidadDisponible, disponibleInt, foto, idcategoriaProducto, req.uid]
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

const get_order_product = async (req, res = response) => {
  try {
    const { idPedido } = req.params;

    if (!idPedido || isNaN(idPedido)) {
      return res.status(400).json({ mensaje: "ID del pedido inválido" });
    }

    const [productos] = await connection.execute(
      `SELECT p.* 
      FROM productos p
      INNER JOIN pedidos pe ON p.idProducto = pe.idProducto
      WHERE pe.idPedido = ?
      `, 
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

/**
 * Actualiza un producto si pertenece al usuario autenticado
 * @param {*} req
 * @param {*} res
 */
const update_product = async (req, res = response) => {
  try {
    const idUsuario = req.uid; 
    const { idProducto } = req.params;
    const { descripcion, precio, cantidadDisponible } = req.body;
    const [producto] = await connection.execute(
      "SELECT * FROM productos WHERE idProducto = ? AND idVendedor = ?",
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
    if (precio !== undefined) {
      if (precio < 0) {
        return res.status(400).json({
          mensaje: "El precio no puede ser menor a 0",
        });
      }
      updates.push("precio = ?");
      values.push(precio);
    }
    if (cantidadDisponible) {
      if (cantidadDisponible !== undefined && cantidadDisponible < 0) {
        return res.status(400).json({
          mensaje: "La cantidad disponible no puede ser menor a 0",
        });
      }
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
      `UPDATE productos SET ${updates.join(", ")} WHERE idProducto = ? AND idVendedor = ?`,
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
const delete_product = async (req, res = response) => {
  try {
    const idUsuario = req.uid; 
    const { idProducto } = req.params;

    const [producto] = await connection.execute(
      "SELECT * FROM productos WHERE idProducto = ? AND idVendedor = ?",
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
  get_statistics_products,
  get_products_offered,
  add_product,
  get_order_product,
  update_product,
  delete_product,
};