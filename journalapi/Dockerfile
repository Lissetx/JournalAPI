FROM node:17
ENV apiport=5051
ENV apihost=localhost
WORKDIR /apis/journalapi
COPY package.json ./
COPY . ./
EXPOSE 5050
CMD ["npm", "start"]
