FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY client-src/ ./client-src/
COPY www/ ./www/
RUN npm run build-css


FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/www/ ./www/
COPY server/ ./server/
COPY db/empty.db ./db/empty.db

EXPOSE 3000

CMD ["node", "server/index.js"]
