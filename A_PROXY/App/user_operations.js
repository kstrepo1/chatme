const {
    ObjectId
} = require('mongodb');

const collectionName = "Users"

//Removes password before returning data
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
        roles: [ 'ChatUser' ],
        groups: []}
    await db.collection(collectionName).insertOne(newUser);
    let newuserdetails = await db.collection(collectionName).find({"email": doc.email}).toArray();
    console.log("Inserted the below user into collection");
    res.send(dataCleanse(newuserdetails));
    //client.close();
}

//Get Userlist
//Todo User auth?
exports.userList = async function(req, res, client, dbName) {
    try{
        await client.connect();
        console.log("mongo userlist");
        let db = client.db(dbName);
        let docs = await db.collection(collectionName).find({}).toArray();
        let userList = dataCleanse(docs);
        res.send(userList);
    } catch (error){
        console.error(error);
        res.status(500);
    } finally{
       //await client.close();
    }

};

//Lookup user data
exports.userLookup = async function(req, res, client, dbName) {
    await client.connect();
    console.log("mongo userlist");
    let db = client.db(dbName);
    console.log(req.body.searchUserID)
    const docs = await db.collection(collectionName).find({"_id": new ObjectId(req.body.searchUserID)}).toArray()
    res.send(dataCleanse(docs));

};

exports.update = async function(req, res, client) {

    await client.connect();
    console.log("mongo update ");
    let db = client.db("dbName"); 
    let queryJSON = req.body.query;
    let updateJSON = req.body.update;
    result = await db.collection("colName").updateMany(queryJSON, { $set: updateJSON }); 
    console.log("for the documents with", queryJSON);
    console.log("SET: ", updateJSON);
    res.send(result);
}

exports.delete = function(req, res, client) {
    let db = client.db("dbName");
    let queryJSON = req.body;
    queryJSON._id = new ObjectId(req.params_id);
    db.collection("colName").deleteMany(queryJSON);
    console.log("Removed the documents with: ", queryJSON);
    res.send(queryJSON);

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
    //await client.close();
}


//Sign In Check 
exports.signIn = async function(req, res, client, dbName) {
    await client.connect();
    console.log("mongo signin");
    let email = req.body.email
    let pass = req.body.password
    let db = client.db(dbName);
    let docs = await db.collection(collectionName).find({"email": email}).toArray();
    console.log(docs)
    let valid;
    let session;

    if(docs[0].password==pass){
        let userDetails = dataCleanse(docs);
        console.log("Password Correct");
        let newSession = {"email": docs[0].email, user_id: docs[0]._id, date: Date.now(), valid: true}
        session = await db.collection('Sessions').insertOne(newSession);
        valid = true;
        res.send({"valid": valid, "session": session.insertedId });
    } else {
        console.log("Password Wrong");
        valid=false
        res.send({"valid": valid});
    }
    
    //client.close();
};

async function sessionCheck(sessionID, client, dbName){
    await client.connect();
    let db = client.db(dbName);
    let sessionSearch = await db.collection("Sessions").find({"_id": new ObjectId(sessionID)}).toArray()
    
    try {
        let seshID = sessionSearch[0].user_id.toString();
        console.log(seshID);
        if(sessionSearch[0].valid){
            console.log("valid");
            const sessionuserinfo = await db.collection(collectionName).find({"_id": new ObjectId(seshID)}).toArray()
            console.log(sessionuserinfo);
            let userList = [];
            for(let i=0; i<sessionuserinfo.length; i++){
                let user = {
                username: sessionuserinfo[i].username,
                email : sessionuserinfo[i].email,
                _id: sessionuserinfo[i]._id,
                roles: sessionuserinfo[i].roles,
                groups: sessionuserinfo[i].groups
                }
                userList.push(user)
            }
            return {valid:true, userDetails: userList}

            }
    } catch {
        return {valid:false}
    } finally {
        //client.close();
    }


}

//sessionInfo Check 
exports.sessionInfo = async function(req, res, client, dbName) {
    let sessionId = req.body.sessionId;
    let results = await sessionCheck(sessionId, client, dbName)

    res.send(results);
};

//sessionInfo Check 
exports.sessionLogout = async function(req, res, client, dbName, sessionId) {
    console.log(sessionId + " sessionLogout attempt")
    await client.connect();
    let db = client.db(dbName);
    let sessionSearch = await db.collection("Sessions").deleteOne({"_id": new ObjectId(sessionId)});
    console.log(sessionSearch);
    res.send(sessionSearch);
};