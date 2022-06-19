FROM node:16.15.1-bullseye as base

WORKDIR /app
COPY package-lock.json package-lock.json
COPY package.json package.json
RUN npm install

COPY tsconfig.json tsconfig.json
COPY src src
COPY dev dev
RUN ./dev/setup.mjs --test

FROM base as test
COPY jest.config.ts jest.config.ts
COPY test test
ENTRYPOINT [ "npm", "test"]

FROM base as production_build
RUN npm run build

FROM node:16.15.1-bullseye as release
COPY package-lock.json package-lock.json
COPY package.json package.json
RUN npm install --production
COPY --from=production_build /app/dist/src src

ENTRYPOINT ['node', './src/index.js']
