
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv/config');

const client = new MongoClient(process.env.DB_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let connectedDBInfo

const isMangoDBConnect = async () => {
  // Use connect method to connect to the server
  await client.connect();
  const db = client.db(process.env.DB_NAME);
  try {
    console.log('DB connected: ', process.env.DB_NAME);
    connectedDBInfo = db;
    return db;
  } catch (error) {
    console.log('error=====', error);
    return error;
  }
}

function getDB() {
    return connectedDBInfo;
}

module.exports = {isMangoDBConnect, getDB};