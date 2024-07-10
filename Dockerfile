FROM node:20.3
WORKDIR /app
COPY package*.json .
RUN rm -rf node_modules
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
