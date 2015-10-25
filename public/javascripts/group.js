// client side
// group.js
// - handle create and removed groups
// - handle ui changes when groups are crated and removed

defines['groups-url-base'] = `/api/${defines.API_VERSION}/groups`;

/**
 * Create a group with the params
 */
var createGroupOnServer = function(params) {
    var defaultGroupParams = { name: '', description: '' };
    params = toolbelt.base.normalize(params, defaultGroupParams);
    $.post(defines['groups-url-base'], params, handleResponse);
};

var createGroupModal = document.querySelector('.modal#fc-create-group');
var createGroupButton = createGroupModal.querySelector('.fc-create');

createGroupButton.addEventListener('click', function(e) {
    var name = createGroupModal.querySelector('input.fc-group-name').value;
    createGroupOnServer({ name: name });
});

// handle newly created group events from the server
defines.socket.on(defines['socket-group-created'], function(data) {
    console.log(data);
});

// handle group removed events from the server
defines.socket.on(defines['socket-group-removed'], function(data) {
    console.log(data);
});
