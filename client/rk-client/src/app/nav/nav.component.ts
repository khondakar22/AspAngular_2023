import { Component, OnInit, OnDestroy } from '@angular/core';
import {  Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { Observable, Subscription, of } from 'rxjs';
import { User } from '../_models/user';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  model: any = {};
  // loggedId  = false;
  currentUser$: Observable<User | null> = of(null);
  currentUser!: Subscription;
  constructor(public router: Router, private accountService: AccountService) {}
  ngOnDestroy(): void {
    // this.currentUser.unsubscribe();
  }
  ngOnInit(): void {
    // this.getCurrentUser();
    this.currentUser$ = this.accountService.currentUser$;
  }

  // getCurrentUser() {
  //  this.currentUser = this.accountService.currentUser$.subscribe({
  //     next: (user) =>{ this.loggedId = !!user; },
  //     error: (err) => { console.log(err); },
  //     complete: () => { console.log(this.loggedId); }
  //   }
  //   )
  //  }

  onLogout(){
    // localStorage.removeItem('isLoggedIn');
    this.accountService.logout();
    // this.loggedId = false;
    this.router.navigate(['home']);
  }

}
