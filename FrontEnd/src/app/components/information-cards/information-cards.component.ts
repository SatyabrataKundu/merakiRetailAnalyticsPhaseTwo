import { Component, OnInit, Input } from '@angular/core';
import { Observable, interval} from 'rxjs';
import { timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'information-cards',
  templateUrl: './information-cards.component.html',
  styleUrls: ['./information-cards.component.scss']
})
export class InformationCardsComponent implements OnInit {
  @Input() products$: Observable<any>;
  temp : any;
  currentVisitor : any;
  totalAmount : any;
  totalVisitors : any;
  totalCheckouts : any;
  constructor(private http : HttpClient) { 
    
  }

 
  ngOnInit() {
    
    Observable
    timer(500, 1000 * 10).subscribe(() => {
      this.http.get('http://localhost:4004/api/v0/meraki/scanning/currentVisitorCount')
      .subscribe(res => {
        this.temp = res;
        this.currentVisitor = this.temp[0].visitor_count;
      })

      this.http.get('http://localhost:4004/api/v0/meraki/posSimulator/totalAmount')
      .subscribe(res => {
        this.temp = res;
        this.totalAmount = this.temp[0].sum;
      })

    this.http.get('http://localhost:4004/api/v0/meraki/posSimulator/totalTransactions')
      .subscribe(res => {
        this.temp = res;
        this.totalCheckouts = this.temp[0].count;
      })

      this.http.get('http://localhost:4004/api/v0/meraki/scanning/visitorCountByDate')
      .subscribe(res => {
        this.temp = res;
        this.totalVisitors = this.temp[0].count;
      })
  });
  }
}
