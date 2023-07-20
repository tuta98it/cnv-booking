import {Injectable, NgZone, OnDestroy} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SignalRService implements OnDestroy {
  public data: BehaviorSubject<any[]>;
  public hasRemoteConnection: boolean;
  private hubConnection!: signalR.HubConnection;
  // tslint:disable-next-line:variable-name
  private _timer!: ReturnType<typeof setInterval>;
  constructor(private zone: NgZone) {
    this.data = new BehaviorSubject([] as any[]);
  }

  public ngOnDestroy(): void {
    this.stopLiveData();
  }
  public stopLiveData = (): void => {
    if (this.hasRemoteConnection) {
      this.hubConnection.invoke('StopTimer')
        .catch(err => console.error(err));
    } else {
      // this.stopFeed();
    }
  }
  public startConnection = (interval = 2000, volume = 10, live = false, updateAll = true): void => {
    // https://www.infragistics.com/angular-apis/webapi/streamHub
    // http://gsm.gss-cam.com/signalr
    // http://gsm.gss-cam.com/signalr
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Trace)
      .withUrl('http://192.168.18.27:8456/streamHub')
      .build();
    this.hubConnection
      .start()
      .then(() => {
        console.log('signalR connected');
        this.hasRemoteConnection = true;
        this.registerSignalEvents();
        this.broadcastParams(interval, volume, live, updateAll);
      })
      .catch(() => {
        /*this.hasRemoteConnection = false;
        if (this._timer) { this.stopFeed(); }*/
        console.log('connection failed');
        /*const data = FinancialData.generateData(volume);
        live ? this._timer = setInterval(() => updateAll ?
          this.updateAllPriceValues(data) : this.updateRandomPriceValues(data), interval) :
          this.getData(volume);*/
      });
  }
  public broadcastParams = (frequency, volume, live, updateAll = true): void => {
    /*this.hubConnection.invoke('updateparameters', frequency, volume, live, updateAll)
      .then(() => console.log('requestLiveData', volume))
      .catch(err => {
        console.error(err);
      });*/
  }
  private registerSignalEvents() {
    this.hubConnection.onclose(() => {
      this.hasRemoteConnection = false;
    });
    this.hubConnection.on('transferdata', (data) => {
      console.log(data);
      this.data.next(data);
    });

    this.hubConnection.on('BroadcastMessage', (data) => {
      console.log(data);
    });
  }
}
