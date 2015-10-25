// client side
// chat.js
// - handle incoming chat messages
// - notify to the server the messages sent by the client
// - manage ui


var form = document.querySelector('form#fc-message-form');
var messageInput = document.querySelector('#fc-m');
var messages = document.querySelector('#fc-messages');
console.log(form, messages, messageInput)

form.addEventListener('submit', function(e) {
    defines.socket.emit(defines['socket-chat-message'], { message: { body: messageInput.value } });
    messageInput.value = '';
    return toolbelt.event.stop(e);
});

defines.socket.on(defines['socket-chat-message'], function(obj) {
    var li = document.createElement('li');
    li.textContent = obj.message.body;
    messages.appendChild(li);
});
