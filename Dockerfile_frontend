# Use the official Node.js image as the base image for frontend
FROM node:20.0.0-alpine AS frontend

# Set the working directory for frontend
WORKDIR /app/quirknotes/frontend

# Copy frontend package files
COPY quirknotes/frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY quirknotes/frontend ./

# Build frontend
RUN npm run build

# Use a lightweight webserver to serve frontend assets
FROM nginx:alpine AS webserver

# Set the working directory for frontend
WORKDIR /usr/share/nginx/html

# Copy frontend build from frontend stage to nginx directory
COPY --from=frontend /app/quirknotes/frontend/build ./

# Expose port 3000 to serve the frontend
EXPOSE 3000

# Command to start nginx and serve frontend
CMD ["nginx", "-g", "daemon off;"]