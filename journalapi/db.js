const { json } = require("express");
const { ObjectId } = require("mongodb");

const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://172.17.0.1:5010/";
//mongodb://172.25.0.2:5011
let dbconnection;
const connectDatabase = async function() {

  const client = new MongoClient(uri);
  client.connect((err) => {
    dbconnection = client.db("RetroGameApi");
    console.log("Connected to MongoDB");
    // listDatabases(client);


  });


};