// client side
// main.js
// - create the global defines object
// - more TODO as we go along

// This is guranteed to be the first to be executed from our js files, 
// as long as the other js files are loaded after

// a global to share common stuff
window.defines = Object.create(null);

defines['socket-group-created'] = 'group created';
defines['socket-group-deleted'] = 'group deleted';
defines['socket-chat-message'] = 'chat message';
defines.API_VERSION = '1';
defines.DEBUG = true;
defines.socket = io();

var createGroupModal = document.querySelector('.modal#fc-create-group');
var createGroupButton = createGroupModal.querySelector('.fc-create');

createGroupButton.addEventListener('click', function(e) {
    var name = createGroupModal.querySelector('input.fc-group-name').value;
    createGroupOnServer({ name: name });
});

