FROM node:16-alpine as build

# directorio de trabajo
WORKDIR /app

# copia los archivos del proyecto
COPY package.json package-lock.json ./

# instala las dependencias
RUN npm install

# copia el resto de los archivos del proyecto
COPY . ./

# crea la versión de producción de la app
RUN npm run build

# -----------------------------------------

# para servir la aplicación con un servidor estático
FROM nginx:alpine

# copia la app
COPY --from=build /app/build /usr/share/nginx/html

# expone el puerto para nginx
EXPOSE 80

# inicia nginx para servir la aplicación
CMD ["nginx", "-g", "daemon off;"]
