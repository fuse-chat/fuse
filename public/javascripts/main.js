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

document.addEventListener('load', function() {
    // Initialize notifications for future use
    Notif.prepare();
});
