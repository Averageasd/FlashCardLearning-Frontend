import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ScrollingModule} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScrollingModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit{
  title = 'FlashCardLearning-Frontend';
  flashCards: any[] = [];

  constructor(private http: HttpClient){}
  ngOnInit(): void {
    this.http.get<any[]>('https://localhost:7068/api/FlashCard').subscribe(x=> {
      this.flashCards = x;
    });
  }
}
