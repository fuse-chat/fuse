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
            
            // if there is a message, check the time since last message
            // if there are no messages, check the group creation time
            var targetTime;
            if (lastMessage != null) {
                targetTime = current - lastMessage.timestamp;
            } else {
                targetTime = current - group.timestamp;
            }
            
            if (targetTime > MillisecondsInOneDay) {
                (function(group) {
                    database.deleteGroupById(group.id, function(err, res) {
                        if (err) {
                            return;
                        }

                        console.log('removed group', group)
                    });
                })(group); // closure over group 
            }
        });
      });
    }, null, true, 'America/Chicago');
};
