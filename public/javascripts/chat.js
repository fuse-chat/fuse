// client side
// chat.js
// - handle incoming chat messages
// - notify to the server the messages sent by the client
// - manage ui

const Chat = {};

Chat.makeMessageNode = function(obj) {
    var parent = document.createElement('div');
    parent.classList.add('message-wrapper');

    parent.innerHTML = `
    <div class="photo" style="background-image:url(${obj.sender.photoUrl})"></div>
    <div>
        <div class="upper-row">
            <div class="sender">${obj.sender.name}</div>
            <div class="timestamp">${new Date(obj.message.timestamp).toString()}</div>
        </div>
        <div class="message">${obj.messageBody}</div>
    </div>
    `
    return parent;
};

Chat.makeGifNode = function(obj) {
    var parent = document.createElement('div');
    parent.classList.add('message-wrapper');

    parent.innerHTML = `
    <div class="photo" style="background-image:url(${obj.sender.photoUrl})"></div>
    <div>
        <div class="upper-row">
            <div class="sender">${obj.sender.name}</div>
            <div class="timestamp">${new Date(obj.message.timestamp).toString()}</div>
        </div>
        <div class="message"><img src="${obj.messageBody}"></div>
    </div>
    `
    return parent;
};

window.addEventListener('load', function(e) {
    var form = document.querySelector('form#fc-message-form');

    form.addEventListener('submit', function(e) {
        var messageInput = document.querySelector('#fc-m');

        var node = G.queryGroupSelected();
    	if (node == null) return toolbelt.event.stop(e);

    	var groupId = node.dataset.id;
        var senderId = document.querySelector('body').dataset['userid'];

        var rawMessage = messageInput.value.trim();
        
        if (rawMessage.length === 0) {
            return toolbelt.event.stop(e);
        }

        var isGif = false;
        var messageBody = rawMessage;

        if (rawMessage.substring(0,4).toLowerCase() === '/gif') {
            var fields = rawMessage.substring(4).split(/\s/).map(s => s.trim()).filter(s => s.length > 0);

            isGif = true;
            messageBody = fields[0];
        };

        defines.socket.emit(defines['socket-chat-message'], { 
            messageBody: messageBody,
            groupId: groupId,
            senderId: senderId,
            isGif: isGif
        });

        messageInput.value = '';
        return toolbelt.event.stop(e);
    });
});

defines.socket.on(defines['socket-chat-message'], function(obj) {
    var groupToUpdateNumber = G.getGroupById(obj.groupId);
    if (groupToUpdateNumber != null) {
        var numberNode = groupToUpdateNumber.querySelector('.fc-group-list-item-number');
        numberNode.textContent = parseInt(numberNode.textContent, 10) + 1;
    }

    // Add message to list of messages in the main chat view
    // if it's the group in view

    var messages = document.querySelector('#fc-messages');
    var node = G.queryGroupSelected();
	
    if (node == null)  {
        return;
    }

	if (node.dataset.id === obj.groupId) {
		var appendNode = obj.isGif ? Chat.makeGifNode(obj) : Chat.makeMessageNode(obj)
        messages.appendChild(appendNode);
	}
});
