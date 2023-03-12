import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  constructor(public router: Router, public accountService: AccountService) {}

  onLogout() {
    this.accountService.logout();
    this.router.navigateByUrl('/login');
  }
}
