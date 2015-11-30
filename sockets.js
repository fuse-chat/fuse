const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Message = require(app_root_path + '/models/message.js');
const Database = require(app_root_path + '/database');

database = Object.create(Database).init();

module.exports = function(io) {
    io.on('connection', function(socket) {
        // handle incoming messages
        socket.on(defines['socket-chat-message'], function(obj) {
            console.log('socket: message: ' + obj.messageBody);

            // get the sender of the message
            // create a message with the sender field initialized
            // add the message to the correct group in the db
            database.getUserById(obj.senderId, function(err, user) {
                if (err) {
                    throw err;
                }

                var message = Object.create(Message).init(obj.messageBody, user);
                database.addMessageToGroupById(message, obj.groupId);
                
                obj.sender = user;
                
                io.emit(defines['socket-chat-message'], obj);
            });
        });
    });
};
