const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb://localhost:5010/";
//"mongodb://172.20.0.2:5010/
const dbName = "JournalAPI";

let dbconnection;

async function connectDatabase() {
    if (dbconnection) {
        return dbconnection;
    }
    const client = new MongoClient(uri);
    try {
        await client.connect();
        dbconnection = client.db(dbName);
        console.log("Connected to database");
        return dbconnection;
    } catch (err) {
        console.log("Error connecting to database", err);
        throw err;
    }
}

module.exports = {connectDatabase};