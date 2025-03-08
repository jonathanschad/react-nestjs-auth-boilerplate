FROM node:20-slim AS base
# Install pnpm explicitly
RUN npm install -g pnpm@latest

# Set environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=client --prod /prod/client
RUN pnpm deploy --filter=server --prod /prod/server

FROM base AS client
COPY --from=build /prod/client /prod/client
WORKDIR /prod/client
EXPOSE 8000
CMD [ "pnpm", "start" ]

FROM base AS server
COPY --from=build /prod/server /prod/server
WORKDIR /prod/server
EXPOSE 8001
CMD [ "pnpm", "start" ]