const CronJob = require('cron').CronJob;
const Database = require('./database.js');
const database = Object.create(Database).init();

const MillisecondsInOneDay = 24*60*60*1000;
const Days = 1;

module.exports = function() {
    new CronJob('0 * * * *', function() {
      console.log('cleaning up old groups');
      database.getAllGroups(function(err, groups) {
        if (err) {
            return;
        }

        var current = Date.now();
        groups.forEach(function(group) {
            var lastMessage = group.messages.length > 0 ? group.messages[group.messages.length-1] : null;
            
            if (lastMessage == null) { // check group creation time
                if ((current - group.timestamp) > Days*MillisecondsInOneDay) {
                    (function() {
                        database.deleteGroupById({id: group.id}, function(err, res) {
                            if (err) {
                                return;
                            }

                            console.log('removed group', group)
                        });
                    })(group); // closure over group
                }
            } else {
                if ((current - lastMessage.timestamp) > Days*MillisecondsInOneDay) {
                    (function() {
                        database.deleteGroupById({id: group.id}, function(err, res) {
                            if (err) {
                                return;
                            }

                            console.log('removed group', group)
                        });
                    })(group); // closure over group
                }
            }
        });
      });
    }, null, true, 'America/Chicago');
};
