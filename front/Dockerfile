# Build da aplicação
FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Nginx para servir os arquivos
FROM nginx:stable

# Remove default.conf para evitar conflito
RUN rm -f /etc/nginx/conf.d/default.conf

# Copia seu default.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos gerados pelo build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
