const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Message = require(app_root_path + '/models/message.js');

const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');

module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on(defines['socket-chat-message'], function(obj) {
            console.log('message: ' + obj.message.body);
			var m = Object.create(Message).init(obj.message.body); //TODO: add sender to this?
			
			groupsdb.update({id: obj.message.groupid}, {'$push':{messages:m}}, function(err, item) {
				if (err) {
				    throw err;
				}
			});

            io.emit(defines['socket-chat-message'], obj);
        });
    });
};
