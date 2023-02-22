import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'rk-client';
  users: Array<any> = [];
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http
      .get(' https://localhost:5001/api/users')
      .subscribe({
        next: (respose: any) => this.users.push(...respose),
        error: (error: any) => console.log(error),
        complete: () => console.log('complete'),
      });
  }
}
