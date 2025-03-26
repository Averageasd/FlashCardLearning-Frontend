import { HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticatedResponse } from '../../models/AuthenticatedResponse';
import { LoginModel } from '../../models/LoginModel';
import { CommonModule } from '@angular/common';
import { ParentChildDataShareServiceService } from '../../services/parent-child-data-share-service.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule,FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  credentials: LoginModel = {username:'', password:''};
  invalidLogin: boolean = false;
  private childParentDataShareComponentService = inject(ParentChildDataShareServiceService);
  ngOnInit(): void {}

  login(form: NgForm){
    if (form.valid){
      this.httpClient.post<AuthenticatedResponse>("https://localhost:7068/api/Auth", this.credentials, {
        headers: new HttpHeaders({'Content-Type':'application/json'})
      }).subscribe({
        next: (res : AuthenticatedResponse)=>{
          const token = res.token;
          localStorage.setItem('jwt', token)
          this.router.navigate(['/cards']);
          this.invalidLogin = false;
          this.childParentDataShareComponentService.jwtCheckSubject.next(true);
        },
        error : (err : HttpErrorResponse) =>{
          this.invalidLogin = true;
        }
      })
    }
  }

}
