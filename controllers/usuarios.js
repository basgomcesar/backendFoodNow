const multer = require("multer");
const { response } = require("express");
const connection = require("../models/database");
const bcrypt = require("bcryptjs");
const upload = multer({ storage: multer.memoryStorage() });

const save_usuario = async (req, res = response) => {
  try {
    const { nombre, correo, contrasenia, tipo, disponibilidad } = req.body;
    const disponibilidadInt = disponibilidad === 'true' ? 1 : 0;

    if (!req.file) {
      return res.status(400).json({ error: "Se requiere una foto de usuario" });
    }
    const foto = req.file.buffer;

    const [resultado] = await connection.execute(
      "INSERT INTO usuarios (nombre, correo, contrasenia, tipo, disponibilidad, foto) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, correo, contrasenia, tipo, disponibilidadInt, foto]
    );

    res.status(201).json({
      idUsuario: resultado.insertId,
      nombre,
      correo,
      tipo,
      contrasenia,
      disponibilidad,
      foto: foto || null,
    });
  } catch (error) {
    console.error("Error al guardar usuario: ", error);
    res.status(400).json({ error: "Error al guardar el usuario" });
  }
};

const get_usuario_by_id_params = async (req, res = response) => {
  try {
    const { idUsuario } = req.params; // Cambiado a obtener idUsuario de los parámetros de la ruta
    if (!idUsuario) {
      return res.status(400).json({ mensaje: "Requiere de un ID" });
    }

    const [usuario] = await connection.execute(
      "SELECT * FROM usuarios WHERE idUsuario = ?",
      [idUsuario]
    );

    if (usuario.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "ID de Usuario no fue localizado" });
    }
    res.json(usuario[0]);
  } catch (error) {
    console.error("Error al buscar usuario por ID: ", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

const update_usuario = async (req, res = response) => {
    try {
      const { idUsuario } = req.params;
      const { nombre, correo, contrasenia, disponibilidad } = req.body;
  
      const updates = [];
      const values = [];
  
      // Si se envía una foto, la gestionamos de manera similar a save_usuario
      let foto = null;
      if (req.file) {
        foto = req.file.buffer;  // Guardamos la foto solo si está presente
        updates.push("foto = ?");
        values.push(foto);
      }
  
      // Construcción dinámica de la consulta UPDATE para otros campos
      if (nombre) {
        updates.push("nombre = ?");
        values.push(nombre);
      }
      if (correo) {
        updates.push("correo = ?");
        values.push(correo);
      }
      if (contrasenia) {
        updates.push("contrasenia = ?");
        values.push(contrasenia);
      }
      if (disponibilidad) {
        const disponibilidadInt = disponibilidad === 'true' ? 1 : 0;
        updates.push("disponibilidad = ?");
        values.push(disponibilidadInt);
      }
  
      // Si no se especifica ningún campo para actualizar
      if (updates.length === 0) {
        return res.status(400).json({ error: "No se ha proporcionado ningún dato para actualizar" });
      }
  
      // Se añade el idUsuario al final de los valores para la condición WHERE
      values.push(idUsuario);
  
      // Ejecución de la consulta de actualización
      const [resultado] = await connection.execute(
        `UPDATE usuarios SET ${updates.join(", ")} WHERE idUsuario = ?`,
        values
      );
  
      // Verificación de que el usuario existe
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
  
      // Consulta el usuario actualizado
      const [usuarioActualizado] = await connection.execute(
        "SELECT idUsuario, nombre, correo, contrasenia, tipo, disponibilidad, foto FROM usuarios WHERE idUsuario = ?",
        [idUsuario]
      );
  
      // Respuesta con los datos del usuario actualizado
      res.status(200).json({
        idUsuario: usuarioActualizado[0].idUsuario,
        nombre: usuarioActualizado[0].nombre,
        correo: usuarioActualizado[0].correo,
        contrasenia: usuarioActualizado[0].contrasenia,
        tipo: usuarioActualizado[0].tipo, // asegurarse de que este campo exista en la tabla
        disponibilidad: usuarioActualizado[0].disponibilidad, // asegurarse de que este campo exista en la tabla
        foto: usuarioActualizado[0].foto || null,
        mensaje: "Usuario actualizado correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar usuario: ", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  };
  
const delete_usuario = async (req, res = response) => {
  try {
    const { idUsuario } = req.params; // Extraer idUsuario de los parámetros de la ruta

    const [resultado] = await connection.execute(
      "DELETE FROM usuarios WHERE idUsuario = ?",
      [idUsuario]
    );

    if (resultado.affectedRows === 0) {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    } else {
      res.json({ mensaje: "Usuario eliminado exitosamente" });
    }
  } catch (error) {
    console.error("Error al eliminar usuario: ", error);
    res.status(400).json({ error: "Error al eliminar el usuario" });
  }
};


const change_disponibility = async (req, res = response) => {
  try {
    const { idUsuario } = req.params;
    const { disponibilidad } = req.body;

    if (disponibilidad === undefined) {
      return res
        .status(400)
        .json({ mensaje: "Se requiere el valor de disponibilidad" });
    }

    const [resultado] = await connection.execute(
      "UPDATE usuarios SET disponibilidad = ? WHERE idUsuario = ?",
      [disponibilidad, idUsuario]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res
      .status(200)
      .json({ mensaje: "Disponibilidad actualizada correctamente" });
  } catch (error) {
    console.error("Error al cambiar disponibilidad: ", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

const update_availability = async (req, res = response) => {
  console.log('id-------')

  try {
    const { idUsuario } = req.params;
    const { disponibilidad, ubicacion } = req.body;

    console.log(req.body); // Verifica los datos que recibes

    // Validamos los datos de entrada
    if (disponibilidad === undefined && ubicacion === undefined) {
      return res
        .status(400)
        .json({ error: "Se debe proporcionar al menos un campo para actualizar" });
    }

    const updates = [];
    const values = [];

    // Solo agregamos los campos si están definidos
    if (disponibilidad !== undefined) {
      const disponibilidadBool = disponibilidad === 'true' || disponibilidad === true; // Asegura que el valor sea booleano
      updates.push("disponibilidad = ?");
      values.push(disponibilidadBool);
    }

    if (ubicacion !== undefined) {
      updates.push("ubicacion = ?");
      values.push(ubicacion);
    }

    // Añadimos el idUsuario al final de los valores para la cláusula WHERE
    values.push(idUsuario);

    // Construimos y ejecutamos la consulta
    const [resultado] = await connection.execute(
      `UPDATE usuarios SET ${updates.join(", ")} WHERE idUsuario = ?`,
      values
    );

    // Verificamos si se afectó alguna fila
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Consultamos el usuario actualizado para devolver la respuesta
    const [usuarioActualizado] = await connection.execute(
      "SELECT idUsuario, nombre, correo, contrasenia, tipo, disponibilidad, ubicacion FROM usuarios WHERE idUsuario = ?",
      [idUsuario]
    );

    // Respondemos con los datos del usuario actualizado
    res.status(200).json({
      idUsuario: usuarioActualizado[0].idUsuario,
      nombre: usuarioActualizado[0].nombre,
      correo: usuarioActualizado[0].correo,
      contrasenia: usuarioActualizado[0].contrasenia,
      tipo: usuarioActualizado[0].tipo,
      disponibilidad: usuarioActualizado[0].disponibilidad,
      ubicacion: usuarioActualizado[0].ubicacion,
      mensaje: "Usuario actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar usuario: ", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

const get_products_offered = async (req, res = response) => {
  try {
    const { idUsuario } = req.params; // Obtén idUsuario desde los parámetros de la ruta
    if (!idUsuario) {
      return res.status(400).json({ mensaje: "Se requiere un ID de usuario" });
    }

    // Consulta para obtener todos los productos asociados al usuario
    const [productos] = await connection.execute(
      "SELECT idProducto, nombre, descripcion, precio, cantidadDisponible, disponible, foto, categoria, idUsuario FROM productos WHERE idUsuario = ?",
      [idUsuario]
    );

    if (productos.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron productos para este usuario" });
    }

    // Imprime los productos obtenidos antes de enviarlos
    console.log('Productos obtenidos:', productos);

    // Devuelve la lista completa de productos
    res.status(200).json({ productos });
  } catch (error) {
    console.error("Error al obtener los productos: ", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

module.exports = {
  save_usuario,
  get_usuario_by_id_params,
  update_usuario,
  delete_usuario,
  change_disponibility,
  update_availability,
  get_products_offered
};