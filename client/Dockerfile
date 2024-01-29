FROM node:18-alpine3.14 as build

RUN mkdir /app

WORKDIR /app

COPY ./package.json .
RUN yarn install

COPY . .

RUN yarn build

FROM nginx:1.23-alpine

WORKDIR /app/web

COPY ./config/nginx /etc/nginx/conf.d

COPY --from=build /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
