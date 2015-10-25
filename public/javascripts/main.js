var DEBUG = true;

var createGroup = function(params) {
    var defaultParams = {
        name: null,
        description: null
    };

    var params = toolbelt.base.normalize(params, defaultParams);

    var handleResponse = function(data) {
        console.log(data);
    };

    $.post('/api/1/groups', {
        name: name
    }, handleResponse);
};

var start = function() {
    var socket = io();

    var form = document.querySelector('form#fc-message-form');
    var messageInput = document.querySelector('#fc-m');
    var messages = document.querySelector('#fc-messages');
    console.log(form, messages, messageInput)
    var createGroupModal = document.querySelector('.modal#fc-create-group');
    var createGroupButton = createGroupModal.querySelector('.fc-create');

    form.addEventListener('submit', function(e) {
        socket.emit('chat message', { message: { body: messageInput.value } });
        messageInput.value = '';
        return toolbelt.event.stop(e);
    });

    socket.on('chat message', function(obj) {
        var li = document.createElement('li');
        li.textContent = obj.message.body;
        messages.appendChild(li);
    });

    createGroupButton.addEventListener('click', function(e) {
        var name = createGroupModal.querySelector('input.fc-group-name').value;
        createGroup(name);
    });
};

document.addEventListener('DOMContentLoaded', start);
