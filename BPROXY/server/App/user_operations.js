const {
    ObjectId
} = require('mongodb');

const collectionName = "Users"
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10; // Number of rounds for hashing


//Removes password before returning data
function dataCleanse(data){
    let userList = [];
    for(let i=0; i<data.length; i++){
        let user = {
          username: data[i].username,
          email : data[i].email,
          _id: data[i]._id,
          roles: data[i].roles,
          groups: data[i].groups,
          avatarPath: data[i].avatarPath
        }
        userList.push(user)
    }
    return userList
}



const seedData = [
        {
        "username": "Super",
        "email" : "super@super.com",
        "password": "$2b$10$mGyGqqVywqgpwCWLovMzwu8v8OM0IEAcMfIaUcMtYPGMOU6Ba8U0O",
        "roles": ["SuperAdmin", "GroupAdmin", "ChatUser"],
        "groups": ["0", "1", "2"]
      },  {
        "username": "Bob",
        "email" : "bob@bob.com",
        "password": "$2b$10$mGyGqqVywqgpwCWLovMzwu8v8OM0IEAcMfIaUcMtYPGMOU6Ba8U0O",
        "roles": ["GroupAdmin", "ChatUser"],
        "groups": ["1", "2"]
      },  {
        "username": "James",
        "email" : "james@james.com",
        "password": "$2b$10$mGyGqqVywqgpwCWLovMzwu8v8OM0IEAcMfIaUcMtYPGMOU6Ba8U0O",
        "roles": ["GroupAdmin", "ChatUser"],
        "groups": ["1"]
      }, {
        "username": "Sarah",
        "email" : "sarah@sarah.com",
        "password": "$2b$10$mGyGqqVywqgpwCWLovMzwu8v8OM0IEAcMfIaUcMtYPGMOU6Ba8U0O",
        "roles": ["ChatUser"],
        "groups": ["1", "2"]
      }, 
      {
        "username": "Jim",
        "email" : "jim@jim.com",
        "password": "$2b$10$mGyGqqVywqgpwCWLovMzwu8v8OM0IEAcMfIaUcMtYPGMOU6Ba8U0O",
        "roles": ["ChatUser"],
        "groups": ["1", "2", "3"]
      }
    ]
    

 async function sessionCheck(sessionID, client, dbName){
    
    let db = client.db(dbName);
    let sessionSearch = await db.collection("Sessions").find({"_id": new ObjectId(sessionID)}).toArray()
    
    try {
        let seshID = sessionSearch[0].user_id.toString();
        //console.log(seshID);
        if(sessionSearch[0].valid){
            //console.log("valid");
            const sessionuserinfo = await db.collection(collectionName).find({"_id": new ObjectId(seshID)}).toArray()
            //console.log(sessionuserinfo);
            let userList = [];
            for(let i=0; i<sessionuserinfo.length; i++){
                let user = {
                username: sessionuserinfo[i].username,
                email : sessionuserinfo[i].email,
                _id: sessionuserinfo[i]._id,
                roles: sessionuserinfo[i].roles,
                groups: sessionuserinfo[i].groups,
                avatarPath: sessionuserinfo[i].avatarPath
                }
                userList.push(user)
            }
            return {valid:true, userDetails: userList}

            }
    } catch {
        return {valid:false}
    } 
}


