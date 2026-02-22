FROM node:22-alpine AS builder

WORKDIR /app

COPY api/package*.json ./
RUN npm install

COPY api ./

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY api/package*.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]