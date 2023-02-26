import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  registrationForm: FormGroup;
  loginForm: FormGroup;
  isRegistrationForm = false;
  isLoggedIn = false;
  constructor(private accountService: AccountService, public router: Router){
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });
    this.registrationForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      confirmPassword: new FormControl('')
    });
  }
  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }
  onTabChange(event : MatTabChangeEvent) {
    console.log(event.tab.textLabel);
    if (event.tab.textLabel === 'Login') {
      this.isRegistrationForm = false; 
    }
    if (event.tab.textLabel === 'Register') {
      this.isRegistrationForm = true;
    } 
  }
 
  onLogin() {
    console.log(this.loginForm.value);
    this.accountService.onLogin(this.loginForm.value).subscribe({
      next: (response: any) => {
        if(response && response.username === this.loginForm.value.username) {
          localStorage.setItem('isLoggedIn', 'true');
          this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
          this.router.navigate(['/']);
        }
      },
      error: (err) => {console.log(err)},
      complete: () => {console.log('complete')}
    });
  }
  onRegistration(){
    console.log(this.registrationForm.value);
  }
}
