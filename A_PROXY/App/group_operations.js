const {
    ObjectId
} = require('mongodb');

const collectionName = "Groups"


//Todo User auth?
exports.groupList = async function(req, res, client, dbName) {
    try{
        await client.connect();
        console.log("mongo Grouplist");
        let db = client.db(dbName);
        let docs = await db.collection(collectionName).find({}).toArray();
        res.send(docs);
    } catch (error){
        console.error(error);
        res.status(500);
    } 

};


exports.addNewGroup = async function(req, res, client, dbName) {
    try{
        await client.connect();
        console.log("mongo Group Add");
        let db = client.db(dbName);
        let newGroup = {"groupname": req.body.groupname, "id": groups.length, "channels":req.body.channels, "groupAdminAccess": req.body.groupAdminAccess, "createdby": req.body.createdby}
        await db.collection(collectionName).insertOne(newGroup);
        res.send({successGroupAdd:true});
    } catch (error){
        console.error(error);
        res.status(500);
    } 

};

exports.joinGroup = async function(req, res, client, dbName) {

    try{
        await client.connect();
        console.log("mongo Join Group");
        let db = client.db(dbName);
        await db.collection("Users").updateOne({"_id": new ObjectId(req.body.searchUserID[0]._id)}, {$addToSet: {groups: req.body.groupID}})
        res.send({successGroupJoin:true});
    } catch (error){
        console.error(error);
        res.status(500);
    } 
}




const groupSeedData = [
    {"groupname": "Group One", "id": 0, "channels":["Main", "Second", "Other"], "groupAdminAccess": ["102"], "createdby": ["102"]}, 
    {"groupname": "Group Two", "id": 1, "channels":["Main", "Alternative", "Wine"], "groupAdminAccess": ["102"], "createdby": ["102"]}, 
    {"groupname": "Group Three", "id": 2, "channels":["Main", "Other"], "groupAdminAccess": ["102", "103"], "createdby": ["102"]}, 
    {"groupname": "Group Four", "id": 3, "channels":["General", "Alt", "Other"], "groupAdminAccess": ["103"], "createdby": ["103"]}
  ]

exports.seed = async function(client, dbName) {
    try{
        await client.connect();
        console.log("mongo Seed Groups");
        let db = client.db(dbName);
        await db.collection(collectionName).deleteMany({});
        await db.collection(collectionName).insertMany(groupSeedData)
    } catch (error){
        console.error(error);
    } 

};