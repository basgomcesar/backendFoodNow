const { response } = require('express');
const connection = require('../models/database');
const bcrypt = require('bcryptjs');
// npm install bcryptjs



/**
 * Obtiene lista de todos los usuarios de la base de datos
 * @param {*} req 
 * @param {*} res 
 */
/*const get_all_usuarios = async (req, res = response) => {
    try {
      const [usuarios] = await connection.execute('SELECT * FROM usuarios');
      res.json({ usuarios });
      console.log("Respuesta:\n", usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios: ', error);
      res.status(500).json({ error: 'Error Interno del Servidor' });
    }
  };*/

/**
 * Registra un usuario en base de datos
 * @param {*} req 
 * @param {*} res 
 */
const save_usuario = async (req, res = response) => {
    try {
        const { nombre, correo, contrasenia, tipo, disponibilidad, foto } = req.body;
        console.log("Datos del usuario:\n", nombre, correo, contrasenia, tipo, disponibilidad);
        const [resultado] = await connection.execute(
            'INSERT INTO usuarios (nombre, correo, contrasenia, tipo, disponibilidad, foto) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, correo, contrasenia, tipo, disponibilidad, foto]
        );

        res.status(201).json({
            idUsuario: resultado.insertId,
            nombre,
            correo,
            tipo,
            contrasenia,
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
const get_usuario_by_id_params = async (req, res = response) => {
    try {
        const { idUsuario } = req.params; // Cambiado a obtener idUsuario de los parámetros de la ruta
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
        const { idUsuario } = req.params;
        const { nombre, correo, contrasenia, foto } = req.body;

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
        if (foto) {
            updates.push('foto = ?');
            values.push(foto);
        }

        values.push(idUsuario);

        const [resultado] = await connection.execute(
            `UPDATE usuarios SET ${updates.join(', ')} WHERE idUsuario = ?`,
            values
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ mensaje: 'Usuario no fue encontrado' });
        } else {
            // Consulta el usuario actualizado y envía la respuesta en el mismo formato que `save_usuario`
            const [usuarioActualizado] = await connection.execute(
                'SELECT idUsuario, nombre, correo, contrasenia, tipo, disponibilidad, foto FROM usuarios WHERE idUsuario = ?',
                [idUsuario]
            );
            
            // Devolvemos los datos completos del usuario actualizado
            res.status(200).json({
                idUsuario: usuarioActualizado[0].idUsuario,
                nombre: usuarioActualizado[0].nombre,
                correo: usuarioActualizado[0].correo,
                contrasenia: usuarioActualizado[0].contrasenia,
                tipo: usuarioActualizado[0].tipo, // asegúrate de que este campo exista en la tabla
                disponibilidad: usuarioActualizado[0].disponibilidad, // asegúrate de que este campo exista en la tabla
                foto: usuarioActualizado[0].foto || null,
                mensaje: 'Usuario actualizado correctamente'
            });
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

const change_disponibility = async (req, res = response) => {
    try {
        const { idUsuario } = req.params;
        const { disponibilidad } = req.body;

        if (disponibilidad === undefined) {
            return res.status(400).json({ mensaje: 'Se requiere el valor de disponibilidad' });
        }

        const [resultado] = await connection.execute(
            'UPDATE usuarios SET disponibilidad = ? WHERE idUsuario = ?',
            [disponibilidad, idUsuario]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.status(200).json({ mensaje: 'Disponibilidad actualizada correctamente' });
    } catch (error) {
        console.error('Error al cambiar disponibilidad: ', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};


module.exports = {
  save_usuario,
  get_usuario_by_id_params,
  update_usuario,
  delete_usuario,
  change_disponibility,
};