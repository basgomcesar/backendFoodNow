FROM node:18 


WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Asegúrate de exponer el puerto en el que tu aplicación escucha
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
