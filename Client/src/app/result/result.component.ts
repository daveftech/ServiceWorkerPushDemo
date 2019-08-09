import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  result: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.result = this.route.snapshot.paramMap.get('result');
  }

}
