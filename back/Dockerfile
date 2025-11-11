# Imagem base do Node
FROM node:18

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar arquivos
COPY package*.json ./
RUN npm install

# Copiar resto
COPY . .

# Porta usada pelo backend
EXPOSE 3001

# Comando para iniciar
CMD ["npm", "run", "dev"]
