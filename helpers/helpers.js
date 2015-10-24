const app_root_path = require('app-root-path').path;

var assert = function(cond, str) {
    var app = require(app_root_path + '/app.js');

    if (app.get('env') === 'development' ||
        app.get('env') === 'test') {
        if (!cond) {
            throw new Error(str);
        }
    }
};

module.exports = {
    assert: assert
};
