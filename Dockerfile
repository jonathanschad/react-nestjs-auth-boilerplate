# Stage 1: Build the React app
FROM node:20-alpine3.20 AS client-builder
WORKDIR /app
COPY client/package.json client/yarn.lock ./
RUN yarn install
COPY client ./
RUN yarn build

# Copy sourcemaps to a separate directory
RUN mkdir -p /sourcemaps 
RUN cp dist/assets/*.map /sourcemaps
RUN rm dist/assets/*.map

# Stage 2: Build the NestJS server
FROM node:20-alpine3.20 AS server-builder
WORKDIR /app
COPY server/package.json server/yarn.lock ./
RUN yarn install
COPY server ./
RUN npx prisma generate
RUN yarn build
RUN mkdir -p /sourcemaps 
RUN find dist -name "*.map" | tar -cf - --files-from=- | tar -xpf - -C /sourcemaps/

# Stage 3: Production container
FROM node:20-alpine3.20
WORKDIR /app

# Copy server build
COPY --from=server-builder /app/dist ./server
COPY --from=server-builder /app/node_modules ./node_modules
COPY --from=server-builder /app/prisma ./prisma 

# Copy client build for static file serving
COPY --from=client-builder /app/dist ./public

# Expose sourcemaps as a build artifact
COPY --from=client-builder /sourcemaps /sourcemaps-client
COPY --from=server-builder /sourcemaps/dist /sourcemaps-server

# Set environment variables
ENV PORT=3000
EXPOSE 3000

# Start the NestJS server
CMD ["sh", "-c", "npx prisma migrate deploy && node server/main.js"]
