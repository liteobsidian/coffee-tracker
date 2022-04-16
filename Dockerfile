FROM node:14-alpine as develop-stage
WORKDIR /app
#COPY front/package.json ./front/
#RUN export APPNAME=$(node -p "require('./front/package.json').name")
#ENV APP_NAME=${APPNAME}
#RUN export APPVERSION=$(node -p "require('./front/package.json').version")
#ENV APP_VERSION=${APPVERSION}
#RUN echo $APP_NAME
#
RUN yarn global add @quasar/cli eslint
COPY . .

# build stage
FROM develop-stage as build-stage
RUN cd back \
    && yarn \
    && yarn lint-fix \
    && yarn run build
RUN cd front \
    && yarn \
    && yarn lint-fix \
    && quasar build


# production stage
# FROM nginx:1.17.5-alpine as production-stage
# FROM bitnami/node:14-prod as production-stage
# FROM node:14-alpine as production-stage
# slim, т.к. в alpine надо сделать RU locale
FROM node:14-slim as production-stage
WORKDIR /app
# use ENV in docker-compose
#ENV PORT 3000
#ENV DB_HOST 10.3.0.36
#ENV DB_NAME stat
#ENV DB_PORT 5433
#ENV DB_USER stat
#ENV DB_PASS stat
#ENV PATH_UPLOADS uploads
#ENV REPORT_URL 127.0.0.1:14000,
#ENV REPORT_API: /api/v1/template
#ENV DOCKER 1
ENV PATH_UPLOADS /app/uploads
ENV PATH_TEMPLATE /app/template
COPY --from=build-stage /app/back/dist/*.bundle.js ./stat-app.bundle.js
COPY --from=build-stage /app/front/dist/spa ./public
COPY --from=build-stage /app/back/dist/template ./template
EXPOSE 3000
##
#VOLUME /var/log
#VOLUME /app/public/uploads
CMD ["node", "stat-app.bundle.js"]
#ENTRYPOINT ["node", "index.bundle.js"]
