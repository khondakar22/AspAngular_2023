import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'rk-client';
  users: Array<any> = [];
  constructor(private http: HttpClient, private accountService: AccountService) {}
  ngOnInit(): void {
    this.getUsers();
    this.setCurrentUser();
  }
  getUsers(): void { 
    this.http
    .get('https://localhost:5001/api/users')
    .subscribe({
      next: (respose: any) => this.users.push(...respose),
      error: (error: any) => console.log(error),
      complete: () => console.log('complete'),
    });
  }
  setCurrentUser() { 
    const userString  = localStorage.getItem('user'); 
    if(!userString) return;
    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
  
}
