self.addEventListener('push', function (event) {

    // Handle redirecting focus to the correct tab
    let windowClients = clients.matchAll({ includeUncontrolled: true, type: 'window' });

    // Check if there is already a window/tab open with the target URL
    let windowFound = false;

    for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === 'http://localhost:56461/' && 'focus' in client) {
            client.focus();
            windowFound = true;
            break;
        }
    }

    // If not, then open the target URL in a new window/tab.
    if (!windowFound) {
        clients.openWindow('http://localhost:56461/');
    }

    console.log('[Service Worker] Push Received.');
    var data = event.data.json();

    const title = data.Title;
    const options = {
        body: data.Message,
        data: data.Url,
        requireInteraction: true,
        sticky: true
    };

    // Client isn't focused, we need to show a notification.
    return self.registration.showNotification(title, options);
});