# Use an official Node.js runtime as a base image
FROM node:16

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose the port your app runs on (default 3000)
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
