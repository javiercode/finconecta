FROM node:16.14.2-alpine3.15 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
COPY ./package-lock.json /app/
# COPY ./.env /app/
RUN npm install
COPY . /app
RUN npm run build


FROM nginx:1.17.8-alpine

ENV NODE_ENV testing

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /usr/src/app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]