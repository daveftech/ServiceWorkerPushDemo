import { Injectable } from '@angular/core';
import { SubscriptionService, PushSubscription } from './subscription.service';

import {delay} from 'rxjs/operators';

import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationMiddlewareService {

  public pushNotificationStatus = {
    isSubscribed: false,
    isSupported: false,
    isInProgress: false
  };

  private swRegistration = null;
  public notifications = [];

  init() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/assets/sw.js')
        .then(swReg => {
          console.log('Service Worker is registered', swReg);

          this.swRegistration = swReg;
          this.checkSubscription();
        })
        .catch(error => {
          console.error('Service Worker Error', error);
        });
      this.pushNotificationStatus.isSupported = true;
    } else {
      this.pushNotificationStatus.isSupported = false;
    }

    navigator.serviceWorker.addEventListener('message', (event) => {
      this.notifications.push(event.data);
    });

  }

  subscribeUser() {
    console.log('subscribe user');
    this.pushNotificationStatus.isInProgress = true;
    const applicationServerKey = this.urlB64ToUint8Array(environment.applicationServerPublicKey);



        const options = {
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        };
        console.log(options);
        this.swRegistration.pushManager.subscribe(options)
          .then((subscription: any) => {
            console.log(subscription);
            console.log(JSON.stringify(subscription));
            const newSub = JSON.parse(JSON.stringify(subscription));
            console.log(newSub);
            this.notificationService.subscribe(<PushSubscription>{
              auth: newSub.keys.auth,
              p256Dh: newSub.keys.p256dh,
              endPoint: newSub.endpoint
            }).subscribe(s => {
              this.pushNotificationStatus.isSubscribed = true;
            });
          })
          .catch((err: any) => {
            console.log('Failed to subscribe the user: ', err);
          })
          .then(() => {
            this.pushNotificationStatus.isInProgress = false;
          });
      }


  unsubscribe() {
    this.swRegistration.pushManager.getSubscription()
    .then(subscription => {

      this.pushNotificationStatus.isSubscribed = !(subscription === null);

      if (this.pushNotificationStatus.isSubscribed === true) {
        const currentSub = JSON.parse(JSON.stringify(subscription));
        this.notificationService.unsubscribe(<PushSubscription>{
          auth: currentSub.keys.auth,
          p256Dh: currentSub.keys.p256dh,
          endPoint: currentSub.endpoint
        }).subscribe(() => {
          this.pushNotificationStatus.isSubscribed = false;
        });
      }

    });
  }


  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  checkSubscription() {
    this.swRegistration.pushManager.getSubscription()
      .then(subscription => {

        this.pushNotificationStatus.isSubscribed = !(subscription === null);

        if (this.pushNotificationStatus.isSubscribed === false) {
          this.subscribeUser();
        }

      });



  }

  constructor(private notificationService: SubscriptionService  ) { }
}



