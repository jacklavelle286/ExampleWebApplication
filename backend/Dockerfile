# Use an official Node.js LTS image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json/package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app’s files
COPY . .


EXPOSE 3000

# Define the command to start your Node.js app
CMD ["npm", "start"]
