import {  Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  registrationForm: FormGroup ;
  loginForm: FormGroup ;
  isRegistrationForm = false;
  // isLoggedIn = false;
  currentUser$: Observable<User | null> = of(null);
  currentUser!: Subscription;
  constructor(private accountService: AccountService, public router: Router, private toastr: ToastrService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('' , Validators.required),
    });
    this.registrationForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('' , Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      firstname: new FormControl('' , Validators.required),
      lastname: new FormControl('',  Validators.required),
      gender: new FormControl(''),
      confirmpPassword: new FormControl('', [Validators.required, this.matchValues('password')])
    });
    this.registrationForm?.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registrationForm?.controls['confirmpassword']?.updateValueAndValidity()}
    })

  }
  ngOnInit(): void {
    // this.getCurrentUser();
    this.currentUser$ = this.accountService.currentUser$;
    // this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }


  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true}
    }
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
        console.log(response);
        if(response && response.username === this.loginForm.value.username) {
          console.log(response);
          this.currentUser$ = this.accountService.currentUser$;
          this.router.navigateByUrl('/');
        }
      },
      error: (_err) => {},
      complete: () => {this.toastr.success('Welcome to the app')}
    });
  }
  onRegistration(){
    console.log(this.registrationForm.value);
    this.accountService.onRegister(this.registrationForm.value).subscribe({
      next: (response: any) => {
        console.log(response);
        this.currentUser$ = this.accountService.currentUser$;
        this.router.navigateByUrl('/');
      },
      error: (err) => {this.toastr.error(err.error)},
      complete: () => {this.toastr.success('Thank you for registering')}
    })
  }
}
