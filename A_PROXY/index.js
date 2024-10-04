//Connection URL 
const url='mongodb://localhost:27017';

const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http').Server(app),
    { MongoClient, ObjectId} = require('mongodb'),
    client = new MongoClient(url),
    cors = require('cors');

const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

app.use(cors());
app.use(express.json());

//DB Name
const dbName='chatme';

async function main() {
    await client.connect();
    console.log('Connected Successfully');

    const users = require('./App/user_operations');
    const groups = require('./App/group_operations');
    const sockets = require('./App/sockets.js');


    //Data Seeding 
        // seedUsers = async () => {await users.seed(client, dbName)};
        // await seedUsers();

        // seedGroups = async () => {await groups.seed(client, dbName)}
        // await seedGroups();
    
    //

    
    //Routes
    // ----------- USERS ------------
    app.post('/api/adduser', (req, res) => users.insert(req, res, client, dbName));
    app.post('/api/getUserList', (req, res) => users.userList(req, res, client, dbName));
    app.post('/api/getUser', (req, res) => users.userLookup(req, res, client, dbName));
    app.post('/api/promoteUser', (req, res) => users.promoteUser(req, res, client, dbName));
    app.delete('/api/sessionlogout/:id', (req, res) => { const sessionId = req.params.id;
        users.sessionLogout(req, res, client, dbName, sessionId);
    });

    

//TODO
    //Update User Details
    //Delete User Details 

    //Sign In
    app.post('/api/login', (req, res) => users.signIn(req, res, client, dbName));
    //Authenticate
    app.post('/api/session', (req, res) => users.sessionInfo(req, res, client, dbName));
    //Sign out

    // -------- GROUPS -------------
    app.post('/api/getGroups', (req,res) => groups.groupList(req, res, client, dbName));
    app.post('/api/createGroup', (req,res) => groups.addNewGroup(req, res, client, dbName));
    app.post('/api/joinGroup', (req,res) => groups.joinGroup(req, res, client, dbName));
    app.post('/api/leaveGroup', (req,res) => groups.leaveGroup(req, res, client, dbName));
    app.post('/api/deleteGroup', (req,res) => groups.deleteGroup(req, res, client, dbName));
    app.post('/api/addChannel', (req,res) => groups.addChannel(req, res, client, dbName));
    

    require('./App/listen')(app);


    //sockets.connect(io, 3000);


}

main()
    .then(console.log("main...."))
    .catch(console.error)
    .finally(()=> client.close());


