# Use Node.js version 17 as the base image
FROM node:17 AS builder

# Set the working directory in the container
WORKDIR /app

# Navigate to the "internship" directory
WORKDIR /app/internship

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Create the runtime image
FROM node:17

# Set the working directory in the runtime container
WORKDIR /app

# Navigate to the "internship" directory
WORKDIR /app/internship

# Copy the production build from the builder stage
COPY --from=builder /app/internship/build ./build

# Expose a port (e.g., 3000 for Node.js)
EXPOSE 3000

# Define the command to run your Node.js server (replace with your actual start command)
CMD ["npm", "start"]
