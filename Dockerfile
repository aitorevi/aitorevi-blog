# Etapa de construcción
FROM node:18-alpine AS base

WORKDIR /app

# Copiar el archivo package.json y el archivo de lock de dependencias
COPY package*.json ./

# Instalar las dependencias de producción
RUN npm install --production

# Copiar el resto del código
COPY . .

# Compilar el proyecto
RUN npm run build

# Etapa final
FROM node:18-alpine AS production

WORKDIR /app

# Copiar los archivos compilados desde la etapa base
COPY --from=base /app .

# Exponer el puerto donde la aplicación se ejecutará
EXPOSE 3000

# Servir la aplicación Astro
CMD ["npm", "run", "preview"]
