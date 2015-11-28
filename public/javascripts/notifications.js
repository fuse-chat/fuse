const Notif = {};

Notif.defaultIcon = './images/favicon.png'

Notif.prepare = function() {
    if (Notification.permission === 'denied' || Notification.permission === 'granted') {
        return;
    }

    Notification.requestPermission();
};

Notif.show = function(title, body, icon) {
    return new Notification(title, {
        body: body,
        icon: icon || Notif.defaultIcon
    });
};

// Scan incoming messages for hotword
// and if notifications are on, show a desktop notification
defines.socket.on(defines['socket-chat-message'], function(obj) {
    // TODO: filter out messages from self
    
    if (Pref.isNotificationsEnabled()) {
        var messageBody = obj.message.body;
        var hotwords = Pref.hotwords();

        var matchedHotword;
        var match = hotwords.some(function(hotword) {
            if (messageBody.indexOf(hotword) !== -1) {
                matchedHotword = hotword;
                return true;
            }

            return false;
        });

        if (match) {
            Notif.show(`New message with hotword: ${matchedHotword}!`, messageBody);
        }
    }
});
