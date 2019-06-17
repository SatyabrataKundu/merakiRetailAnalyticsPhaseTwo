import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from "rxjs/operators";
import { forkJoin } from 'rxjs';
import { config } from "../../environments/config";

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
    
    else if(granularity == "Datewise Till Now")
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
    
    else if(zoneGran == "Datewise Till Now")
    this.zoneHttpOptions.timeRange = "this month";
    
    else
    this.zoneHttpOptions.timeRange="last month";

    console.log(this.zoneHttpOptions);
  }

  getChartData(){

    if(this.granularity == "this week"){

       return forkJoin([
        this.http.get(config.ipAddress+"/api/v0/meraki/camera/historicalDataByCamera?pattern="+this.granularity),
        this.http.get(config.ipAddress+"/api/v0/meraki/camera/dailyPredictions")])
       .pipe(map(res => {
         return res;
       }))
  }

  else if(this.granularity == "last week"){
    return forkJoin([
      this.http.get(config.ipAddress+"/api/v0/meraki/camera/historicalDataByCamera?pattern="+this.granularity),
      this.http.get(config.ipAddress+"/api/v0/meraki/camera/dailyPredictions")])
     .pipe(map(res => {
       return res;
     }))
  }

  else if(this.granularity == "today"){
    return forkJoin([
      this.http.get(config.ipAddress+"/api/v0/meraki/camera/historicalDataByCamera?pattern="+this.granularity),
      this.http.get(config.ipAddress+"/api/v0/meraki/camera/hourlyPredictions")])
     .pipe(map(res => {
       return res;
     }))
  }

  else if(this.granularity == "yesterday"){
    return forkJoin([
      this.http.get(config.ipAddress+"/api/v0/meraki/camera/historicalDataByCamera?pattern="+this.granularity),
      this.http.get(config.ipAddress+"/api/v0/meraki/camera/hourlyPredictions")])
     .pipe(map(res => {
       return res;
     }))
  }

  else if(this.granularity == "this month"){
    return forkJoin([
      this.http.get(config.ipAddress+"/api/v0/meraki/camera/historicalDataByCamera?pattern="+this.granularity),
      this.http.get(config.ipAddress+"/api/v0/meraki/camera/currentMonthWiseDailyPredictions")])
     .pipe(map(res => {
       return res;
     }))
  }
  else if(this.granularity == "last month"){
    return forkJoin([
      this.http.get(config.ipAddress+"/api/v0/meraki/camera/historicalDataByCamera?pattern="+this.granularity),
      this.http.get(config.ipAddress+"/api/v0/meraki/camera/previousMonthWiseDailyPredictions")])
     .pipe(map(res => {
       return res;
     }))
  }

}

  getZoneChartData(){
    return this.http.post(config.ipAddress+'/api/v0/meraki/camera/clients',this.zoneHttpOptions)
    .pipe(map((res:Response) => {
      return res;
    }))
  }
}
