# ===============================================
# 阶段 1: 构建前端应用 (如果 dist 是构建产物)
# 如果您的 dist 包已经是现成的，可以跳过此阶段
# ===============================================
FROM node:22 as builder
WORKDIR /app
COPY package*.json ./
# 安装依赖
RUN npm install
# 复制当前目录
COPY . .
# 执行构建命令
RUN npm run build
# 假设构建产物在 /app/dist 目录下
# ===============================================

# ===============================================
# 阶段 2: 部署 Nginx 服务器
# ===============================================
FROM nginx:stable-alpine

# 1. 复制自定义 Nginx 配置
# 将上文定义的 default.conf 替换 Nginx 默认配置
COPY ./k8s/nginx/default.conf /etc/nginx/conf.d/default.conf

# 2. 复制前端静态文件
# 从 'builder' 阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 3. 暴露端口
# 必须与 default.conf 中定义的 listen 端口一致
EXPOSE 8876

# 4. 启动 Nginx (默认 CMD 不需要修改)
CMD ["nginx", "-g", "daemon off;"]
