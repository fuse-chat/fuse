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
    var parent = document.createElement('div');
    parent.classList.add('message-wrapper');

    var senderNode = document.createElement('div');
    var messageNode = document.createElement('div');
    senderNode.classList.add('sender');
    messageNode.classList.add('message');

    senderNode.textContent = obj.sender.name;
    messageNode.textContent = obj.messageBody;

    parent.appendChild(senderNode);
    parent.appendChild(messageNode);

    return parent;
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
