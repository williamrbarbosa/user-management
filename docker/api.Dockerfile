FROM node:22-alpine

WORKDIR /app

# Copy dependencies files
COPY api/package*.json ./

RUN npm install

# Copy ntire project
COPY api ./

# Generate prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]