# Use Node 20 Alpine
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port for API
EXPOSE 8000

# Run API and Worker simultaneously
RUN npm install -g concurrently
CMD ["concurrently", "npm run start", "npm run worker"]