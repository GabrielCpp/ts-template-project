FROM node:16.15.1-bullseye as base

RUN apt-get update -y \
    && apt-get install -y postgresql-client postgresql-client-common \
    && npm install --location=global npm@latest

WORKDIR /app
COPY package-lock.json package-lock.json
COPY package.json package.json
RUN npm install

COPY tsconfig.json tsconfig.json
COPY src src
COPY dev dev

FROM base as test
RUN ./dev/setup.mjs --test 
COPY jest.config.ts jest.config.ts
COPY test test
ENTRYPOINT [ "bash", "-c", "npm run db:migrate && npm test"]

FROM base as production_build
RUN npm run build

FROM node:16.15.1-bullseye as release
COPY package-lock.json package-lock.json
COPY package.json package.json
RUN npm install --omit=dev
COPY --from=production_build /app/dist/src src

ENTRYPOINT ['node', './src/index.js']
