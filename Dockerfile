FROM node:16.15.1-slim as base

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
RUN npm install --omit=dev

FROM node:16.15.1-slim as release
WORKDIR /app
COPY package-lock.json package-lock.json
COPY package.json package.json
COPY --from=production_build /app/node_modules node_modules
COPY --from=production_build /app/dist/src src

ENTRYPOINT ["node", "./src/index.js"]
