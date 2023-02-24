import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};
  loggedId  = false;
  constructor(private accountService: AccountService) {}
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  login() {
    console.log('login', this.model);
    this.accountService.onLogin(this.model).subscribe({
      next: (response) => {
        console.log(response);
        this.loggedId = true;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
