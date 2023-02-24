import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor() {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  login() {
    console.log('login', this.model);
  }
}
