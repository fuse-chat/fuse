var createGroup = function(name) {
    var handleResponse = function(data) {
        console.log(data);
    };

    $.post('/api/1/groups', {
        name: name
    }, handleResponse);
};

var start = function() {
    var socket = io();

    var form = document.querySelector('form');
    var message = document.querySelector('#m');
    var messages = document.querySelector('#messages');

    var createGroupModal = document.querySelector('.modal#create-group');
    var createGroupButton = createGroupModal.querySelector('.create');

    form.addEventListener('submit', function(e) {
        socket.emit('chat message', { message: { body: m.value } });
        m.value = '';
        return toolbelt.event.stop(e);
    });

    socket.on('chat message', function(obj) {
        var li = document.createElement('li');
        li.textContent = obj.message.body;
        messages.appendChild(li);
    });

    createGroupButton.addEventListener('click', function(e) {
        var name = createGroupModal.querySelector('input.group-name').value;
        createGroup(name);
    });
};

document.addEventListener('DOMContentLoaded', start);
