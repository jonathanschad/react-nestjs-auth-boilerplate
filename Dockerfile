# Stage 1: Build the React app
FROM node:20-alpine AS client-builder
WORKDIR /app
COPY client/package.json client/yarn.lock ./
RUN yarn install
COPY client ./
RUN yarn build

# Stage 2: Build the NestJS server
FROM node:20-alpine AS server-builder
WORKDIR /app
COPY server/package.json server/yarn.lock ./
RUN yarn install
COPY server ./
RUN npx prisma generate
RUN yarn build

# Stage 3: Production container
FROM node:20-alpine
WORKDIR /app

# Fix https://github.com/nodejs/docker-node/issues/2175
RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3

# Copy server build
COPY --from=server-builder /app/dist ./server
COPY --from=server-builder /app/node_modules ./node_modules
COPY --from=server-builder /app/prisma ./prisma 

# Copy client build for static file serving
COPY --from=client-builder /app/dist ./public
# Set environment variables
ENV PORT=3000
EXPOSE 3000

# Start the NestJS server
CMD ["sh", "-c", "npx prisma migrate deploy && node server/main.js"]
