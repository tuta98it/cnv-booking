import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
// import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
// import { StorageKeys } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  protected subject: BehaviorSubject<boolean>;
  protected isShowMenu: boolean;

  // TODO add a select method to this class that allows selection of a copy of the model
  constructor()
  {
    this.subject = new BehaviorSubject<boolean>(this.isShowMenu);
  }

  public subscribe(callback: (model: boolean) => void): Subscription {
    return this.subject.subscribe(callback);
  }

  public dispatch(payload: any | null): void {
    const data: Partial<boolean> = payload as Partial<boolean>;
    this.isShowMenu = data;
    const dispatchedModel: boolean = JSON.parse(JSON.stringify(this.isShowMenu));
    this.subject.next(dispatchedModel);
  }
}