module.exports = {
    sessionInfo: async function(req, res, client, dbName) {
        let sessionId = req.body.sessionId;
        let results = await sessionCheck(sessionId, client, dbName)

        res.send(results);
    },

    signInto: async function(req, res, client, dbName) {

        try{
            console.log("mongo signin");
            let email = req.body.email
            let pass = req.body.password
            let db = client.db(dbName);
            let docs = await db.collection(collectionName).find({"email": email}).toArray();
            let valid;
            let session;
            const compare = await bcrypt.compare(pass, docs[0].password)
            console.log(compare)
        
            if(compare){
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
        } catch (err) {
            console.log(err)
            res.send({valid:false})
        }

    },

    sessionLogout: async function(req, res, client, dbName, sessionId) {
        console.log(sessionId + " sessionLogout attempt")
        await client.connect();
        let db = client.db(dbName);
        let sessionSearch = await db.collection("Sessions").deleteOne({"_id": new ObjectId(sessionId)});
        res.send(sessionSearch);
    },

    promoteUser: async function(req, res, client, dbName) {
        await client.connect();
        console.log("mongo promote user ");
        let db = client.db(dbName); 
        let promoteUserID = req.body.promoteUserID
        let typeOfPromotion = req.body.typeOfPromotion
        result = await db.collection(collectionName).updateOne({_id: new ObjectId(promoteUserID)}, { $addToSet: {roles: `${typeOfPromotion}`} } ); 
        res.send(result);
    },

    seed: async function (client, dbName){
        await client.connect();
        console.log("mongo seeded");
        let db = client.db(dbName); // 
        await db.collection(collectionName).deleteMany({});
        await db.collection(collectionName).insertMany(seedData);
    },

    //Insert New User
    insert: async function(req, res, client, dbName) {
    await client.connect();
    console.log("mongo newuser");
    let db = client.db(dbName); 
    let doc = req.body.userDetails
    //const hash = await bcrypt.hash(##INSERTPASSWORD##, SALT_ROUNDS);
    let newUser =    
        { username: doc.username,
        email: doc.email,
        password: "$2b$10$mGyGqqVywqgpwCWLovMzwu8v8OM0IEAcMfIaUcMtYPGMOU6Ba8U0O",
        roles: [ 'ChatUser' ],
        groups: []}
    await db.collection(collectionName).insertOne(newUser);
    let newuserdetails = await db.collection(collectionName).find({"email": doc.email}).toArray();
    console.log("Inserted the below user into collection");
    res.send(dataCleanse(newuserdetails));
    },

    //Get Userlist
    //Todo User auth?
    userList: async function(req, res, client, dbName) {
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
        }

    },

    //Lookup user data
    userLookup: async function(user_id, res, client, dbName) {
        try{
        await client.connect();
        console.log("mongo userlist");
        let db = client.db(dbName);
        const docs = await db.collection(collectionName).find({"_id": new ObjectId(user_id)}).toArray()
        res.send(dataCleanse(docs));
        } catch (err) {
            console.log(err)
            console.log(user_id)
            res.send('Error with userlookup request')
        }
    },

    updateUser: async function(req, res, client, dbName) {

        let updatedUserDetails;
        try{
            const query = { _id: new ObjectId(req.body.currentUserID._id)};
            let update;
            const options = { upsert: true };
            console.log(req.body)

            if(req.body.data.password){
                const hash = await bcrypt.hash(req.body.data.password, SALT_ROUNDS);
                update = { $set: { email: req.body.data.email, username: req.body.data.username, password: hash}}
            } else {
                update = { $set: { email: req.body.data.email, username: req.body.data.username}};
            }

            let db = client.db(dbName);
            await db.collection(collectionName).updateOne(query, update, options);
            updatedUserDetails = {updatedUserDetails: true}
        } catch (err) {
            updatedUserDetails = {updatedUserDetails: false, err: err}
        }

        res.send(updatedUserDetails);
    },

    delete: function(req, res, client) {
    let db = client.db("dbName");
    let queryJSON = req.body;
    queryJSON._id = new ObjectId(req.params_id);
    db.collection("colName").deleteMany(queryJSON);
    console.log("Removed the documents with: ", queryJSON);
    res.send(queryJSON);
    },

    updateAvatarImage: async function (req,res,client, dbName){
        console.log(req.body)
        let updateAvatar;
        try{
            const query = { email: req.body.currentUserID.email };
            const update = { $set: { avatarPath: req.body.path}};
            const options = { upsert: true };
    
            let db = client.db(dbName);
            await db.collection(collectionName).updateOne(query, update, options);
            updateAvatar = {updatedAvatar: true}
        } catch (err) {
            updateAvatar = {updatedAvatar: false, err: err}
        }
        res.send(updateAvatar)
    }

}
