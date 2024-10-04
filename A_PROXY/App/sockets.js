const connect = (io, PORT) => {
    console.log("Sockets Activated")
    
    io.on('connection', (socket)=>{
        console.log("User Connected on port: " + PORT + " " + socket);
    
        socket.on('message', (message)=>{
            io.emit('message', message);
            console.log(message)
        });
    })

}

module.exports = connect