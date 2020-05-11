FROM node:14-alpine
WORKDIR /code
EXPOSE 8080
COPY . /code
ENV port=8080
CMD ["node","server.js"]
