import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card'; 
import { CommonModule } from '@angular/common';

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
  @ViewChild('targetObserver') targetObserver?: ElementRef;
  options = { rootMargin: '0px', threshold: 0.5, root: null }
  observer: IntersectionObserver = new IntersectionObserver(this.handleObserver.bind(this), this.options);
  constructor(private http: HttpClient){}
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
      
    }, (error)=>{
      this.loading = false;
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
