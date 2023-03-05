import {  Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  minDate: Date = new Date();
  // isLoggedIn = false;
  currentUser$: Observable<User | null> = of(null);
  currentUser!: Subscription;
  constructor(private accountService: AccountService,
     public router: Router, private toastr: ToastrService,
     public fb: FormBuilder) {
    this.registrationForm = new FormGroup({});
    this.loginForm = new FormGroup({});
  }
  ngOnInit(): void {
    // this.getCurrentUser();
    this.initalizeForms();
    this.currentUser$ = this.accountService.currentUser$;
    this.minDate.setFullYear(this.minDate.getFullYear() - 18);
    // this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  initalizeForms() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['' , Validators.required],
    });
    this.registrationForm = this.fb.group({

        username: ['', Validators.required],
        email: ['' , Validators.required],
        firstname: ['' , Validators.required],
        lastname: ['',  Validators.required],
        knownAs: ['',  Validators.required],
        dateOfBirth: ['',  Validators.required],
        city: ['',  Validators.required],
        country: ['',  Validators.required],
        gender: [''],
        password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
        confirmpPassword: ['', [Validators.required, this.matchValues('password')]]

    });
    this.registrationForm?.controls?.['password'].valueChanges.subscribe(() => {
      this.registrationForm?.controls?.['confirmpPassword'].updateValueAndValidity();
    })
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
