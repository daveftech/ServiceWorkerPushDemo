// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Register the service worker with the browser
navigator.serviceWorker.register('sw.js');

navigator.serviceWorker.ready
    .then(function (registration) {
        // When the service worker is ready, Subscribe the local service worker to the key
        return registration.pushManager.getSubscription()
            .then(async function (subscription) {
                if (subscription) {
                    return subscription;
                } else {
                    const vapidPublicKey = "BK3vYfoTOx1UvUwVGyzjUA6enowrUmvGvuGZobkBFoaKNJOt20Yr2BHEWJDUGoJx0_F4qifnyVkr7VGqVch8PHU";
                    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

                    return registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedVapidKey
                    });
                }
            });
    }).then(function (subscription) {
        // When the local service worker has been subscribed to the key, subscribe the service worker to the server/API
        subscriptionJson = JSON.stringify(subscription);
        subscriptionObj = JSON.parse(subscriptionJson);

        subscriptionModel = {
            endpoint: subscriptionObj.endpoint,
            auth: subscriptionObj.keys.auth,
            p256dh: subscriptionObj.keys.p256dh
        };

        console.log("SubscriptionModel: " + JSON.stringify(subscriptionModel));

        fetch('http://localhost:49497/Notification/Subscribe', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(subscriptionModel)
        });
    });

// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}