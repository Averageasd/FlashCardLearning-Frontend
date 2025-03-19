import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CdkVirtualScrollViewport, ScrollingModule} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScrollingModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'FlashCardLearning-Frontend';
  flashCards: any[] = [];
  private loading: boolean = false;
  @ViewChild('flashcardVirtualList') scrollViewport!: CdkVirtualScrollViewport;
  constructor(private http: HttpClient){}
  ngAfterViewInit(): void {
    this.loadData();
  }

  ngOnInit(): void {

  }

  private loadData():void {
    console.log("load data triggered");
    if (this.loading){
      return;
    }
    this.loading = true;
    this.http.get<any[]>('https://localhost:7068/api/FlashCard').subscribe(x=> {
      this.flashCards = [...this.flashCards, ...x];
      console.log(this.flashCards);
      this.loading = false;
    }, (error)=>{
      this.loading = false;
    });
  }

  onScroll(index: number):void {
    const end = this.scrollViewport.getRenderedRange().end;
    const total = this.scrollViewport.getDataLength();
    if (end === total){
      this.loadData();
    }
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}
