const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Message = require(app_root_path + '/models/message.js');
const Database = require(app_root_path + '/database');

database = Object.create(Database).init();

module.exports = function(io) {
  io.on('connection', function(socket) {
    socket.on(defines['socket-chat-message'], function(obj) {
      console.log('message: ' + obj.message.body);
      var m = Object.create(Message).init(obj.message.body); //TODO: add sender to this?
      database.addMessageToGroupById(m, obj.message.groupid);
      io.emit(defines['socket-chat-message'], obj);
    });
  });
};
