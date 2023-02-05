FROM node:16.15.0-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:16.15.0-alpine AS runner

ENV PORT=7865

RUN apk add --no-cache --update openssl
RUN npm install -g pnpm

WORKDIR /app
COPY --from=builder --chown=node:node /app/build ./build
COPY --chown=node:node ./package.json .
COPY --chown=node:node ./pnpm-lock.yaml .

RUN pnpm install --frozen-lockfile --production

COPY --chown=node:node ./entrypoint.js .

EXPOSE 7865

USER node

CMD [ "node", "entrypoint.js" ]

