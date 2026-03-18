# Use Node 20
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including devDependencies (for TS)
RUN npm install

# Copy all source files
COPY . .

# Expose port
EXPOSE 8000

# Run TypeScript directly
CMD ["npx", "tsx", "src/server.ts"]