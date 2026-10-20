# ---------- 1) Construir Angular ----------
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
RUN npx ng build --configuration production

# ---------- 2) Servir con nginx (y reenviar /api al backend) ----------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/pos-frontend/browser /usr/share/nginx/html
EXPOSE 80
