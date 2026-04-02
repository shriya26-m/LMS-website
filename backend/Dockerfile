FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Ensure upload/log directories exist
RUN mkdir -p uploads logs

EXPOSE 5000

ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
