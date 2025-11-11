# Build
FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Servindo o build no Nginx
FROM nginx:stable
COPY --from=build /app/dist /usr/share/nginx/html

# Porta real do frontend
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
