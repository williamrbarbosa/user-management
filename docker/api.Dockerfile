FROM node:22-alpine

WORKDIR /app

# Copy dependencies files
COPY api/package*.json ./
COPY api/prisma.config.ts ./prisma.config.ts

RUN npm install

# Copy ntire project
COPY api/ .

# Generate prisma client
RUN npx prisma generate

RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push && npm start"]