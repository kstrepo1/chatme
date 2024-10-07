const { ObjectId } = require('mongodb'), 
path = require('path')

const collectionName = "Groups"

const groupSeedData = [
    {"groupname": "Group One", "id": 0, "channels":["Main", "Second", "Other"], "groupAdminAccess": ["102"], "createdby": ["102"]}, 
    {"groupname": "Group Two", "id": 1, "channels":["Main", "Alternative", "Wine"], "groupAdminAccess": ["102"], "createdby": ["102"]}, 
    {"groupname": "Group Three", "id": 2, "channels":["Main", "Other"], "groupAdminAccess": ["102", "103"], "createdby": ["102"]}, 
    {"groupname": "Group Four", "id": 3, "channels":["General", "Alt", "Other"], "groupAdminAccess": ["103"], "createdby": ["103"]}
]



module.exports = {
//Todo User auth?
    groupList: async function(req, res, client, dbName) {
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

    },
    getMessages: async function(req, res, client, dbName) {
        try{
            await client.connect();
            console.log("mongo getMessages");
            let gID = req.body.groupID
            let db = client.db(dbName);
            let docs = await db.collection("Chats").find({'message.groupID':gID}, {sort: { "message.datetime": -1 }}).toArray();
            res.send(docs);
        } catch (error){
            console.error(error);
            res.status(500);
        } 

    },


    addNewGroup: async function(req, res, client, dbName) {
        try{
            await client.connect();
            console.log("mongo Group Add");
            let db = client.db(dbName);
            let groups = await db.collection(collectionName).find({}).toArray()
            let newGroup = {"groupname": req.body.groupname, "id": groups.length, "channels":req.body.channels, "groupAdminAccess": req.body.groupAdminAccess, "createdby": req.body.createdby}
            await db.collection(collectionName).insertOne(newGroup);
            res.send({successGroupAdd:true});
        } catch (error){
            console.error(error);
            res.status(500);
        } 

    },

    requestApprovalToJoin: async function(req, res, client, dbName) {
        try{
            console.log("mongo Approval to join");
            let db = client.db(dbName);
            let newGroup = {userID: req.body.userID, groupID: req.body.groupID}
            let request = await db.collection("ApprovalRequests").updateOne(newGroup, {$set: newGroup}, {upsert:true});
            res.send({requestedApproval:true, request:request});
        } catch (error){
            console.error(error);
            res.status(500);
        } 
    },

    getApprovals: async function(req, res, client, dbName) {
        try{
            console.log("mongo get approvals to join groups");
            let db = client.db(dbName);
            let request = await db.collection("ApprovalRequests").find({}).toArray();
            res.send(request);
        } catch (error){
            console.error(error);
            res.status(500);
        } 
    },

    declineApproval: async function (req, res, client, dbName, approvalID){
        try{
            console.log("Mongo Decline Approval");
            let db = client.db(dbName);
            console.log(approvalID)
            await db.collection("ApprovalRequests").deleteOne({_id: new ObjectId(approvalID)})
            res.send({"approvalDeclined":true});

        } catch (error){
            console.error(error);
            res.status(500);
        } 
    },



    joinGroup: async function(req, res, client, dbName) {

        try{
            await client.connect();
            console.log("mongo Join Group");
            let db = client.db(dbName);
            console.log(req.body)
            let removeApproval = await db.collection("ApprovalRequests").deleteOne({userID: req.body._id, groupID: req.body.groupID});
            console.log(removeApproval)
            await db.collection("Users").updateOne({"_id": new ObjectId(req.body._id)}, {$addToSet: {groups: req.body.groupID}})
            res.send({successGroupJoin:true});
        } catch (error){
            console.error(error);
            res.status(500);
        } 
    },

    leaveGroup: async function(req, res, client, dbName) {

        try{
            await client.connect();
            console.log("mongo Join Group");
            let db = client.db(dbName);
            await db.collection("Users").updateOne({"_id": new ObjectId(req.body.searchUserID[0]._id)}, {$pull: {groups: req.body.groupID}})
            res.send({successGroupLeave:true});
        } catch (error){
            console.error(error);
            res.status(500);
        } 
    },

    addChannel: async function(req, res, client, dbName) {

        try{
            await client.connect();
            console.log("mongo add channel");
            let db = client.db(dbName);

            let addChannel = await db.collection(collectionName).updateOne({id: Number(req.body.groupID)}, {$addToSet: {channels: req.body.channels}})
            res.send({ChannelSuccessAdd:true, addChannel: addChannel});

        } catch (error){
            console.error(error);
            res.status(500);
        } 
    },

    //This function deletes a group, it removes users associations to it and then deletes the group and the channels
    deleteGroup: async function(req, res, client, dbName) {

        try{
            console.log("mongo delete group");
            let db = client.db(dbName);
            //Remove any users attached to deleted group
            await db.collection("Users").updateMany(
                { groups: String(req.body.groupID) },  
                { $pull: { groups: String(req.body.groupID) } } 
              )
            //Remove Chats
            await db.collection("Chats").deleteMany(
                { "message.groupID": String(req.body.groupID)}
              )

            //Delete Group
            await db.collection(collectionName).deleteOne({id: Number(req.body.groupID)})
            res.send({"deleteGroup":true});

        } catch (error){
            console.error(error);
            res.status(500);
        } 
    },

    updateGroup: async function(req, res, client, dbName) {

        try{
            await client.connect();
            console.log("mongo add channel");
            let db = client.db(dbName);

            let addChannel = await db.collection(collectionName).updateOne({id: Number(req.body.groupID)}, {$addToSet: {channels: req.body.channels}})

        } catch (error){
            console.error(error);
            res.status(500);
        } 
    },




    seed: async function(client, dbName) {
        try{
            await client.connect();
            console.log("mongo Seed Groups");
            let db = client.db(dbName);
            await db.collection(collectionName).deleteMany({});
            await db.collection(collectionName).insertMany(groupSeedData)
        } catch (error){
            console.error(error);
        } 

    },

    fileSend: async function (req, res, next){
        const file = req.file;
        if (!file){
            const error = new Error('please upload file')
            error.httpStatusCode = 400
            return next(error)
        }
        res.send(file)
    },

    getImage: async function(req,res, next){
        var options = {
            root: path.join(__dirname, '../uploads'),
            dotfiles: 'deny',
            headers: {
              'x-timestamp': Date.now(),
              'x-sent': true
            }
          }
        
          var fileName = req.params.name
          res.sendFile(fileName, options, function (err) {
            if (err) {
              next(err)
            } 
          })
    }
}