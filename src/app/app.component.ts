import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AfterViewChecked, Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ParentChildDataShareServiceService } from '../services/parent-child-data-share-service.service';

@Component({
  selector: 'app-root',
  imports: [ScrollingModule, MatCardModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit, AfterViewChecked{
  title = 'FlashCardLearning-Frontend';
  flashCards: any[] = [];
  private readonly LAST_SEEN_ID = 'LastSeenId';
  private readonly LAST_SEEN_NAME = 'LastSeenName';
  private readonly LAST_SEEN_SEARCHTYPE = 'LastSeenSearchType';
  private readonly LAST_SEEN_DATETIME = 'LastSeenDateTime';
  private loadCardParams: HttpParams = new HttpParams()
  .append(this.LAST_SEEN_ID, 0)
  .append(this.LAST_SEEN_NAME,'')
  .append(this.LAST_SEEN_SEARCHTYPE,'')
  .append(this.LAST_SEEN_DATETIME,'');

  private loading: boolean = false;
  private router = inject(Router);
  private http = inject(HttpClient);
  private childParentDataShareComponentService = inject(ParentChildDataShareServiceService);

  @ViewChild('targetObserver') targetObserver?: ElementRef;
  private options = { rootMargin: '0px', threshold: 0.5, root: null }
  private observer: IntersectionObserver = new IntersectionObserver(this.handleObserver.bind(this), this.options);

  constructor(){}
  ngAfterViewChecked(): void {
    if (this.targetObserver) {
      this.observer.observe(this.targetObserver?.nativeElement);
    }
  } 

  ngOnInit(): void {
    this.loadData();
  }

  handleObserver(entries: any[]) {
    entries.forEach(entry => {
      const {
        boundingClientRect,
        intersectionRatio,
        intersectionRect,
        isIntersecting,
        rootBounds,
        target,
        time
      } = entry;
      console.log(entry);
      if (isIntersecting) {
          this.updateParams();
          this.loadData();
      }
    })

  };


  private loadData():void {
    console.log("load data triggered");
    if (this.loading){
      return;
    }
    this.loading = true;
    this.http.get<any[]>(`https://localhost:7068/api/FlashCard`, {params: this.loadCardParams}).subscribe(x=> {
      if (x.length > 0){
        this.flashCards = [...this.flashCards, ...x];
      }
      this.loading = false;
      
    }, (error: Error)=>{
      this.loading = false;
      if (error instanceof HttpErrorResponse){
        if (error.status === 401){
          console.log('http error ',error.status);
          localStorage.removeItem('jwt');
          this.router.navigate(['/']);
          this.childParentDataShareComponentService.checkJwtFromChildComponent(true);    
        }
      }
      else{
        window.location.reload();
      }
    });
  }

  updateParams(){
    const lastSeenItem:any = this.flashCards[this.flashCards.length-1];
    this.loadCardParams = this.loadCardParams
      .set(this.LAST_SEEN_ID, lastSeenItem.id)
      .set(this.LAST_SEEN_NAME,lastSeenItem.name)
      .set(this.LAST_SEEN_SEARCHTYPE,lastSeenItem.type)
      .set(this.LAST_SEEN_DATETIME,lastSeenItem.createdDate);
  }

}
