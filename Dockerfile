FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

ENV PORT=5000

# Expose the port your app runs on
EXPOSE 5000

# Define the command to run your app
CMD ["npm", "start"]