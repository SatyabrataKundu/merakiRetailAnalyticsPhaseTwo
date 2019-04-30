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

  predictedArray : any = []
  currentArray : any = []

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
  public chartLabels = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

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
          stepSize: 3,
          gridLines: {
            drawOnChartArea: true
          },
          ticks: {
            maxTicksLimit: 2,
            beginAtZero: false,
            max: 800,
            min: 700
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

  updateChart(currentData, predictedData) {
    this.chartData.push(currentData)
    this.chartData.push(predictedData)
  }

  ngOnInit() {

    this.http.get('http://localhost:4004/api/v0/meraki/camera/dailyPredictions')
    .subscribe(res => {
      this.predictedArray = res
      for(let i of this.predictedArray){
        this.predicted["data"].push(i.predicted)
      }
    })

    this.http.get('http://localhost:4004/api/v0/meraki/scanning/historicalDataByCamera?pattern=this%20week')
    .subscribe(res => {
      this.currentArray = res
      for(let i of this.currentArray){
        this.current["data"].push(i.count)
      }
    })
    
    this.updateChart(this.current, this.predicted);
}
}