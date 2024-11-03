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
    const { correo, password } = req.body;

    console.log(`\nEl usuario ${correo}, y contraseña ${password} se está intentando loguear...`);


    //Ejecutar la consulta para encontrar el usuario
    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE correo = ?  AND contrasenia = ?',
      [correo, password]
    );


    if (rows.length > 0) {
      const usuario = rows[0];
      console.log(`Login correcto.`);

      // Genera un JWT con el ID del usuario
      const token = await generarJWT(usuario.id); // Asegúrate de que 'id' es la columna en MySQL que identifica al usuario
      res.header('x-token', token);
      console.log(`Token enviado en el header: ${token}`);

      // Devuelve el usuario en la respuesta
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
