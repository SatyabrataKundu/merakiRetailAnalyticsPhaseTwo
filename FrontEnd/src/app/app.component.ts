import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { MatSlideToggleChange, MatSnackBarModule, MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { ChatService } from '../app/services/chat.service';
import * as io from 'socket.io-client';
import { config } from '../environments/config';

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

  private url = 'http://127.0.0.1:5002';
  private socket;

  zoneid:any;
  zonename:any;

  base64string:any;

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
    

    this.socket = io(this.url);
        console.log('IN CHAT SERVICE CONSTRUCTOR')
        this.socket.on('new-message', (message) => {
        this.base64string="data:image/jpg;base64,"+message;
        console.log('base64recieved',this.base64string)
        this.snackBar.openFromComponent(snackBarComponent,{
          data:this.base64string
        });
    });

     // this.snackBar.openFromComponent(snackBarComponent);
    Observable
    timer(1,config.waitTimeRefreshRate).subscribe(() =>
    this.http.get(config.ipAddress+'/api/v0/meraki/checkout/waitTime')
    .subscribe(res => {
      this.posWaitTime = res;
    })
    )

    Observable
    timer(1,config.notificationRefreshRate).subscribe(() =>
    this.http.get(config.ipAddress+'/api/v0/meraki/camera/currentVisitorsPerZone')
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

    this.http.get(config.ipAddress+'/api/v0/meraki/camera/zones')
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
export class snackBarComponent implements OnInit {

  constructor(private snack: MatSnackBar, private chat: ChatService, @Inject(MAT_SNACK_BAR_DATA) public data: any){}
  base64string = "";
  res: any;
  private url = 'http://127.0.0.1:5002';
  private socket;

  dismiss(){
    this.snack.dismiss()
  }

  ngOnInit(){
    // this.socket = io(this.url);
    //     this.socket.on('new-message', (message) => {
    //     this.base64string = message;
    //     console.log('popup snackbar',this.base64string)
    //     });
  }
}

