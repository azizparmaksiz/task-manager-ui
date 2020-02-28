FROM node:13.8.0-alpine3.11 as build-step
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.17.8-alpine as prod-stage
COPY --from=build-step /app/dist/task-manager-ui /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
