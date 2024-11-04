const { response } = require('express');
const connection = require('../models/database');

/**
 * Obtiene lista de todos los usuarios de la base de datos
 * @param {*} req 
 * @param {*} res 
 */
const get_all_usuarios = async (req, res = response) => {
    try {
      const [usuarios] = await connection.execute('SELECT * FROM usuarios');
      res.json({ usuarios });
      console.log("Respuesta:\n", usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios: ', error);
      res.status(500).json({ error: 'Error Interno del Servidor' });
    }
  };

/**
 * Registra un usuario en base de datos
 * @param {*} req 
 * @param {*} res 
 */
const save_usuario = async (req, res = response) => {
    try {
        const { nombre, correo, contrasenia, tipo, disponibilidad, foto } = req.body;

        const [resultado] = await connection.execute(
            'INSERT INTO usuarios (nombre, correo, contrasenia, tipo, disponibilidad, foto) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, correo, contrasenia, tipo, disponibilidad, foto]
        );

        res.status(201).json({
            idUsuario: resultado.insertId,
            nombre,
            correo,
            tipo,
            disponibilidad, 
            foto: foto || null
        });
    } catch (error) {
        console.error('Error al guardar usuario: ', error);
        res.status(400).json({ error: 'Error al guardar el usuario' });
    }
};

  

/**
 * Obtiene un usuario por ID, el parámetro _id viene en el cuertpo de la solicitud
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const get_usuario_by_id_body = async (req, res = response) => {
    try {
        const { idUsuario } = req.body;
        if (!idUsuario) {
            return res.status(400).json({ mensaje: 'Requiere de un ID' });
        }

        const [usuario] = await connection.execute('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuario]);

        if (usuario.length === 0) {
            return res.status(404).json({ mensaje: 'ID de Usuario no fue localizado' });
        }
        res.json(usuario[0]);
    } catch (error) {
        console.error('Error al buscar usuario por ID: ', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
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
        const { idUsuario } = req.params; // Extraer idUsuario de los parámetros de la ruta
        const { nombre, correo, contrasenia, tipo, disponibilidad, foto } = req.body;

        // Verifica que al menos un campo de actualización esté presente
        if (!idUsuario || (!nombre && !correo && !contrasenia && !tipo && disponibilidad === undefined && foto === undefined)) {
            return res.status(400).json({
                mensaje: 'Se requiere proporcionar ID de usuario y al menos un campo a actualizar (nombre, correo, contrasenia, tipo, disponibilidad, foto)',
            });
        }

        // Construcción de la consulta dinámica
        const updates = [];
        const values = [];

        if (nombre) {
            updates.push('nombre = ?');
            values.push(nombre);
        }
        if (correo) {
            updates.push('correo = ?');
            values.push(correo);
        }
        if (contrasenia) {
            updates.push('contrasenia = ?');
            values.push(contrasenia);
        }
        if (tipo) {
            updates.push('tipo = ?');
            values.push(tipo);
        }
        if (disponibilidad !== undefined) {
            updates.push('disponibilidad = ?');
            values.push(disponibilidad);
        }
        if (foto) {
            updates.push('foto = ?');
            values.push(foto);
        }

        // Agregar el idUsuario a los valores
        values.push(idUsuario);

        // Ejecutar la consulta de actualización
        const [resultado] = await connection.execute(
            `UPDATE usuarios SET ${updates.join(', ')} WHERE idUsuario = ?`,
            values
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ mensaje: 'Usuario no fue encontrado' });
        } else {
            res.json({ mensaje: 'Usuario actualizado correctamente' });
        }
    } catch (error) {
        console.error('Error al actualizar usuario: ', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
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
        const { idUsuario } = req.params; // Extraer idUsuario de los parámetros de la ruta

        const [resultado] = await connection.execute('DELETE FROM usuarios WHERE idUsuario = ?', [idUsuario]);

        if (resultado.affectedRows === 0) {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        } else {
            res.json({ mensaje: 'Usuario eliminado exitosamente' });
        }
    } catch (error) {
        console.error('Error al eliminar usuario: ', error);
        res.status(400).json({ error: 'Error al eliminar el usuario' });
    }
};



module.exports = {
  get_all_usuarios,
  save_usuario,
  get_usuario_by_id_body,
  update_usuario,
  delete_usuario,
};