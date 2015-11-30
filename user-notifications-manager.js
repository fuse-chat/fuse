const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Message = require(app_root_path + '/models/message.js');
const Database = require(app_root_path + '/database');

database = Object.create(Database).init();

var makeNotificationMessage = function(hotword, groupName) {
    return `"${hotword}" mentioned in ${groupName}`
};

var handler = function(io) {
    io.on('connection', function(socket) {
        socket.on(defines['socket-chat-message'], function(obj) {
            database.getAllUsers(function(err, users) {
                if (err) {
                    throw err;
                }

                var messageBody = obj.messageBody;

                // go over each user
                // and add notifications to their list
                users.forEach(function(user) {
                    var match;
                    var matchedHotword;
                    var matchedGroupId;

                    match = user.preferences.hotwords.some(function(hotword) {
                        if (messageBody.indexOf(hotword) !== -1) {
                            matchedHotword = hotword;
                            matchedGroupId = obj.groupId;
                            return true;
                        }
                    });

                    (function(user, matchedHotword, matchedGroupId) {
                        if (match) {
                            database.getGroupByID(matchedGroupId, function(err, group) {
                                if (err) {
                                    throw err;
                                }

                                if (group == null) {
                                    console.log('group not found for id', matchedGroupId);
                                    return;
                                }

                                var notificationBody = makeNotificationMessage(matchedHotword, group.name);
                                database.addBellNotificationToUserById({ text: notificationBody, groupName: group.name }, user.id);
                            });
                        }
                    })(user, matchedHotword, matchedGroupId); // need closure over the variable since the db lookup is async
                });
            })
        });
    });
};

module.exports = handler;
