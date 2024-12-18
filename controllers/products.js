const multer = require("multer");
const { response } = require("express");
const connection = require("../models/database");
const bcrypt = require("bcryptjs");
const upload = multer({ storage: multer.memoryStorage() });

const get_statistics_products = async (req, res = response) => {
  try {
    const { idSeller, year, month } = req.params;

    console.log(`Recibiendo parámetros - idSeller: ${idSeller}, year: ${year}, month: ${month}`);

    if (!idSeller || !year || !month) {
      console.log('Faltan parámetros requeridos');
      return res.status(400).json({ mensaje: "Faltan parámetros requeridos: idSeller, year, month" });
    }

    if (isNaN(year) || isNaN(month)) {
      console.log('Año o mes no son valores numéricos válidos');
      return res.status(400).json({ mensaje: "El año y mes deben ser valores numéricos" });
    }

    const [productos] = await connection.execute(
      `SELECT 
        p.nombre AS producto, 
        COUNT(ped.idPedido) AS cantidad_vendida
      FROM productos p
      LEFT JOIN pedidos ped 
        ON p.idProducto = ped.idProducto
      WHERE 
        p.idUsuario = ? 
        AND ped.estado = 'entregado' 
        AND MONTH(ped.fechaPedido) = ? 
        AND YEAR(ped.fechaPedido) = ?
      GROUP BY p.idProducto
      ORDER BY cantidad_vendida DESC
      LIMIT 10;`,
      [idSeller, month, year] 
    );

    console.log('Consulta SQL ejecutada, cantidad de productos encontrados:', productos.length);

    if (productos.length === 0) {
      console.log('No se encontraron productos para el vendedor en el mes y año especificados');
      return res.status(404).json({ mensaje: "No se encontraron productos vendidos para este vendedor en el mes y año especificados" });
    }

    console.log('Productos encontrados, enviando respuesta');
    res.status(200).json({ productos });

  } catch (error) {
    console.error("Error al obtener los productos más vendidos: ", error);
    res.status(500).json({ mensaje: "Error interno del servidor al obtener las estadísticas de productos" });
  }
};

const get_products_offered = async (req, res = response) => {
  const { idUsuario } = req.params;

  try {
    const [productos] = await connection.execute(
      `SELECT 
        p.nombre AS producto,
        p.descripcion,
        p.precio,
        p.cantidadDisponible,
        p.disponible,
        p.categoria,
        p.foto
      FROM productos p
      WHERE p.idUsuario = ?`,
      [idUsuario]
    );

    if (productos.length === 0) {
      return res.status(404).json({
        message: `No se encontraron productos ofrecidos por el vendedor con idUsuario: ${idUsuario}.`
      });
    }

    const productosConFoto = productos.map((producto) => {
      return {
        ...producto,
        foto: producto.foto ? producto.foto.toString('base64') : null,
      };
    });

    return res.status(200).json({ productos: productosConFoto });
  } catch (error) {
    console.error('Error al obtener productos ofrecidos:', error);
    return res.status(500).json({
      message: 'Error al obtener los productos ofrecidos.',
      error: error.message
    });
  }
}


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

    // Obtener el ID de la categoría basada en el string
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

    // Verificar si el producto ya está registrado para este usuario
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

    console.log('Categoria: ' + categoria);
    // Guardar el nuevo producto
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

module.exports = {
  get_statistics_products,
  get_products_offered,
  add_product,
};