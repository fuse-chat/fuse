module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on('chat message', function(obj) {
            console.log('message: ' + obj.message.body);
            io.emit('chat message', obj);
        });
    });
};
