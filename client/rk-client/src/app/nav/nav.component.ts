import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};
  loggedId  = false;
  constructor(public router: Router) {}
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.loggedId = localStorage.getItem('isLoggedIn') === 'true';
    console.log(this.loggedId);
  }

  onLogout(){
    localStorage.removeItem('isLoggedIn');
    this.ngOnInit();
    this.router.navigate(['/login-components']);
  }

}
