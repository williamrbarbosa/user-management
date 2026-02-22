
  api:
    container_name: user-management-api
    build:
      context: .
      dockerfile: docker/api.Dockerfile
    volumes:
      - ./api:/app
    ports:
      - "${API_PORT}:3000"
    env_file:
      - ./api/.env
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
    depends_on:
      - postgres
      - redis
    command: npm run start:dev