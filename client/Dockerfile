FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
ENV npm_config_legacy_peer_deps=true
RUN npm install
COPY . .
ENV CI=false
ENV PUBLIC_URL=/
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
