# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps (cached)
COPY package*.json ./
RUN npm ci

# Copy sources & build
COPY . .
# If you need a specific base-href, pass: -- --base-href=/yourpath/
RUN npm run build

# ---------- Serve stage ----------
FROM nginx:alpine
# Nginx config for SPA routing
COPY ops/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the Angular build output
# Adjust the path if your project name differs
COPY --from=build /app/dist/priceadvisor-ui/browser /usr/share/nginx/html

# Provide a default runtime config (can be overridden by a volume in compose)
COPY ops/app-config.default.json /usr/share/nginx/html/app-config.json