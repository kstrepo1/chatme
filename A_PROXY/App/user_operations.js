const {
    ObjectId
} = require('mongodb');

const collectionName = "Users"

function dataCleanse(data){
    let userList = [];
    for(let i=0; i<data.length; i++){
        let user = {
          username: data[i].username,
          email : data[i].email,
          _id: data[i]._id,
          roles: data[i].roles,
          groups: data[i].groups
        }
        userList.push(user)
    }
    return userList
}

//Insert New User
exports.insert = async function(req, res, client, dbName) {
    await client.connect();
    console.log("mongo newuser");
    let db = client.db(dbName); 
    let doc = req.body.userDetails
    let newUser =    
        { username: doc.username,
        email: doc.email,
        password: '123',
        roles: [],
        groups: []}
    await db.collection(collectionName).insertOne(newUser);
    let newuserdetails = await db.collection(collectionName).find({"email": doc.email}).toArray();
    console.log("Inserted the below user into collection");
    //console.log(dataCleanse(newuserdetails));
    res.send(dataCleanse(newuserdetails));
    client.close();
}

//Get Userlist
//Todo User auth?
exports.userList = async function(req, res, client, dbName) {
    await client.connect();
    console.log("mongo userlist");
    let db = client.db(dbName);
    let docs = await db.collection(collectionName).find({}).toArray();
    let userList = dataCleanse(docs);
    res.send(userList);
    client.close();
};

//Todo User auth?
exports.userLookup = async function(req, res, client, dbName) {
    await client.connect();
    console.log("mongo userlist");
    let db = client.db(dbName);
    console.log(req.body.searchUserID)
    const docs = await db.collection(collectionName).find({"_id": new ObjectId(req.body.searchUserID)}).toArray()
    let userList = [];
    console.log(docs)
    for(let i=0; i<docs.length; i++){
        let user = {
          username: docs[i].username,
          email : docs[i].email,
          _id: docs[i]._id,
          roles: docs[i].roles,
          groups: docs[i].groups
        }
        userList.push(user)
    }
    res.send(userList);
    client.close();
};

exports.update = async function(req, res, client) {

    await client.connect();
    console.log("mongo update ");
    let db = client.db("dbName"); // Create a Product
    let queryJSON = req.body.query;
    let updateJSON = req.body.update;
    result = await db.collection("colName").updateMany(queryJSON, { $set: updateJSON });
    // Update document with queryJSON, set updateJSON      
    console.log("for the documents with", queryJSON);
    console.log("SET: ", updateJSON);
    res.send(result);
    client.close();
}

exports.delete = function(req, res, client) {
    let db = client.db("dbName");
    let queryJSON = req.body;
    queryJSON._id = new ObjectId(req.params_id);
    db.collection("colName").deleteMany(queryJSON);
    console.log("Removed the documents with: ", queryJSON);
    res.send(queryJSON);
    client.close();

};

const seedData = [
        {
        "username": "Super",
        "email" : "super@super.com",
        "password": "123",
        "roles": ["SuperAdmin", "GroupAdmin", "ChatUser"],
        "groups": ["0", "1", "2"]
      },  {
        "username": "Bob",
        "email" : "bob@bob.com",
        "password": "123",
        "roles": ["GroupAdmin", "ChatUser"],
        "groups": ["1", "2"]
      },  {
        "username": "James",
        "email" : "james@james.com",
        "password": "123",
        "roles": ["GroupAdmin", "ChatUser"],
        "groups": ["1"]
      }, {
        "username": "Sarah",
        "email" : "sarah@sarah.com",
        "password": "123",
        "roles": ["ChatUser"],
        "groups": ["1", "2"]
      }, 
      {
        "username": "Jim",
        "email" : "jim@jim.com",
        "password": "123",
        "roles": ["ChatUser"],
        "groups": ["1", "2", "3"]
      }
    ]
    

exports.seed = async function (client, dbName){
    await client.connect();
    console.log("mongo seeded");
    let db = client.db(dbName); // 
    await db.collection(collectionName).deleteMany({});
    await db.collection(collectionName).insertMany(seedData);
    await client.close();
}