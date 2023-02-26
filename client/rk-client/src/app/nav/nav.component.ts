import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
// import { Observable, Subscription, of } from 'rxjs';
// import { User } from '../_models/user';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  model: any = {};
  // currentUser$: Observable<User | null> = of(null);
  constructor(public router: Router, public accountService: AccountService) {}
  ngOnDestroy(): void {}
  ngOnInit(): void {
    // this.currentUser$ = this.accountService.currentUser$;
  }

  onLogout() {
    this.accountService.logout();
    this.router.navigate(['login']);
  }
}
