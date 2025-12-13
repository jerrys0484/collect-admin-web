FROM 192.168.0.102:5000/base/nginx:1711c6be-113e-4770-a555-d70ff24eca28

# 1. 复制自定义 Nginx 配置
# 将上文定义的 default.conf 替换 Nginx 默认配置
COPY ./k8s/nginx/default.conf /etc/nginx/conf.d/default.conf

# 2. 复制前端静态文件
# 从 'builder' 阶段复制构建产物
COPY . /usr/share/nginx/html

# 3. 暴露端口
# 必须与 default.conf 中定义的 listen 端口一致
EXPOSE 8876

# 4. 启动 Nginx (默认 CMD 不需要修改)
CMD ["nginx", "-g", "daemon off;"]
