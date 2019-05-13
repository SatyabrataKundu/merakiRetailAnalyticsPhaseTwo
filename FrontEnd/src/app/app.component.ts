import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { MatSlideToggleChange, MatSnackBarModule, MatSnackBar } from '@angular/material';
import { ChatService } from '../app/services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  title = 'retailanalytics';
  posWaitTime:any;
  zoneData: any;
  zoneName: string;
  message: string;
  zones: any;
  notificationCount: number=0;
  emptyZones: Array<string> =[];
  chatService: ChatService;

  zoneid:any;
  zonename:any;

  private notifier: NotifierService;

  constructor(private http: HttpClient,  notifier: NotifierService, chatService: ChatService, private snackBar : MatSnackBar){
    this.notifier = notifier;
  }

  toggle(i,event: MatSlideToggleChange){
    console.log(i.zoneid);
    console.log(i.zonename);
    console.log(event.checked);
  }

  public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
  }
  
  clearNotification(){
    this.notificationCount=0;
  }

  clearNotificationList(){
    this.emptyZones=[];
  }

  dismiss(){
    this.snackBar.dismiss()
  }

  ngOnInit(){

    this.snackBar.openFromComponent(snackBarComponent);

    Observable
    timer(1,1000 * 60).subscribe(() =>
    this.http.get('http://localhost:4004/api/v0/meraki/checkout/waitTime')
    .subscribe(res => {
      this.posWaitTime = res;
    })
    )

    Observable
    timer(1,1000 * 60 * 10).subscribe(() =>
    this.http.get('http://localhost:4004/api/v0/meraki/camera/currentVisitorsPerZone')
    .subscribe(res => {
      this.zoneData =  res;
      for(let i of this.zoneData){
    if(i.count == 0){
          this.notificationCount++;
          this.zoneName = i.zone_name;
          this.message = this.zoneName + " zone has 0 visitors"
          this.emptyZones.push(this.message);
          this.showNotification('default',this.message);
    }
      }
    })
    )

    this.http.get('http://localhost:4004/api/v0/meraki/camera/zones')
    .subscribe(res => {
      this.zones = res;
    })
  }
}

@Component({
  selector: 'snackComponent',
  templateUrl: 'snackBar.html',
  styles: [],
})
export class snackBarComponent {
  constructor(private snack: MatSnackBar){}

  dismiss(){
    this.snack.dismiss()
  }
}

