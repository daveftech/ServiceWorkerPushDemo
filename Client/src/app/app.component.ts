import { Component } from '@angular/core';
import { NotificationMiddlewareService } from './notification-middleware.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'NotificationDemo';

  constructor(private _notifications: NotificationMiddlewareService) {

  }

  initSub() {
    this._notifications.init();
  }

  subscribe() {
    this._notifications.subscribeUser();
  }

  unsubscribe() {
    this._notifications.unsubscribe();
  }

}



