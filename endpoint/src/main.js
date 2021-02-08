let express = require('express');
let application = express();
let server = require('http').Server(application);

server.listen(3000);

console.log('============= Server started ===============');

let io = require('socket.io')(server, {});

io.sockets.on('connection', function(socket) {

    console.log('Socket connection');

});