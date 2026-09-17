FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Build-time API URLs, injected by Coolify as build args / env vars.
ARG VITE_API_BASE_URL=http://127.0.0.1:8000/api
ARG VITE_API_ORIGIN=http://127.0.0.1:8000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_ORIGIN=${VITE_API_ORIGIN}

RUN npm run build

FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
