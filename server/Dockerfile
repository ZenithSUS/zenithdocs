# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies (needed for TS)
RUN npm install

# Copy all source files
COPY . .

# Compile TypeScript
RUN npx tsc   # use local tsc from devDependencies

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy compiled JS
COPY --from=builder /app/dist ./dist

# Copy public assets
COPY --from=builder /app/src/public ./dist/public

EXPOSE 4000

CMD ["node", "dist/server.js"]