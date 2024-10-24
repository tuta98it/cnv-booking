import {Injectable} from '@angular/core';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(private location: Location){

  }
  public backToPreviousPage() {
    this.location.back();
  }
}

