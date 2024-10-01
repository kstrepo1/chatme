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
//const dbCollection='products'


async function main() {
    await client.connect();
    console.log('Connected Successfully');
    const db = client.db(dbName);
    //const collection = db.collection(dbCollection);
    const users = require('./App/user_operations');

    //Data Seeding
    // seedUsers = async () => {await users.seed(client, dbName)};
    // await seedUsers();
    
    //Routes
    app.post('/api/adduser', (req, res) => users.insert(req, res, client, dbName));
    app.post('/api/getUserList', (req, res) => users.userList(req, res, client, dbName));
    app.post('/api/getUser', (req, res) => users.userLookup(req, res, client, dbName));

//TODO
    //Update
    //Delete

    //Sign In
    app.post('/api/login', (req, res) => users.signIn(req, res, client, dbName));
    app.post('/api/session', (req, res) => users.sessionInfo(req, res, client, dbName));

    //Authenticate
    //Sign out

    require('./App/listen')(app);
}

main()
    .then(console.log("main...."))
    .catch(console.error)
    .finally(()=> client.close());


