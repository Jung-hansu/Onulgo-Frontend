# Build the vue3 app
FROM node:20.3 as build-stage
WORKDIR /app
COPY package*.json .
RUN rm -rf node_modules
RUN npm ci

COPY . .
RUN npm run build

# Serve the app with Nginx
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
