FROM ubuntu
FROM node

RUN apt-get -y update
 
RUN apt-get -y install git

WORKDIR /usr/src

RUN git clone https://github.com/karthikeyankn910/visitors-management-app-bk.git /usr/src/app

WORKDIR /usr/src/app

# COPY package*.json ./

RUN npm install

# COPY . .

EXPOSE 4000

CMD [ "npm", "run", "start" ]
