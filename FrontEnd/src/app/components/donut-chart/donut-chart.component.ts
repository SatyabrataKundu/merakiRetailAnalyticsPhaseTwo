import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js'
import { HttpClient } from '@angular/common/http';
import { Observable, interval, timer } from 'rxjs';

@Component({
  selector: 'donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {

  constructor(private http: HttpClient) { }
  public chartType: string = "doughnut";
  public chartLabels: Array<string> = ['Total Transactions', 'Total Visitors',  'Total Checkouts',  'Total Abandonments'];
  public chartLabels2: Array<string> = [];
  public chartData: Array<string> = [];
  public chartData2: Array<number> = [350, 150, 100, 45, 23, 12, 16, 70];
  public colorOptions: Array<any> = [
    {
      backgroundColor: ["rgba(175, 122, 197,0.4)",
        "rgba(100, 123, 20, 0.4)",
        "rgba(255, 20, 100, 0.4)",
        "rgba(255, 140, 120, 0.4)",
        "rgba(124, 22, 10, 0.4)",
        "rgba(80, 120, 122, 0.4)",
        "rgba(149, 210, 10, 0.4)",
        "rgba(55, 210, 255, 0.4)",
        "rgba(175, 11, 17,0.4)",
        "rgba(10, 113, 20, 0.4)",
        "rgba(25, 120, 100, 0.4)",
        "rgba(55, 40, 120, 0.4)"],
      hoverBackgroundColor: ['rgba(175, 122, 197,1)', "rgba(100, 123, 20, 1)", "rgba(255, 20, 100, 1)"]
    }
  ];

  zoneData: any;
  zoneLabels: any;
  zoneCount: any;

  public chartOptions: any = {
    maintainAspectRatio: true,
    cutoutPercentage: 56,
    responsive: true,
    title: {
      display: true,
      text: 'Visitor Activity Stats',
      fontFamily: 'Roboto',
      fontSize: 30
      },
    legend: {
      display: true,
    },
    tooltips: {
      enabled: true,
    }
  }


  public chartOptions2: any = {
    maintainAspectRatio: true,
    cutoutPercentage: 56,
    responsive: true,
    title: {
      display: true,
      text: 'Live Zone Population',
      fontFamily: 'Roboto',
      fontSize: 30
      },
    legend: {
      display: true,
    },
    tooltips: {
      enabled: true,
    }
  }

  salesDonutChartUpdate(data) {
    this.chartData = [];
    this.chartData = data;
  }

  zoneDonutChartUpdate(data) {
    this.chartData2 = [];
    this.chartData2 = data;
  }

  zoneDonutChartLabels(labels) {
    this.chartLabels2 = [];
    this.chartLabels2 = labels;
  }



  ngOnInit() {
    //Total Transactions
    let totalTransactions = "0";
    let totalVisitors = "0";
    let totalCheckouts = "0";
    let totalAbandonments = "0";

    Observable
    timer(1, 1000 * 30).subscribe(() =>
      this.http.get('http://localhost:4004/api/v0/meraki/posSimulator/totalTransactions')
        .subscribe(res => {
          totalTransactions = res[0].count;
          this.http.get('http://localhost:4004/api/v0/meraki/scanning/visitorCountByDate')
            .subscribe(res => {
              totalVisitors = res[0].count;
              this.http.get('http://localhost:4004/api/v0/meraki/checkout/totalCheckoutZoneAbandonmentsToday')
             .subscribe(res => {
              totalAbandonments = res[0].count;
              this.http.get('http://localhost:4004/api/v0/meraki/checkout/totalCheckoutZoneVisitorsToday')
                .subscribe(res => {
                  this.chartData = [];
                  totalCheckouts = res[0].count;
                  this.chartData.push(totalTransactions);
                  this.chartData.push(totalVisitors);
                  this.chartData.push(totalCheckouts);
                  this.chartData.push(totalAbandonments);
                  this.salesDonutChartUpdate(this.chartData);
                })
              })
            })      
        })
    )

    Observable
    timer(1, 1000 * 60).subscribe(() =>
      this.http.get('http://localhost:4004/api/v0/meraki/camera/currentVisitorsPerZone')
        .subscribe(res => {
          this.chartData2 = [];
          this.zoneData = res;
          for (let i of this.zoneData) {
            this.chartData2.push(i.count)
          }
          this.zoneDonutChartUpdate(this.chartData2);

          this.http.get('http://localhost:4004/api/v0/meraki/camera/currentVisitorsPerZone')
            .subscribe(res => {
              this.chartLabels2 = [];
              this.zoneData = res;
              for (let i of this.zoneData) {
                this.chartLabels2.push(i.zone_name)
              }
            })
          this.zoneDonutChartLabels(this.chartLabels2);
        })
    )
  }

}