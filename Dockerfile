# 1. Use Node.js to build the app
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your project files
COPY . .

# 5. Build the React app for production
RUN npm run build

# 6. Install 'serve', a lightweight web server
RUN npm install -g serve

# 7. Expose the port that Cloud Run expects
EXPOSE 8080

# 8. Start the server
# ⚠️ IMPORTANT: If you used Vite, change "build" to "dist" in the line below!
CMD ["serve", "-s", "build", "-l", "8080"]