FROM node:17
ENV apihost=localhost
WORKDIR /apis/journalapi
RUN npm install
COPY . ./
EXPOSE 5050
CMD ["npm", "start"]
