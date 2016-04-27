FROM node:5

RUN npm install -g webpack

ADD package.json /app/package.json
RUN cd /app && npm install

ADD . /app
WORKDIR /app

RUN NODE_ENV=production webpack --optimize-minimize --progress --colors

RUN mkdir dist && cp -r www dist/www && cp -r build/* dist/www
RUN mv dist/www/index.html dist/index.html.template
RUN cp Dockerfile.run dist/Dockerfile
RUN cp start dist/start
RUN cp default.conf dist/
RUN chmod +x dist/start

CMD cd dist && tar -cf - .
