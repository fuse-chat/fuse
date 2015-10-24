var start = function() {
    var socket = io();
    var form = document.querySelector('form');
    var message = document.querySelector('#m');
    var messages = document.querySelector('#messages');

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
};

document.addEventListener('DOMContentLoaded', start);
