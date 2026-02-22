FROM node:22-alpine

WORKDIR /app

# Copy only API package files
COPY api/package*.json ./

RUN npm install

# Copy API source
COPY api ./

WORKDIR /app/apps/api

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]