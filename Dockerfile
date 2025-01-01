# Usa una imagen base de Node.js
FROM node:18

# Define el directorio de trabajo en la imagen
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código del proyecto
COPY . .

# Expone el puerto que usará tu API (por ejemplo, 3000)
EXPOSE 3000

# Define el comando para ejecutar la API
CMD ["node", "server.js"]