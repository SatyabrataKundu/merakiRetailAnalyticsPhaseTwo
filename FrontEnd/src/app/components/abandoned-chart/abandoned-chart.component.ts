import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'abandoned-chart',
  templateUrl: './abandoned-chart.component.html',
  styleUrls: ['./abandoned-chart.component.scss']
})
export class AbandonedChartComponent implements OnInit {

  constructor() { }

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
      backgroundColor: "rgba(139, 12, 10, 0.3)",
      borderColor: "#12236B"
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

  ngOnInit() {
  }

}
