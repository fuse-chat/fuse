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

