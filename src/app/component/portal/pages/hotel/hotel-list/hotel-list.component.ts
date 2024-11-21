import {Component, OnInit} from '@angular/core';
import {TableSelectionAbstract} from '../../../../../shared/component/table/table-selection.abstract';
import {TranslateService} from '@ngx-translate/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NotificationService} from '../../../../../service/notification.service';
import {GeneralService} from '../../../../../service/general-service';
import {AppConfigService} from '../../../../../../app-config.service';
import {FormBuilder} from '@angular/forms';
import {DateFormatPipe} from '../../../../../shared/pipe/format-date.pipe';
import CustomStore from 'devextreme/data/custom_store';
import {LoadOptions} from 'devextreme/data';
import {Router} from '@angular/router';
import {Constant} from '../../../../../shared/constants/constant.class';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent extends TableSelectionAbstract implements OnInit {
  datas = [];
  pageSize: any;
  page: any;
  defaultPage: any;
  dataSource: any;

  constructor(public translate: TranslateService,
              private modalService: NzModalService,
              private notificationService: NotificationService,
              private generalService: GeneralService,
              private configService: AppConfigService,
              private fb: FormBuilder,
              private router: Router,
              private dateFormatPipe: DateFormatPipe) {
    super('id');
  }

  ngOnInit(): void {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.initTableHeight(1200);
    this.loadGrid();
  }

  getRowIndex(rowData: any, rowIndex: number): number {
    return rowData.name;  // Hiển thị STT bắt đầu từ 1
  }

  onCellPrepared(e: any) {
    if (e.rowType === 'data' && e.column.caption === 'STT') {
      const dataSource = e.component.getDataSource(); // Lấy DataSource
      const pageIndex = dataSource.pageIndex(); // Lấy chỉ số trang hiện tại (bắt đầu từ 0)
      const pageSize = dataSource.pageSize(); // Lấy số lượng bản ghi trên mỗi trang

      // Tính số thứ tự chính xác dựa trên trang hiện tại
      const rowIndexOnPage = e.rowIndex + 1; // Thứ tự trên trang
      const stt = pageIndex * pageSize + rowIndexOnPage; // Số thứ tự tổng quát

      console.log('Page Index:', pageIndex + 1); // Trang hiện tại (1-based)
      console.log('STT:', stt); // Số thứ tự tổng quát

      e.cellElement.innerText = stt; // Hiển thị số thứ tự chính xác
    }
  }

  loadGrid() {
    const payload = {
      page: 1,
      pageSize: 1000
    };
    this.generalService.filterHotel(payload).subscribe(res => {
      let index = 1;
      res.data.forEach(en => {
        en.stt = index++;
      });
      this.datas = res.data;
    });
  }
  showConfirmDeleteHotel(id: any): void {
    this.modalService.confirm({
      nzTitle: 'Bạn có chắc muốn xóa khách sạn này?',
      nzContent: '<span style="color: red;">Khách sạn sẽ không thể hoàn tác sau khi xoá. Ấn đồng ý để xoá</span>',
      nzOkDanger: true,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOnOk: () => this.deleteItemHotelByID(id).then(() => this.loadGrid()),
    });
  }
  deleteItemHotelByID(id: any) {
    // Delete workspace here
    return new Promise((resolve, reject) => {
      this.generalService.deleteHotelByID(id).subscribe((res: any) => {
        // Do some logic and close the popup
        if (res && res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, 'Không thể xóa khách sạn');
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, 'Xóa khách sạn thành công');
          resolve(true);
        }
      }, error => {
        // Error handling and close the popup
        this.notificationService.showNotification(Constant.ERROR, 'Đã có lỗi xảy ra khi xoá khách sạn!');
      });
    });
  }
  /*async loadGrid() {
    const generalService = this.generalService;
    // const filterSubjectId = this.filterSubjectId;
    this.dataSource = new CustomStore({
      async load(loadOptions: LoadOptions) {
        try {
          const payload = {
            page: (loadOptions.skip / loadOptions.take) + 1,
            pageSize: loadOptions.take,
          };
          const result = await generalService.filterHotel(payload).toPromise();
          console.log('result', result);
          let index = 1;
          // @ts-ignore
          result.data.forEach(en => {
            en.stt = loadOptions.skip + index++;
          });

          return {
            // @ts-ignore
            data: result.data,
            // @ts-ignore
            totalCount: result.total,
            /!*summary: 10000,
            groupCount: 10,*!/
          };
        } catch (err) {
          console.log(err);
        }
      }
    });
  }*/

  routingPageHotelAdd() {
    this.router.navigate(['hotel/edit-hotel']);
  }

  showModalUpdate(data: any) {
    console.log(data);
    this.router.navigate(['hotel/edit-hotel', data.id]);
  }

  doLock(data: any) {
    this.generalService.setActiveHotel(data.id, !data.isActive).subscribe({
      next: (res) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, 'Thiết lập trạng thái khách sạn không thành công');
        } else {
        }
      },

      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Thiết lập trạng thái khách sạn đã gặp lỗi');
      },

      complete: () => {
        this.loadGrid();
      }
    }).add(() => {
    });
  }
}
