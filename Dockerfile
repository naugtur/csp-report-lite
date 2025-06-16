FROM node:lts-alpine
WORKDIR /code
EXPOSE 8080
COPY . /code
RUN npm ci --production
ENV port=8080
CMD ["node","server.js"]
