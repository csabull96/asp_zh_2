import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse } from '../login-response';
import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  register(email: HTMLInputElement, password: HTMLInputElement) {
    const user = new User();
    user.username = email.value;
    user.password = password.value;

    this.http.post<LoginResponse>(
      "https://localhost:5001/register", 
      user).subscribe(response => {
        const token = response.token;
        if (token) {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('username', user.username)
          this.router.navigate(['/chat']);
        }
      }, error => {
        window.alert("Registration failed for an unknown reason.")
      });
  }

  
}
