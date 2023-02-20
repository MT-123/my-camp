FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=80 DBPATH=mongodb://container-mongo:27017/my-camp

EXPOSE 80

CMD [ "npm", "start" ]
