import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.scss']
})
export class StackedBarChartComponent implements OnInit {

  constructor(private http: HttpClient) { }

  initAbandonedData: any;
  selectedValue: string;
  
  current={
    label: 'current',
    data: []
  }

  predicted={
    label: 'predicted',
    data: []
  }

  // {
  //   label: 'Current',
  //   data: [41, 11, 24, 54, 70, 57, 27,41, 11, 24, 54, 70, 57, 27,41, 11, 24, 54, 70, 57, 27] 
  // }

  period = [
    { value: "Hourly Till Now", viewValue: "Today" },
    { value: "Hourly", viewValue: "Yesterday" },
    { value: "Daily Till Now", viewValue: "This Week" },
    { value: "Daily", viewValue: "Last Week" },
    { value: "Weekly Till Now", viewValue: "This Month" },
    { value: "Weekly", viewValue: "Last Month" }
  ];

  public chartType: string = "bar";
  public chartLabels = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  public chartData = [];

  public colorOptions: Array<any> = [
    {
      // grey
      backgroundColor: "#ADC861",
    },
    {
      backgroundColor: "#808080",
    }
  ];
  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    legend: {
      display: true
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
    }
  };


  // changeGran(garnularity) {
  //   this.chartLabels = [];
  //   console.log(garnularity.value);
  //   this.http.get('http://localhost:4004/api/v0/meraki/checkout/totalAbandonments?pattern=' + garnularity.value)
  //     .subscribe(res => {
  //       this.chartData = [];
  //       console.log(res);
  //       this.initAbandonedData = res;
  //       for (let i of this.initAbandonedData) {
  //         this.chartData.push(i.count);
  //         this.chartLabels.push(i.timerange);
  //       }
  //       this.updateChart(this.chartData, this.chartLabels)
  //     })
  // }

  // updateChart(data, labels) {
  //   this.chartData = data;
  //   this.chartLabels = labels;
  // }

  ngOnInit() {
    
    for(var i=0;i<22;i++){
      this.current["data"].push(i)
      this.predicted["data"].push(i*i)
    }

    this.chartData.push(this.current)
    this.chartData.push(this.predicted)
}
}