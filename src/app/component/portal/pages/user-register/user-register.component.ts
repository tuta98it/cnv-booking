import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GeneralService } from 'src/app/service/general-service';
import { TableSelectionAbstract } from 'src/app/shared/component/table/table-selection.abstract';
import { Constant, UserRegisterConfig } from 'src/app/shared/constants/constant.class';
import { NotificationService } from 'src/app/service/notification.service';
import { removeAccents } from 'src/app/shared/utils/filters/remove-accents';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})

export class UserRegisterComponent extends TableSelectionAbstract implements OnInit {
  datas: any[] = [];
  loading: boolean;
  filteredDatas: any[] = [];
  selectedRow: any;
  searchText = '';
  currentStatus: boolean = false;
  intervalIdUserRegister: NodeJS.Timeout;

  constructor(
    public translate: TranslateService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
     private router: Router
  ) {
    super('id');
  }

  ngOnInit(): void {
    this.getListData();
    this.intervalIdUserRegister = setInterval(() => {
      setTimeout(() => {
        if (this.router.url === '/user-register') {
          this.getListData();
        } else {
          clearInterval(this.intervalIdUserRegister);
        }
      }, 200);
    }, UserRegisterConfig.TIME_UPDATE_DATAS);
  }

  getListData() {
    this.loading = true;
    this.generalService.getUserRegister().subscribe((res: any) => {
      if (res !== null) {
        this.datas = res;
        this.loading = false;
        let stt = 0;
        this.datas.forEach(en => {
          en.stt = ++stt;
        });
        this.filteredDatas = this.datas;
        super.setListOfAllData(this.datas);
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Đã xảy ra lỗi khi tải dữ liệu');
    });
  }

  showUpdateConfirm(data): void {
    this.selectedRow = data;
    this.currentStatus = data.status;
    this.modalService.confirm({
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muốn cập nhật trạng thái không?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOnOk: () => this.updateStatus()
    });
  }

  updateStatus() {
    this.selectedRow.status = !this.currentStatus;
    this.generalService.updateUserRegister(this.selectedRow).subscribe(res => {
      if (res && res.ret && res.ret[0].code !== 0) {
        this.notificationService.showNotification(Constant.ERROR, 'Không thể cập nhật');
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật thành công');
        this.getListData();
      }
    }, error => {

    });
  }

  onSearch() {
    const keyword = removeAccents(this.searchText.trim().toLowerCase());
    this.filteredDatas = this.datas.filter((en) =>
      removeAccents(en.firstName?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.lastName?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.phoneNo?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.email?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.address?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.companyName?.trim()).toLowerCase().includes(keyword)
    );
  }
}
