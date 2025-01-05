const multer = require("multer");
const { response } = require("express");
const connection = require("../models/database");
const bcrypt = require("bcryptjs");
const upload = multer({ storage: multer.memoryStorage() });
const { SECRET_KEY } = require('../helpers/config');
const jwt = require('jsonwebtoken');



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
  get_usuario_by_id_params,
  change_disponibility,
  update_availability
};