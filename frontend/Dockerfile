# Frontend Dockerfile - Development Mode
# Matches local development: npm start

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Environment variables for development
ENV CHOKIDAR_USEPOLLING=true
ENV WDS_SOCKET_PORT=0

# Run development server (like npm start)
# This enables hot module replacement
CMD ["npm", "start"]