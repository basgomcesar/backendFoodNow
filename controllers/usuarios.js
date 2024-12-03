const multer = require("multer");
const { response } = require("express");
const connection = require("../models/database");
const bcrypt = require("bcryptjs");
const upload = multer({ storage: multer.memoryStorage() });
const { SECRET_KEY } = require('../helpers/config');
const jwt = require('jsonwebtoken');


/**
 * Registra un usuario en base de datos
 * @param {*} req
 * @param {*} res
 */
const save_usuario = async (req, res = response) => {
  try {
    const { nombre, correo, contrasenia, tipo, disponibilidad } = req.body;
    const disponibilidadInt = disponibilidad === 'true' ? 1 : 0;

    if (!req.file) {
      return res.status(400).json({ error: "Se requiere una foto de usuario" });
    }
    const foto = req.file.buffer;

    // Verificar si el correo ya está registrado
    const [existingUser] = await connection.execute(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );

    // Si el correo ya existe, retornar un error
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }

    // Si el correo no existe, guardar el nuevo usuario
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


/**
 * Obtiene un usuario por ID, el parámetro _id viene en el cuertpo de la solicitud
 * @param {*} req
 * @param {*} res
 * @returns
 */
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

/**
 * Actualiza a un usuario, el _id del usuario viene en el cuerpo de la solicitud
 * @param {*} req
 * @param {*} res
 * @returns
 */
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
  
  

/**
 * Elimina usuario
 * @param {*} req
 * @param {*} res
 * @returns mensaje de eliminación
 */
const delete_usuario = async (req, res = response) => {
  try {
    // Obtener el token del encabezado
    const token = req.header('x-token');

    if (!token) {
      return res.status(401).json({ error: "No se proporcionó el token" });
    }

    let uid;
    try {
      // Verificar y extraer el uid del token
      ({ uid } = jwt.verify(token, SECRET_KEY));
    } catch (error) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    // Verificar que el uid extraído sea válido
    if (!uid || isNaN(uid)) {
      return res.status(400).json({ error: "ID de usuario inválido en el token" });
    }

    // Ejecutar la consulta para eliminar el usuario
    const [resultado] = await connection.execute(
      "DELETE FROM usuarios WHERE idUsuario = ?",
      [uid]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
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

module.exports = {
  save_usuario,
  get_usuario_by_id_params,
  update_usuario,
  delete_usuario,
  change_disponibility,
};
