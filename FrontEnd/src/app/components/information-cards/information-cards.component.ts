import { Component, OnInit, Input } from '@angular/core';
import { Observable, interval} from 'rxjs';
import { timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../environments/config';

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
    timer(500, config.countRefreshRate).subscribe(() => {
      this.http.get('http://localhost:4004/api/v0/meraki/camera/currentVisitorCount')
      .subscribe(res => {
        this.temp = res;
        this.currentVisitor = this.temp[0].visitor_count;
      })

      this.http.get('http://localhost:4004/api/v0/meraki/posSimulator/totalAmount')
      .subscribe(res => {
        this.temp = res;
        this.totalAmount = Math.ceil((this.temp[0].sum)/70);
      })

    this.http.get('http://localhost:4004/api/v0/meraki/posSimulator/totalTransactions')
      .subscribe(res => {
        this.temp = res;
        this.totalCheckouts = this.temp[0].count;
      })

      this.http.get('http://localhost:4004/api/v0/meraki/camera/visitorCountByDate')
      .subscribe(res => {
        this.temp = res;
        this.totalVisitors = this.temp[0].count;
      })
  });
  }
}
