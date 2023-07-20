import {Component, OnInit} from '@angular/core';
import {Constant} from '../../../../../shared/constants/constant.class';
import {GeneralService} from '../../../../../service/general-service';

@Component({
  selector: 'app-select-unit',
  templateUrl: './select-unit.component.html',
  styleUrls: ['./select-unit.component.scss']
})
export class SelectUnitComponent implements OnInit {
  tinhThanhs = [];
  tinhThanhId: any;
  quanHuyenId: any;
  quanHuyens = [];
  userInfo: any;
  constructor(
    private generalService: GeneralService
  ) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.getTinhThanh();
    this.tinhThanhId = +localStorage.getItem(Constant.TINHTHANH);
    this.quanHuyenId = +localStorage.getItem(Constant.QUANHUYEN);
    console.log(this.tinhThanhId, this.quanHuyenId);
    if (this.tinhThanhId) {
      this.getQuanHuyen(this.tinhThanhId);
    }
  }

  getTinhThanh() {
    this.generalService.getTinhThanh(null).subscribe(res => {
      if (res !== null) {
        this.tinhThanhs = res;
      }
    }, error => {

    });
  }

  getQuanHuyen(tinhthanhId) {
    this.generalService.getTinhThanh(tinhthanhId).subscribe(res => {
      if (res !== null) {
        this.quanHuyens = res;
      }
    }, error => {

    });
  }

  unitChange($event: any, type: number) {
    if (type === 2) {
      this.getQuanHuyen($event);
      localStorage.setItem(Constant.TINHTHANH, $event);
      localStorage.removeItem(Constant.QUANHUYEN);
    }
    if (type === 3) {
      this.getQuanHuyen($event);
      localStorage.setItem(Constant.QUANHUYEN, $event);
    }
    location.href = location.href;
  }
}
