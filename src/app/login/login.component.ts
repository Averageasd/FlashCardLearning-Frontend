import { HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticatedResponse } from '../../models/AuthenticatedResponse';
import { LoginModel } from '../../models/LoginModel';

@Component({
  selector: 'app-login',
  imports: [RouterModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  credentials: LoginModel = {username:'', password:''};
  ngOnInit(): void {}

  login(form: NgForm){
    if (form.valid){
      this.httpClient.post<AuthenticatedResponse>("https://localhost:7068/api/Auth", this.credentials, {
        headers: new HttpHeaders({'Content-Type':'application/json'})
      }).subscribe({
        next: (res : AuthenticatedResponse)=>{
          const token = res.token;
          localStorage.setItem('jwt', token)
          this.router.navigate(['/']);
        },
        error : (err : HttpErrorResponse) =>{
          
        }
      })
    }
  }

}
