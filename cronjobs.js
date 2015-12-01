const CronJob = require('cron').CronJob;
const Database = require('./database.js');
const database = Object.create(Database).init();

const MillisecondsInOneDay = 24*60*60*1000;

module.exports = function() {
    new CronJob('0 * * * *', function() {
      console.log('cleaning up old groups');
      database.getAllGroups(function(err, groups) {
        if (err) {
            return;
        }

        var current = Date.now();
        groups.forEach(function(group) {
            if ((current - group.timestamp) > 2*MillisecondsInOneDay) {
                (function() {
                    database.deleteGroupById({id: group.id}, function(err, res) {
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
