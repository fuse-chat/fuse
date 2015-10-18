var start = function() {
    var socket = io();
    var form = document.querySelector('form');
    var message = document.querySelector('#m');
    var messages = document.querySelector('#messages');

    form.addEventListener('submit', function(e) {
        socket.emit('chat message', m.value);
        m.value = '';
        return toolbelt.event.stop(e);
    });

    socket.on('chat message', function(msg) {
        var li = document.createElement('li');
        li.textContent = msg;
        messages.appendChild(li);
    });
};

document.addEventListener('DOMContentLoaded', start);
