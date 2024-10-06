const {
    ObjectId, MongoClient
} = require('mongodb');

const dbName="chatme"
const collectionName = "Chats"
const url='mongodb://localhost:27017';
const client = new MongoClient(url);

async function storeMessage( message){
    try{
        console.log("mongo Message Add");
        await client.connect()
        let db = client.db(dbName);
        await db.collection(collectionName).insertOne({"message": message}) 
    } catch (error){
        console.error(error)
    }

}

module.exports = {
    connect : async(io, PORT) => {
        io.on('connection', (socket)=>{
            console.log("User Connected on port: " + PORT + " " + socket);
        
            socket.on('message', async (message)=>{
                await storeMessage(message);
                io.emit('message', message);
                     
            });

            
            socket.on('image', async (imageData)=>{
            console.log(imageData)
                //io.emit('message', message);
                     
            });
        })
    }
}