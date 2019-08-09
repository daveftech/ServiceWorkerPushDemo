import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css']
})
export class BroadcastComponent implements OnInit {

  Url: string;
  Title: string;
  Message: string;

  constructor(private _subscription: SubscriptionService) { }

  ngOnInit() {
  }

  Broadcast() {
    const notification = { message: this.Message, url: this.Url, title: this.Title };
    console.log(this.Message);
    this._subscription.broadcast(notification).subscribe(
      () => {

      }
    );
  }

}
