import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ChartdataService {

  granularity:any;
  zoneHttpOptions = {
    "zoneId": "",
    "timeRange": "today"	
    
  };

  constructor(private http: HttpClient) { }

  setGranularity(granularity){
    if(granularity == "Hourly Till Now")
    this.granularity = "today";
    
    else if(granularity == "Hourly")
    this.granularity = "yesterday";
    
    else if(granularity == "Daily Till Now")
    this.granularity = "this week";
    
    else if(granularity == "Daily")
    this.granularity = "last week";
    
    else if(granularity == "Weekly Till Now")
    this.granularity = "this month";
    
    else
    this.granularity="last month";
  }

  setZoneId(zoneId){
    this.zoneHttpOptions.zoneId = zoneId.value;
    console.log(this.zoneHttpOptions);
  }

  setZoneGranularity(zoneGran){
    if(zoneGran == "Hourly Till Now")
    this.zoneHttpOptions.timeRange = "today";
    
    else if(zoneGran == "Hourly")
    this.zoneHttpOptions.timeRange = "yesterday";
    
    else if(zoneGran == "Daily Till Now")
    this.zoneHttpOptions.timeRange = "this week";
    
    else if(zoneGran == "Daily")
    this.zoneHttpOptions.timeRange = "last week";
    
    else if(zoneGran == "Weekly Till Now")
    this.zoneHttpOptions.timeRange = "this month";
    
    else
    this.zoneHttpOptions.timeRange="last month";

    console.log(this.zoneHttpOptions);
  }

  getChartData(){
    return this.http.get('http://localhost:4004/api/v0/meraki/scanning/visitorPattern?pattern='+this.granularity)
    .pipe(map((res:Response) => {
      return res;
    }))
  }

  getZoneChartData(){
    return this.http.post('http://localhost:4004/api/v0/meraki/camera/clients',this.zoneHttpOptions)
    .pipe(map((res:Response) => {
      return res;
    }))
  }
}
