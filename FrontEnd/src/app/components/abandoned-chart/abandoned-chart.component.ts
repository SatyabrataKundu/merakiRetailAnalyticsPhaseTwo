import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'abandoned-chart',
  templateUrl: './abandoned-chart.component.html',
  styleUrls: ['./abandoned-chart.component.scss']
})
export class AbandonedChartComponent implements OnInit {

  constructor(private http: HttpClient) { }

  initAbandonedData: any;
  selectedValue : string;

  period = [
    { value: "Hourly Till Now", viewValue: "Today" },
    { value: "Hourly", viewValue: "Yesterday" },
    { value: "Daily Till Now", viewValue: "This Week" },
    { value: "Daily", viewValue: "Last Week" },
    { value: "Weekly Till Now", viewValue: "This Month" },
    { value: "Weekly", viewValue: "Last Month" }
  ];

  public chartType: string = "line";
  public chartLabels: Array<any> = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  public chartData: Array<number> = [1,6,34,12,63,12,4];
  public colorOptions: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(225, 0, 0, 0.4)",
      borderColor: "rgba(225, 0, 0, 1)"
    }
  ];
  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio:1,
    legend: {
      display: false
    },
    scales: {
      yAxes: [
        {
          display: true,
          stepSize: 1,
          gridLines: {
            drawOnChartArea: true
          },
          ticks: {
            maxTicksLimit: 8,
            beginAtZero: true
          },
        }
      ]
    },
    tooltips: {
      callbacks: {
         label: function(tooltipItem) {
                return tooltipItem.yLabel;
         }
      }
  }
  };


  changeGran(garnularity){
    this.chartLabels = [];
    console.log(garnularity.value);
    this.http.get('http://localhost:4004/api/v0/meraki/checkout/totalAbandonments?pattern=' + garnularity.value)
    .subscribe(res => {
      this.chartData = [];
      console.log(res);
      this.initAbandonedData = res;
      for(let i of this.initAbandonedData){
        this.chartData.push(i.count);
        this.chartLabels.push(i.timerange);
      }
      this.updateChart(this.chartData, this.chartLabels)
    })
  }

  updateChart(data,labels){
    this.chartData = data;
    this.chartLabels = labels;
  }

  ngOnInit() {
    this.selectedValue = 'Today';  
    this.chartLabels = [];
    this.http.get('http://localhost:4004/api/v0/meraki/checkout/totalAbandonments?pattern=Today')
    .subscribe(res => {
      this.chartData = [];
      this.initAbandonedData = res;
      for(let i of this.initAbandonedData){
        this.chartData.push(i.count);
        this.chartLabels.push(i.timerange);
      }
    })
  }

}
