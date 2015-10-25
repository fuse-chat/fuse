const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');

module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on(defines['socket-chat-message'], function(obj) {
            console.log('message: ' + obj.message.body);
            io.emit(defines['socket-chat-message'], obj);
        });
    });
};
