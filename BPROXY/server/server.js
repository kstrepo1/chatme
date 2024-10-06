//PORT USED FOR SERVER
const PORT = 3001;
const url='mongodb://localhost:27017';
const dbName="chatme"
const express = require('express');
const bodyParser = require('body-parser');
const app = express(),
    cors = require('cors'),
    http = require('http').Server(app),
    io = require('socket.io')(http, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
        }),
    { MongoClient, ObjectId} = require('mongodb'),
    client = new MongoClient(url),
    multer = require('multer')

const sockets = require('./App/sockets.js');
const server = require ('./App/listen.js');
const users = require('./App/user_operations.js')
const groups = require('./App/group_operations.js')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype[6]+ file.mimetype[7] + file.mimetype[8])
    }
  })
  const upload = multer({storage: storage});
//Express cors middleware
app.use(cors());
app.use(bodyParser.json()); 

app.get('/', (req, res)=> res.send('Hello World'));

app.post('/test', (req,res) => res.send(req.body));

    //Data Seeding 
        //users.seed(client, dbName)

        // await groups.seed(client, dbName)
    
    //
    
//Routes
// ----------- USERS ------------
app.post('/api/adduser',(req, res) => users.insert(req, res, client, dbName));
app.post('/api/getUserList', (req, res) => users.userList(req, res, client, dbName));
app.post('/api/getUser', (req, res) => users.userLookup(req, res, client, dbName));
app.post('/api/promoteUser', (req, res) => users.promoteUser(req, res, client, dbName));
app.delete('/api/sessionlogout/:id', (req, res) => { const sessionId = req.params.id;
    users.sessionLogout(req, res, client, dbName, sessionId);
});

//Sign In
app.post('/api/login', (req, res) => users.signInto(req, res, client, dbName));
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
app.post('/api/getChats', (req,res) => groups.getMessages(req, res, client, dbName));
app.post('/api/fileSend', upload.single('file'), (req,res, next)=> groups.fileSend(req,res,next));

app.get('/uploads/:name',(req, res) => groups.getImage(req, res));

//Socket Setup
sockets.connect(io, PORT);

server.listen(http,PORT);