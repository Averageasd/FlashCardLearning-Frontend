import { CommonModule } from '@angular/common';
import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppComponent } from '../app.component';
import { ParentChildDataShareServiceService } from '../../services/parent-child-data-share-service.service';

@Component({
  selector: 'app-entry',
  imports: [RouterModule, CommonModule, AppComponent],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.css',
})
export class EntryComponent implements OnInit {
  private childParentDataShareComponentService = inject(
    ParentChildDataShareServiceService
  );
  ngOnInit(): void {
    this.childParentDataShareComponentService.$jwtCheckObservable$.subscribe(
      (data) => {
        if (data) {
          this.isUserAuthentiated();
          if (this.isAuthenticated) {
            this.router.navigate(['/cards']);
          }
        }
      }
    );
  }

  private jwtUtility = inject(JwtHelperService);
  private router = inject(Router);
  isAuthenticated = false;

  isUserAuthentiated(): void {
    const token = localStorage.getItem('jwt');
    if (token && !this.jwtUtility.isTokenExpired(token)) {
      console.log(this.jwtUtility.decodeToken(token).userid);
      this.isAuthenticated = true;
      return;
    } else {
      this.isAuthenticated = false;
    }
  }

  logOut(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
    this.childParentDataShareComponentService.jwtCheckSubject.next(true);
  }
}
