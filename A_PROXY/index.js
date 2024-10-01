//Connection URL 
const url='mongodb://localhost:27017';

const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http').Server(app),
    { MongoClient, ObjectId} = require('mongodb'),
    client = new MongoClient(url),
    cors = require('cors');

app.use(cors());
app.use(express.json());

//DB Name
const dbName='chatme';


async function main() {
    await client.connect();
    console.log('Connected Successfully');
    const db = client.db(dbName);
    const collection = db.collection('products');

    //require('./App/read')(client, app);

    require('./App/listen')(app);
}

main()
    .then(console.log("main...."))
    .catch(console.error)
    .finally(()=> client.close());


