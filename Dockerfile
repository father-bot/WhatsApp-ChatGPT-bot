FROM node:18.19-alpine

WORKDIR /whatsapp-chatgpt-bot
COPY ./src .
COPY ./package.json .

RUN npm install

CMD [ "./index.js" ]
