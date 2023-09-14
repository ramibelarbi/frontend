# Use Node.js version 14 as the base image
FROM node:17

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm run build

# Expose a port (usually 80 for HTTP servers)
EXPOSE 80

# Define the command to run your application
CMD ["npm", "start"]
