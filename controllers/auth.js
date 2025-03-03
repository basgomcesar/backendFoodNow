const { response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const connection  = require('../models/database');


/**
 * Define la funcionalidad para buscar un usuario en MySQL con correo y password indicados
 * @param {*} req 
 * @param {*} res 
 */
const login = async (req, res = response) => {
  try {
    const { correo, contrasenia } = req.body;

    console.log(`\nEl usuario ${correo}, y contraseña ${contrasenia} se está intentando loguear...`);

    // Ejecutar la consulta para encontrar el usuario
    const [rows] = await connection.execute(
      'SELECT tipou.idTipoUsuario,usuario.idUsuario, tipou.tipoUsuario, usuario.nombre, usuario.correo, usuario.contrasenia, usuario.foto, usuario.disponibilidad, usuario.ubicacion FROM  food_now.tipousuario AS tipou INNER JOIN food_now.usuarios AS usuario ON tipou.idTipoUsuario = usuario.idTipoUsuario WHERE usuario.correo = ? AND usuario.contrasenia = ? ;',
      [correo, contrasenia]
    );

    if (rows.length > 0) {
      const usuario = rows[0];
      console.log('Datos del usuario:', usuario);  // Añadir esto para ver si los datos son correctos
      const token = await generarJWT(usuario.idUsuario);  // Asegúrate de que 'idUsuario' es correcto
      console.log(`Token generado: ${token}`);
      res.header('x-token', token);
      res.json(usuario);
    } else {
      res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }    
  } catch (error) {
    console.error('Error en el logueo de usuario', error);
    res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
};


module.exports = { login };
