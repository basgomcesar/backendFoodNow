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

    // Convertir disponibilidad a número
    const disponibilidadInt = disponibilidad === 'true' ? 1 : 0;

    // Validar que se haya subido un archivo de foto
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Se requiere una foto de usuario",
      });
    }
    const foto = req.file.buffer;

    // Verificar si el correo ya está registrado
    const [existingUser] = await connection.execute(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        error: "El correo ya está registrado",
      });
    }

    // Guardar el nuevo usuario
    const [resultado] = await connection.execute(
      "INSERT INTO usuarios (nombre, correo, contrasenia, tipo, disponibilidad, foto) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, correo, contrasenia, tipo, disponibilidadInt, foto]
    );

    // Confirmar que el usuario fue guardado exitosamente
    if (resultado.affectedRows > 0) {
      return res.status(201).json({
        success: true,
        message: "Usuario creado con éxito",
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "No se pudo crear el usuario, verifica tus datos",
      });
    }
  } catch (error) {
    console.error("Error al guardar usuario: ", error.message || error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor al guardar el usuario",
    });
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

    // Convertir disponibilidad a número
    const disponibilidadInt = disponibilidad === 'true' ? 1 : 0;

    // Validar que se haya subido un archivo de foto (si aplica)
    let foto = null;
    if (req.file) {
      foto = req.file.buffer;
    }

    // Construcción dinámica de la consulta UPDATE
    const updates = [];
    const values = [];

    if (nombre) {
      updates.push("nombre = ?");
      values.push(nombre);
    }

    if (correo) {
      // Verificar si el correo ya está registrado por otro usuario
      const [existingUser] = await connection.execute(
        "SELECT * FROM usuarios WHERE correo = ? AND idUsuario != ?",
        [correo, idUsuario]
      );

      if (existingUser.length > 0) {
        return res.status(409).json({
          success: false,
          error: "El correo ya está registrado por otro usuario",
        });
      }

      updates.push("correo = ?");
      values.push(correo);
    }

    if (contrasenia) {
      updates.push("contrasenia = ?");
      values.push(contrasenia);
    }

    if (disponibilidad) {
      updates.push("disponibilidad = ?");
      values.push(disponibilidadInt);
    }

    if (foto) {
      updates.push("foto = ?");
      values.push(foto);
    }

    // Verificar que haya campos para actualizar
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No se ha proporcionado ningún dato para actualizar",
      });
    }

    // Agregar idUsuario al final de los valores
    values.push(idUsuario);

    // Ejecutar la consulta de actualización
    const [resultado] = await connection.execute(
      `UPDATE usuarios SET ${updates.join(", ")} WHERE idUsuario = ?`,
      values
    );

    // Verificar si el usuario fue encontrado
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado",
      });
    }

    // Consultar el usuario actualizado
    const [usuarioActualizado] = await connection.execute(
      "SELECT idUsuario, nombre, correo, contrasenia, tipo, disponibilidad, foto FROM usuarios WHERE idUsuario = ?",
      [idUsuario]
    );

    // Responder con los datos del usuario actualizado
    return res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      usuario: {
        idUsuario: usuarioActualizado[0].idUsuario,
        nombre: usuarioActualizado[0].nombre,
        correo: usuarioActualizado[0].correo,
        contrasenia: usuarioActualizado[0].contrasenia,
        tipo: usuarioActualizado[0].tipo,
        disponibilidad: usuarioActualizado[0].disponibilidad,
        foto: usuarioActualizado[0].foto || null,
      },
    });
  } catch (error) {
    console.error("Error al actualizar usuario: ", error.message || error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor al actualizar el usuario",
    });
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

const update_availability = async (req, res = response) => {
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


module.exports = {
  save_usuario,
  get_usuario_by_id_params,
  update_usuario,
  delete_usuario,
  change_disponibility,
  update_availability
};