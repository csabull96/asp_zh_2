import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../login-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient,
    private router: Router) { }

  login(username: HTMLInputElement, password: HTMLInputElement) {
    const user = new User();
    user.username = username.value;
    user.password = password.value;

    this.http.post<LoginResponse>(
      "https://localhost:5001/login", 
      user).subscribe(response => {
        const token = response.token;
        if (token) {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('username', user.username)
          this.router.navigate(['/chat']);
        }
      }, error => {
        if (error.status.toString() === '401') {
          window.alert("Invalid credentials.")
        } else {
          window.alert("Unknown error occured.")
        }
      });
  }

  ngOnInit(): void {
  }

}
