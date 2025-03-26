import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParentChildDataShareServiceService {

  jwtCheckSubject = new BehaviorSubject<boolean>(true);
  $jwtCheckObservable$ = this.jwtCheckSubject.asObservable();
  constructor() { 

  }

  checkJwtFromChildComponent(checkJwt: boolean): void{
    this.jwtCheckSubject.next(checkJwt);
  }
}
