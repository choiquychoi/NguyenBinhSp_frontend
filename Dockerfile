# Stage 1: Build React
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy cấu hình Nginx riêng vào container (THÊM DÒNG NÀY)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy kết quả build vào Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80 cho web
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
