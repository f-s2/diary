FROM nginx

RUN rm -rf /etc/nginx/conf.d/default.conf

COPY nginx_k8s.conf  /etc/nginx/nginx.conf
              
COPY dist /app/dist
