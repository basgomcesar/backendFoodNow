const crypto = require('crypto');

const SECRET_KEY = process.env.SECRET_KEY || 'default_static_key_for_dev';

try{
    console.log(`Clave generada: ${SECRET_KEY}`);
}catch(error){
    console.log(`Error al generar clave: ${error}`);
}

module.exports = {
    SECRET_KEY
};