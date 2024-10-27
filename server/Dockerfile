# Dockerfile.backend

# Stage 1: Build the NestJS server
FROM node:20-alpine AS server-builder
WORKDIR /app
COPY server/package.json server/yarn.lock ./
RUN yarn install
COPY server ./
RUN npx prisma generate
RUN yarn build

# Stage 2: Production container for the server
FROM node:20-alpine
WORKDIR /app

# Copy server build
COPY --from=server-builder /app/dist ./dist
COPY --from=server-builder /app/node_modules ./node_modules

# Set environment variables
ENV PORT=3000
EXPOSE 3000

# Start the NestJS server
CMD ["node", "dist/main.js"]
