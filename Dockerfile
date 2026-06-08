# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependensi (termasuk devDependencies untuk tsc)
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npm ci

# Generate prisma client
RUN npx prisma generate

# Copy source code dan compile TypeScript
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Hanya copy file package.json dan prisma schema
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install HANYA production dependencies
RUN npm ci --omit=dev

# Generate prisma client untuk production
RUN npx prisma generate

# Copy hasil build dari stage builder
COPY --from=builder /app/dist ./dist

# Set env variabel
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Gunakan shell script sederhana untuk menjalankan migrasi lalu start server
# Dalam kasus SQLite, kita bisa menggunakan migrate deploy sebelum start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
