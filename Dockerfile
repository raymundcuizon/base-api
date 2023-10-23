# syntax=docker/dockerfile:1

FROM node:18.18.2-alpine AS base

WORKDIR /app

COPY [ "package.json", "package-lock.lock*", "./" ]

FROM base AS dev
ENV NODE_ENV=dev
RUN npm install --frozen-lockfile
COPY . .
CMD [ "npm", "run", "start:dev" ]


FROM base AS prod
ENV NODE_ENV=production
RUN npm install --frozen-lockfile --production
COPY . .
RUN npm global add @nestjs/cli
RUN npm run build
CMD [ "npm", "run", "start:prod" ]