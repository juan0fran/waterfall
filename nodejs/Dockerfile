FROM node:boron
RUN apt-get -qy install tzdata
ENV TZ=Europe/Madrid
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN npm install -g yarn 
WORKDIR /usr/src/app
COPY . .
RUN NODE_ENV=production yarn
EXPOSE 3000
CMD ["yarn", "start"]