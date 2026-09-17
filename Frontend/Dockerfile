FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/generate-runtime-config.sh /docker-entrypoint.d/40-generate-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-generate-runtime-config.sh

# Plain runtime env vars (not Docker build args) - set the real values on
# the Coolify service; these are just local-dev-safe fallbacks.
ENV VITE_API_BASE_URL=http://127.0.0.1:8000/api
ENV VITE_API_ORIGIN=http://127.0.0.1:8000

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
