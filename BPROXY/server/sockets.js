module.exports = {
    connect: function(io, PORT){
        io.on('connection', (socket)=>{
            console.log("User Connected on port: " + PORT + " " + socket);
        
            socket.on('message', (message)=>{
                io.emit('message', message);
                console.log(message)
            });
        })

    }
}