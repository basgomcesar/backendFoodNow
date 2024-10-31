const crypto = require('crypto');

const SECRET_KEY = crypto.randomBytes(32).toString('hex');

try{
    console.log(`Clave generada: ${SECRET_KEY}`);
}catch(error){
    console.log(`Error al generar clave: ${error}`);
}

module.exports = {
    SECRET_KEY
};