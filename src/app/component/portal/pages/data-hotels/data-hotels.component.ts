import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GeneralService } from 'src/app/service/general-service';
import { TableSelectionAbstract } from 'src/app/shared/component/table/table-selection.abstract';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constant } from 'src/app/shared/constants/constant.class';
import { AppConfigService } from 'src/app-config.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Workbook } from 'exceljs';
import { DateFormatPipe } from 'src/app/shared/pipe/format-date.pipe';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs } from 'file-saver-es';
import { NzImageService } from 'ng-zorro-antd/image';
// import { removeAccents } from ;
import { removeAccents } from 'src/app/shared/utils/filters/remove-accents';
import {
  DxDataGridComponent,
  DxTemplateDirective,
  DxTooltipComponent,
  DxTooltipModule,
} from "devextreme-angular";
import { IsEmptyPipe } from 'src/app/shared/pipe/is-empty.pipe';
import { filter } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { StringUtils } from 'src/app/shared/utils/string-utils.class';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { PipeUtils } from 'src/app/shared/utils/pipe-utils.class';
@Component({
  selector: 'app-data-hotels',
  templateUrl: './data-hotels.component.html',
  styleUrls: ['./data-hotels.component.scss']
})
export class DataHotelsComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  @ViewChild("DataHotel") dataGridDetail: DxDataGridComponent;
  datas: any[] = [];
  partners: any[] = [];
  data: any;
  item: any;
  loading: boolean;
  total = 0;
  filteredDatas: any[] = [];
  searchText = '';
  userInfor: any;
  listBookingHotelPassengers: any[];
  searchData = {
    fromDate: "",
    toDate: "",
    partnerId: 0
  };
  payload = {
    page: 1,
    pageSize: 1000
  };
  readonly allowedPageSizes = [5, 10, 20, 'all'];
  readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];
  displayMode = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  partnerInfo: any;
  constructor(
    private router: Router,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private actionsSubject: ActionsSubject,
    private configService: AppConfigService,
    private fb: FormBuilder,
    private dateFormatPipe: DateFormatPipe,
    private nzImageService: NzImageService,
    private msg: NzMessageService,
    private dataService: DataService,
    public pipeUtils:  PipeUtils
  ) {
    super('id');

  }
  ngOnInit(): void {
    this.getUserInfo();
    this.getPartners();
    this.getListData();
  }

  ngOnDestroy(): void {

  }

  getUserInfo() {
    this.userInfor = JSON.parse(localStorage.getItem(Constant.USER_INFO));
  }

  getListData() {
    this.loading = true;
    this.generalService.reportHotelDebtStatistics(this.searchData).subscribe(
      {
        next: (res: any) => {
          this.partnerInfo = JSON.parse(JSON.stringify(res));
          delete this.partnerInfo.data;
          this.datas = res.data;
          let stt = 0;
          this.datas.forEach((en: any) => {
            en.stt = ++stt;
            en.roomPriceOneFormat = this.formatCurrencyVND(en.roomPrice);
            en.taxOneFormat = this.formatCurrencyVND(en.tax);
            en.totalPriceFormat = this.formatCurrencyVND(en.totalPrice);
          });
          this.total = res.total;
          this.filteredDatas = this.datas;
        },

        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Dữ liệu trả về đã gặp lỗi');
        },

        complete: () => {

        }
      }
    );
  }

  exportData() {
    this.dataGridDetail.instance.exportToExcel(false);
  }


  getPartners() {
    this.generalService.getListPartner().subscribe(res => {
      if (res !== null) {
        this.partners = res;
      } else {

      }
    }, error => {

    });
  }

  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Bảng kê chi tiết khách sạn');

    const from = this.dateFormatPipe.transformFull(new Date(), Constant.DATE_FMT_STR);
    const dateStr = from;
    const fileName = `Bang_phong_khach_san_${dateStr}`;
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
      topLeftCell: { row: 13, column: 1 },
    }).then((cellRange) => {


      // Tên công ty
      const headerRowNameCompany = worksheet.getRow(1);
      headerRowNameCompany.getCell(2).value = 'CTY TNHH TMDV DU LỊCH CAO NGUYÊN VIỆT';
      headerRowNameCompany.getCell(2).font = { name: 'Times New Roman', size: 10, bold: true };
      headerRowNameCompany.getCell(2).alignment = { horizontal: 'left' };

      // Địa chỉ công ty
      const headerRowAdress = worksheet.getRow(2);
      headerRowAdress.getCell(2).value = '105H/15 Hồ Thị Kỷ, phường 1, quận 10, TP. HCM';
      headerRowAdress.getCell(2).font = { name: 'Times New Roman', size: 10 };
      headerRowAdress.getCell(2).alignment = { horizontal: 'left' };

      // Mã số thuế
      const headerTextNumber = worksheet.getRow(3);
      headerTextNumber.getCell(2).value = 'MST: 0 3 1 0 4 0 4 1 1 5';
      headerTextNumber.getCell(2).font = { name: 'Times New Roman', size: 10, bold: true };
      headerTextNumber.getCell(2).alignment = { horizontal: 'left' };


      // Tiêu đề
      const headerRowTitle = worksheet.getRow(5);
      headerRowTitle.height = 28;
      worksheet.mergeCells(5, 1, 5, 8);
      headerRowTitle.getCell(1).value = 'BẢNG KÊ CHI TIẾT PHÒNG KHÁCH SẠN';
      headerRowTitle.getCell(1).font = { name: 'Times New Roman', size: 16, bold: true };
      headerRowTitle.getCell(1).alignment = { horizontal: 'center' };

      // Thời gian
      const headerTimes = worksheet.getRow(6);
      headerTimes.height = 25;
      worksheet.mergeCells(6, 1, 6, 8);
      headerTimes.getCell(1).value = 'Tháng năm';
      headerTimes.getCell(1).font = { name: 'Times New Roman', size: 14, bold: true, italic: true };
      headerTimes.getCell(1).alignment = { horizontal: 'center' };

      // Số hiệu hơp động
      const headerContract = worksheet.getRow(7);
      headerContract.height = 25;
      worksheet.mergeCells(7, 1, 7, 8);
      headerContract.getCell(1).value = '(Kèm theo hóa đơn số_ký hiệu 1C22TCN_ngày)_Hợp đồng số (nếu có)';
      headerContract.getCell(1).font = { name: 'Times New Roman', size: 11, italic: true };
      headerContract.getCell(1).alignment = { horizontal: 'center' };


      // Mã số thuế
      const headerClientNameTitle = worksheet.getRow(9);
      headerClientNameTitle.getCell(2).value = 'Tên khách hàng:';
      headerClientNameTitle.getCell(2).font = { name: 'Times New Roman', size: 11 };
      headerClientNameTitle.getCell(2).alignment = { horizontal: 'left' }

      const headerClientNameValue = worksheet.getRow(9);
      headerClientNameValue.getCell(3).value = `${this.partnerInfo.partnerName ? this.partnerInfo.partnerName : ''}`;
      headerClientNameValue.getCell(3).font = { name: 'Times New Roman', size: 11, bold: true };
      headerClientNameValue.getCell(3).alignment = { horizontal: 'left', }

      // Địa chỉ khách hàng
      const headerClientAdressTitle = worksheet.getRow(10);
      headerClientAdressTitle.getCell(2).value = 'Địa chỉ:';
      headerClientAdressTitle.getCell(2).font = { name: 'Times New Roman', size: 11 };
      headerClientAdressTitle.getCell(2).alignment = { horizontal: 'left' }

      const headerClientAdressValue = worksheet.getRow(10);
      headerClientAdressValue.getCell(3).value = `${this.partnerInfo.partnerAddress ? this.partnerInfo.partnerAddress : ''}`;
      headerClientAdressValue.getCell(3).font = { name: 'Times New Roman', size: 11 };
      headerClientAdressValue.getCell(3).alignment = { horizontal: 'left', }

      // Mã số thuế khách hàng
      const headerClientMSTTitle = worksheet.getRow(11);
      headerClientMSTTitle.getCell(2).value = 'MST:';
      headerClientMSTTitle.getCell(2).font = { name: 'Times New Roman', size: 11 };
      headerClientMSTTitle.getCell(2).alignment = { horizontal: 'left' }

      const headerClientMSTValue = worksheet.getRow(11);
      headerClientMSTValue.getCell(3).value = `${this.partnerInfo.partnerTaxCode ? this.partnerInfo.partnerTaxCode : ''} `;
      headerClientMSTValue.getCell(3).font = { name: 'Times New Roman', size: 11, bold: true };
      headerClientMSTValue.getCell(3).alignment = { horizontal: 'left', }

      // footer
      const footerRowIndex = cellRange.to.row + 2;

      // Địa điểm, thời gian
      const footerRowTimes = worksheet.getRow(footerRowIndex);
      worksheet.mergeCells(footerRowIndex, 11, footerRowIndex, 12);
      footerRowTimes.getCell(11).value = 'TP.HCM, ngày  tháng  năm ';
      footerRowTimes.getCell(11).font = { name: 'Times New Roman', size: 11 };;
      footerRowTimes.getCell(11).alignment = { horizontal: 'right' };

      // Xác nhận của khách hàng
      const footerRowComfirmClient = worksheet.getRow(footerRowIndex + 1);
      worksheet.mergeCells(footerRowIndex + 1, 1, footerRowIndex + 1, 3);
      footerRowComfirmClient.getCell(1).value = 'Xác nhận của Khách hàng';
      footerRowComfirmClient.getCell(1).font = { name: 'Times New Roman', size: 11, bold: true };;
      footerRowComfirmClient.getCell(1).alignment = { horizontal: 'center' };

      // Tên công ty
      const footerRowNameCompany = worksheet.getRow(footerRowIndex + 1);
      worksheet.mergeCells(footerRowIndex + 1, 10, footerRowIndex + 1, 12);
      footerRowNameCompany.getCell(11).value = 'CTY TNHH TMDV DU LỊCH CAO NGUYÊN VIỆT';
      footerRowNameCompany.getCell(11).font = { name: 'Times New Roman', size: 11, bold: true };;
      footerRowNameCompany.getCell(11).alignment = { horizontal: 'right' };


      // //
      const footerRowSignature = worksheet.getRow(footerRowIndex + 2);
      worksheet.mergeCells(footerRowIndex + 2, 1, footerRowIndex + 2, 3);
      footerRowSignature.getCell(1).value = '(Ký, đóng dấu và ghi rõ họ tên)';
      footerRowSignature.getCell(1).font = { name: 'Times New Roman', size: 11, italic: true };;
      footerRowSignature.getCell(1).alignment = { horizontal: 'center' };

    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName + '.xlsx');
      });
    });
    e.cancel = true;
  }

  onSearch() {
    const keyword = removeAccents(this.searchText.trim().toLowerCase());
    this.filteredDatas = this.datas.filter((en) =>
      removeAccents(en.name?.toString().trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.address?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.phoneNo?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.websiteUrl?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.contactEmail?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.facebook?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.ratingStar?.trim()).toLowerCase().includes(keyword)
    );
  }

  doSearch() {
    this.getListData();
  }

  clearSearch() {
    this.searchData = {
      fromDate: "",
      toDate: "",
      partnerId: this.userInfor.partnerId,
    };
    this.getListData();
  }

  calculateSelectedRowPrice(options) {
    if (options.name === 'SelectedRowSumPriceRoom') {
      if (options.summaryProcess === 'start') {
        options.totalValue = 0;
      } else if (options.summaryProcess === 'calculate') {
        options.totalValue += options.value.roomPrice;
      }
    } else if (options.name === 'SelectedRowRoomVAT') {
      if (options.summaryProcess === 'start') {
        options.totalValue = 0;
      } else if (options.summaryProcess === 'calculate') {
        options.totalValue += options.value.tax;
      }
    } else if (options.name === 'SelectedRowsTotalPrice') {
      if (options.summaryProcess === 'start') {
        options.totalValue = 0;
      } else if (options.summaryProcess === 'calculate') {
        options.totalValue += options.value.totalPrice;
      }
    }
  }

  formatCurrencyVND(value) {
    if (!value) {
      return '0 đ';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  }
}
