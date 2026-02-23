FROM node:20-alpine

WORKDIR /app

# Install dependencies first (optimizes docker cache)
COPY web/package*.json ./
RUN npm install

# Copy entire project
COPY web ./

EXPOSE 3001

CMD ["npm", "run", "dev"]