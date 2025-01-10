const multer = require("multer");
const { response } = require("express");
const connection = require("../models/database");
const { SECRET_KEY } = require('../helpers/config');
const jwt = require('jsonwebtoken');


const save_user = async (req, res = response) => {
  try {
    const { nombre, correo, contrasenia, tipo, disponibilidad } = req.body;

    const disponibilidadInt = disponibilidad === 'true' ? 1 : 0;

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
    

    // Convertir tipo a idTipoUsuario
    let idTipoUsuario;
    if (tipo === "Vendedor") {
      idTipoUsuario = 1;
    } else if (tipo === "Cliente") {
      idTipoUsuario = 2;
    } else {
      return res.status(400).json({
        success: false,
        error: "El tipo de usuario proporcionado no es válido",
      });
    }

    // Guardar el nuevo usuario
    const [resultado] = await connection.execute(
      "INSERT INTO usuarios (nombre, correo, contrasenia, idTipoUsuario, disponibilidad, foto) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, correo, contrasenia, idTipoUsuario, disponibilidadInt, foto]
    );

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



const update_user = async (req, res = response) => {

  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No hay token en la petición',
    });
  }


  try {
    const idUsuario = req.uid;
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

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No se ha proporcionado ningún dato para actualizar",
      });
    }

    // Agregar idUsuario al final de los valores
    values.push(idUsuario);

    const [resultado] = await connection.execute(
      `UPDATE usuarios SET ${updates.join(", ")} WHERE idUsuario = ?`,
      values
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado",
      });
    }

    const [usuarioActualizado] = await connection.execute(
      "SELECT idUsuario, nombre, correo, contrasenia, idTipoUsuario , disponibilidad, foto FROM usuarios WHERE idUsuario = ?",
      [idUsuario]
    );

    return res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar usuario: ", error.message || error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor al actualizar el usuario",
    });
  }
};

  
const delete_usuario = async (req, res = response) => {
  try {
    const token = req.header('x-token');

    if (!token) {
      return res.status(401).json({ error: "No se proporcionó el token" });
    }

    let uid;
    try {
      ({ uid } = jwt.verify(token, SECRET_KEY));
    } catch (error) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    if (!uid || isNaN(uid)) {
      return res.status(400).json({ error: "ID de usuario inválido en el token" });
    }

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

    console.log(req.body);

    if (disponibilidad === undefined && ubicacion === undefined) {
      return res
        .status(400)
        .json({ error: "Se debe proporcionar al menos un campo para actualizar" });
    }

    const updates = [];
    const values = [];

    if (disponibilidad !== undefined) {
      const disponibilidadBool = disponibilidad === 'true' || disponibilidad === true; // Asegura que el valor sea booleano
      updates.push("disponibilidad = ?");
      values.push(disponibilidadBool);
    }

    if (ubicacion !== undefined) {
      updates.push("ubicacion = ?");
      values.push(ubicacion);
    }

    values.push(idUsuario);

    const [resultado] = await connection.execute(
      `UPDATE usuarios SET ${updates.join(", ")} WHERE idUsuario = ?`,
      values
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const [usuarioActualizado] = await connection.execute(
      "SELECT idUsuario, nombre, correo, contrasenia, tipo, disponibilidad, ubicacion FROM usuarios WHERE idUsuario = ?",
      [idUsuario]
    );

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
  save_user,
  update_user,
  delete_usuario,
  change_disponibility,
  update_availability
};