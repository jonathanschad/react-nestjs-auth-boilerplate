# Base image with pnpm installed
FROM node:20-alpine3.20 AS base
#RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm@latest

# Set environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Build stage
FROM base AS build
WORKDIR /usr/src/app

# Copy all files to the container
COPY . .

# Install dependencies and build all apps/packages
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

# Deploy production builds for client and server
RUN pnpm deploy --filter=client --prod /prod/client
RUN pnpm deploy --filter=server --prod /prod/server
RUN pnpm deploy --filter=@boilerplate/prisma --prod /prod/database

# Extract sourcemaps for client
RUN mkdir -p /sourcemaps-client
RUN cp -R /prod/client/dist /sourcemaps-client
RUN rm /prod/client/dist/assets/*.map
RUN find /prod/client/dist/assets -name "index-*.js" -exec sed -i '/\/\/# sourceMappingURL=.*\.map/d' {} \;
# Extract sourcemaps for server
RUN mkdir -p /sourcemaps-server
RUN cp -R /prod/server/dist /sourcemaps-server


# Production stage
FROM node:20-alpine3.20 AS production
WORKDIR /apps

# Copy server build
COPY --from=build /prod/server ./server

# Copy client build for static file serving
COPY --from=build /prod/client/dist ./server/dist/public

# Copy the @boilerplate/database package (for Prisma CLI and schema)
COPY --from=build /prod/database ./database

# Expose sourcemaps as a build artifact
COPY --from=build /sourcemaps-client /sourcemaps-client
COPY --from=build /sourcemaps-server /sourcemaps-server

# Set environment variables
EXPOSE 3000

# Set the Prisma schema path explicitly
ENV PRISMA_SCHEMA_PATH=/apps/database/prisma/schema.prisma

# Start the NestJS server
CMD ["sh", "-c", "cd /apps/database && npx prisma migrate deploy --schema $PRISMA_SCHEMA_PATH && cd ../server && node dist/main.js"]
