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
	var groupID;
	var senderID; //TODO: We need login or some way of distinguishing different users

    var node = G.queryGroupSelected();
	if (node == null) return toolbelt.event.stop(e);

	groupID = node.dataset.id;

    defines.socket.emit(defines['socket-chat-message'], { message: { body: messageInput.value, groupid: groupID, senderid: senderID} });
    messageInput.value = '';
    return toolbelt.event.stop(e);
});

defines.socket.on(defines['socket-chat-message'], function(obj) {
    var node = G.queryGroupSelected();
	if (node == null) return;

	if(node.dataset.id === obj.message.groupid){
		var li = document.createElement('li');
		li.textContent = obj.message.body;
		messages.appendChild(li);
	}
});
