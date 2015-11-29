// client side
// chat.js
// - handle incoming chat messages
// - notify to the server the messages sent by the client
// - manage ui


var form = document.querySelector('form#fc-message-form');
var messageInput = document.querySelector('#fc-m');
var messages = document.querySelector('#fc-messages');
console.log(form, messages, messageInput)

const Chat = {};

Chat.makeMessageNode = function(obj) {
    var node = document.createElement('li');
    node.textContent = obj.senderId + ': ' + obj.messageBody;
    return node;
};

form.addEventListener('submit', function(e) {
    var node = G.queryGroupSelected();
	if (node == null) return toolbelt.event.stop(e);

	var groupId = node.dataset.id;
    var senderId = document.querySelector('body').dataset['userid'];

    defines.socket.emit(defines['socket-chat-message'], { 
        messageBody: messageInput.value,
        groupId: groupId,
        senderId: senderId
    });

    messageInput.value = '';
    return toolbelt.event.stop(e);
});

defines.socket.on(defines['socket-chat-message'], function(obj) {
    var node = G.queryGroupSelected();
	if (node == null) return;

	if (node.dataset.id === obj.groupId) {
		messages.appendChild(Chat.makeMessageNode(obj));
	}
});
