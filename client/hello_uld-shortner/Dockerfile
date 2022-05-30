FROM node:17-alpine

# Copy application to /app
COPY ./ /app

# Set working directory
WORKDIR /app

# Copy dependencies to /app
COPY package.json ./
COPY package-lock.json ./

# Run npm install
RUN npm install --silent

# Copy to /app
COPY . ./

EXPOSE 3000

# start app
CMD ["npm", "start"]