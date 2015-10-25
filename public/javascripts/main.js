// client side
// main.js
// - create the global defines object
// - routing using page.js
// - more TODO as we go along

// This is guranteed to be the first to be executed from our js files, 
// as long as the other js files are loaded after

const main = {};

// a global to share common stuff
main.defines = Object.create(null);
window.defines = main.defines;

defines['socket-group-created'] = 'group created';
defines['socket-group-deleted'] = 'group deleted';
defines['socket-chat-message'] = 'chat message';

defines.API_VERSION = '1';
defines.DEBUG = true;
defines.socket = io();

// TODO: This part will be used to fetch the messages for the current group url
// from the server. Eventually, the code should be moved to router.js and chat.js

var path = document.location && document.location.pathname;
var pathComponents = path.split(/\//).filter(function(c) {
    return !_.isEmpty(c);
});

if (pathComponents[0] === 'group') {
    var groupName = pathComponents[1];
    console.log(groupName);
    
    $.get('/api/1/groups/' + groupName, {
        name: groupName
    }, function(d) { console.log(d); });
};

