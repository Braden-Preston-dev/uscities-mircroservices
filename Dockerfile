# syntax=docker/dockerfile:1
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN echo "Creating a Docker image by Braden Preston"
CMD [ "npm", "start" ]
