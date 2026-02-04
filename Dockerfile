# ---- 阶段一：构建前端资源 ----
FROM node:16.17.1 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --registry=https://registry.npmmirror.com

COPY . .

RUN npm run build:prod

# ---- 阶段二：生产环境 ----
FROM nginx:alpine

# 拷贝构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]