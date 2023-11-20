import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GeneralService } from 'src/app/service/general-service';
import { TableSelectionAbstract } from 'src/app/shared/component/table/table-selection.abstract';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constant } from 'src/app/shared/constants/constant.class';
import { PhoneUtils } from 'src/app/shared/utils/phone-utils.class';
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
import { MoneyUtils } from 'src/app/shared/utils/money-utils.class';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { BookingHotelStatusPipe } from 'src/app/shared/pipe/booking-hotel-status.pipe';
@Component({
  selector: 'app-hotel',
  templateUrl: './booking-hotel.component.html',
  styleUrls: ['./booking-hotel.component.scss']
})
export class BookingHotelComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  @ViewChild("ListBookingHotels") dataGridDetail: DxDataGridComponent;
  datas: any[] = [];
  data: any;
  listUtilityHotel = [];
  listUtilityRoom = [];
  passwordVisible: boolean;
  repeatpasswordVisible: boolean;
  isVisibleAddHotel: boolean;
  isVisibleAddRoom: boolean;
  isVisibleUpdate: boolean;
  isVisiblePassword: boolean;
  loadingSystemStatus: boolean = false;
  item: any;
  loading: boolean;
  total = 0;
  checkDelete = true;
  checkAdd = true;
  checkUpdate = true;
  submitted = false;
  updated: boolean;
  formAddHotel: FormGroup;
  formAddRoom: FormGroup;
  filteredDatas: any[] = [];
  searchText = '';
  userInfor: any;
  titleFormHotel = '';
  titleFormRoom = '';
  isVisibleDetailBookingHotelPassengers: boolean = false;
  isVisibleConfirmBooking: boolean = false;
  isVisibleConfirmSendEmaiBooking: boolean = false;
  isConfirmLoading: boolean = false;
  // isOnSendEmailLoading: boolean = false;
  isConfirmSendEmailLoading: boolean = false;
  confirmBookingHotel = {
    textValueNoteConfirm: '',
    approvalCodeConfirm: '',

  }

  textValueNoteRefuse = '';
  isVisibleRefuseBooking: boolean = false;
  isRefuseLoading: boolean = false;
  contentFileConfirmBookingRoonHotel = ''
  listBookingHotelPassengers: any[];
  uploadHeader: any;
  baseImageurl = '';
  uploadUrl = '';
  fileList: NzUploadFile[] = [];
  listURLFiles: any[] = [];
  htmlContent = '';

  configDescriptionHotel: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '60vh',
    minHeight: '50vh',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Mô tả ...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: []
  };

  imageLogoVHL = '';

  valueTrue = true;
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
    private datePipe: DatePipe,
    public phoneUtils: PhoneUtils,
  ) {
    super('id');
    this.formAddHotel = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      phoneNo: [null, [Validators.required]],
      contactEmail: [null, [Validators.required]],
      address: [null, [Validators.required]],
      description: [null],
      websiteUrl: [null, [Validators.required]],
      utilitieIds: [null],
      // facebook: [null, [Validators.required]],
      ratingStar: [null, [Validators.required]],
      numRooms: [null, [Validators.required]],
      hotelFile: [[]],
      hotelFileIds: [[]],
    });

    this.formAddRoom = this.fb.group({
      id: [null],
      hotelId: [null],
      name: [null, [Validators.required]],
      description: [null],
      roomNumber: [null, [Validators.required]],
      floorNumber: [null, [Validators.required]],
      price: [null, [Validators.required]],
      extraBed: [null],
      extraBedPrice: [null],
      adultSurcharge: [null],
      childSurcharge: [null],
      roomFiles: [[]],
      roomFileIds: [[]],
      utilitieIds: [null],
    });

    this.uploadHeader = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    };

    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload`;


    this.contentFileConfirmBookingRoonHotel = ``
  }
  payload = {
    page: 1,
    pageSize: 1000
  };

  ngOnInit(): void {
    this.getUserInfo();
    this.getListUtilityHotels();
    this.getListUtilityRooms();
    this.getListData();
  }

  ngOnDestroy(): void {

  }

  getUserInfo() {
    this.userInfor = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    // console.log('this.userInfor: ', this.userInfor);
  }

  getListData() {
    this.loading = true;
    this.generalService.getAdminBookingHotels(this.payload).subscribe(
      {
        next: (res: any) => {
          this.datas = res.data;
          let stt = 0;
          this.datas.forEach((en: any) => {
            en.stt = ++stt;
            en.bookingStatusText = (new BookingHotelStatusPipe()).transform(en.bookingStatus);
            let sttx = 0;
            en.bookingHotelDetails.forEach(element => {
              en.isOnSendEmailLoading = false;
              element.stt = ++sttx;
            });
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


  getListUtilityHotels() {
    this.generalService.getListUtilityHotel().subscribe((res: any) => {
      this.listUtilityHotel = res.data;
      // console.log("this.listUtilityHotel: ", this.listUtilityHotel);
    });
  }


  getListUtilityRooms() {
    this.generalService.getListUtilityRoom().subscribe((res: any) => {
      this.listUtilityRoom = res.data;
    });
  }

  private validateEmail(mail: any) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) || !mail) {
      return (true);
    }
    return (false);
  }

  get formControlHotel() {
    return this.formAddHotel.controls;
  }

  get formControlRoom() {
    return this.formAddRoom.controls;
  }



  showDeleteConfirm(id: any): void {
    this.modalService.confirm({
      nzTitle: 'Bạn có chắc muốn xóa khách sạn này?',
      nzContent: '<b style="color: red;">khách sạn sẽ không thể hoàn tác sau khi xoá. Ấn đồng ý để xoá</b>',
      nzOkDanger: true,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOnOk: () => this.deleteItem(id)
    });
  }

  deleteItem(id) {
    // Delete workspace here
    this.generalService.deleteHotelByID(id).subscribe((res: any) => {
      // Do some logic and close the popup
      if (res && res.ret && res.ret[0].code !== 0) {
        this.notificationService.showNotification(Constant.ERROR, 'Không thể xóa.');
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
        this.getListData();
      }
    }, error => {
      // Error handling and close the popup
      this.notificationService.showNotification(Constant.ERROR, 'Đã có lỗi xảy ra!');
    });
  }

  showModalAddHotel() {
    this.isVisibleAddHotel = true;
    this.submitted = false;
    this.titleFormHotel = 'Thêm mới khách sạn';
    this.formAddHotel.reset();
    this.formAddHotel.patchValue({
      id: 0,
      name: '',
      code: '',
      phoneNo: '',
      contactEmail: '',
      address: '',
      description: '',
      websiteUrl: '',
      utilitieIds: [],
      // facebook: '',
      ratingStar: '',
      numRooms: '',
      hotelFile: [],
      hotelFileIds: []
    });
    this.fileList = [];
    this.listURLFiles = [];
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadHotelImage?hotelId=0`;
  }

  routingPageHotelAdd() {
    const data = {
      isUpdateHotel: false,
      item: {}
    };
    this.dataService.setData(data);
    this.router.navigate(['hotel/edit-hotel']);
  }

  showModalUpdateHotel(data: any) {
    this.isVisibleAddHotel = true;
    this.submitted = false;
    this.item = data;
    this.titleFormHotel = 'Sửa thông tin khách sạn';
    this.updated = true;

    this.formAddHotel.patchValue({
      id: this.item.id,
      name: this.item.name,
      code: this.item.code,
      phoneNo: this.item.phoneNo,
      contactEmail: this.item.contactEmail,
      address: this.item.address,
      description: this.item.description,
      websiteUrl: this.item.websiteUrl,
      utilitieIds: this.getIDUtilityHotels(this.item.utilityHotels),
      ratingStar: this.item.ratingStar,
      numRooms: this.item.numRooms,
      hotelFile: this.item.hotelFile,
      hotelFileIds: []
    });

    this.fileList = [];
    for (const hotel of this.item.hotelFile) {
      const objHotel = {
        uid: hotel.id.toString(),
        name: hotel.fileName,
        url: `${this.configService.getConfig().api.baseUrl}/${hotel.filePath}`,
      }
      this.fileList.push(objHotel)
    }
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadHotelImage?hotelId=${this.item.id}`;
  }

  routingPageHotelUpdate(item: any) {
    const data = {
      isUpdateHotel: true,
      item: item,
    };
    this.dataService.setData(data);
    this.router.navigate(['hotel/edit-hotel']);
  }

  onConfirmBookingHotel(booking: any) {
    this.item = booking;
    this.isVisibleConfirmBooking = true;
    this.confirmBookingHotel.approvalCodeConfirm = booking.approvalCode;
    this.confirmBookingHotel.textValueNoteConfirm = booking.bookingNote;
    this.submitted = false;
    // this.resetConfirmBookingHotel();
  }


  onConfirmSendEmailBookingHotel(booking: any) {
    this.item = booking;
    booking.isOnSendEmailLoading = true;
    this.generalService.getBookingHotelById(booking.id)
      .subscribe({
        next: (res) => {
          if (res) {
            if (res.id === 0) {
              this.notificationService.showNotification(Constant.ERROR, 'Dữ liệu đặt phòng không tồn tại');
            } else {
              this.item = res;
              this.findDataBookingHotelInFormEditor(this.item).then((r) => {
                booking.isOnSendEmailLoading = false;
                this.isVisibleConfirmSendEmaiBooking = true;
              });


            }
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Không tồn tại dữ liệu');
          }
        },
        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Hệ thống gặp lỗi');
        },

        complete: () => {
        }
      })
      .add(() => {
      });
  }
  private findDataBookingHotelInFormEditor(dataBookingHotel: any) {
    this.imageLogoVHL = Constant.LOGO_VHL;
    return new Promise((resolve, reject) => {
      this.contentFileConfirmBookingRoonHotel = `<html lang="vi">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Xác nhận đặt phòng khách sạn</title>
      </head>

      <body>
          <div style="margin: 8px; padding: 8px 8px 8px 16px; border: solid 1px #000; border-radius: 8px;">
              <div>
                  <!-- Title -->
                  <div style="display: inline-block;">
                      <img id="logo-vhl" style="width: 5em; height: 5rem;" src='${this.imageLogoVHL}'>
                  </div>

                  <div>
                      <p style="margin: 0; font-family: Arial, sans-serif; text-align:center;">
                          <strong><span style="font-size: 20px; line-height: 150%; color: #00B050;"><u>BẢNG XÁC NHẬN PHÒNG Ở KHÁCH SẠN</u></span></strong>
                      </p>
                  </div>

                  <!-- Content -->
                  <div>
                      <p style=" margin-bottom: 8.0pt; font-size: 14px; font-family: Arial, sans-serif; text-align:right;">
                          <em>Ngày ${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}</em>
                      </p>
                      <p style="margin-bottom: 8.0p; font-size: 15px; font-family: Arial, sans-serif; line-height: 175%;"> Kính gửi:
                          <strong>Anh/Chị ${dataBookingHotel.contactName}
                          </strong>
                      </p>
                      <p style=" margin-bottom: 8.0p; font-size: 14px; font-family: Arial, sans-serif; line-height: 175%;">
                          Cảm ơn anh/chị đã chọn CAO NGUYÊN VIỆT làm đối tác dịch vụ đặt phòng khách sạn cho chuyến đi sắp
                          tới. Chúng tôi gửi báo giá lại thông tin đặt phòng như sau:</p>
                      <table style="width: 100.0%; border-collapse: collapse; border: none;">
                          <tbody>
                              <tr>
                                  <td colspan="2" style="width: 17.48%; padding: 0in 5.4pt;">
                                      <span style="font-size: 14px; line-height: 175%;">Tên khách sạn :</span>
                                  </td>
                                  <td colspan="6" style="width: 54.48%; padding: 0in 5.4pt;">
                                      <span style="font-size: 14px; line-height: 175%;"><strong>${dataBookingHotel.bookingHotelDetails[0].hotelName}</strong></span>
                                  </td>
                                  <td colspan="3" style="width: 28.04%; padding: 0in 5.4pt;">
                                      <span style="font-size: 14px; line-height: 175%;" style="text-align: left;">
                                      </span>
                                  </td>
                              </tr>
                              <tr>
                                  <td colspan="2" style="width: 17.48%; padding: 0in 5.4pt;">
                                      <span style="font-size: 14px; line-height: 175%;">Địa chỉ :</span>
                                  </td>
                                  <td colspan="6" style="width: 54.48%; padding: 0in 5.4pt;">
                                      <span style="font-size: 14px; line-height: 175%;">${dataBookingHotel.bookingHotelDetails[0].hotelAddress}</span>
                                  </td>
                                  <td colspan="3" style="width: 28.04%; padding: 0in 5.4pt;">
                                      <span style="font-size: 14px; line-height: 175%;" style="text-align: left;">
                                      </span>
                                  </td>
                              </tr>
                              <tr>

                                  <td colspan="2" style="width: 17.48%; padding: 0in 5.4pt;">
                                      <span style="font-size: 14px; line-height: 175%;">Số điện thoại :</span>
                                  </td>
                                  <td colspan="6" style="width: 54.48%; padding: 0in 5.4pt;">
                                      <span style="font-size: 14px; line-height: 175%;">${dataBookingHotel.bookingHotelDetails[0].hotelPhone}</span>
                                  </td>
                                  <td colspan="3" style="width: 28.04%; padding: 0in 5.4pt;">

                                      <span style="font-size: 14px; line-height: 175%; text-align: left;">
                                          Website : <a style="color:#5B9BD5;" href="http://www.add41hotel.com">www.add41hotel.com</a>
                                      </span>
                                  </td>
                              </tr>
                              <tr>
                                  <td colspan="2" style="width: 17.48%; padding: 0in 5.4pt;">
                                      <span style="font-size: 14px; line-height: 175%;">Mã xác nhận :</span>
                                  </td>
                                  <td colspan="6" style="width: 54.48%; padding: 0in 5.4pt;">
                                      <span style="font-size: 14px; line-height: 175%;"><span style="color:red;"><strong>${dataBookingHotel.approvalCode ? dataBookingHotel.approvalCode : ''}</strong></span></span>
                                  </td>
                                  <td colspan="3" style="width: 28.04%; padding: 0in 5.4pt;">
                                      <span style="font-size: 14px; line-height: 175%; text-align: left;">
                                      </span>
                                  </td>
                              </tr>
                              <tr>
                                  <td colspan="11" style="padding: 0in 5.4pt;">
                                      <span style="font-size: 14px; line-height: 175%; text-align: left;">Thông tin quý khách:
                                      </span>
                                  </td>
                              </tr>
                              <tr>
                                  <td
                                      style="width:5.2%; border: 1pt solid #000; background: rgb(197, 224, 179); padding: 0in 5.4pt; vertical-align: center;">
                                      <p style="margin-bottom: 0in; font-size: 14px; text-align: center; line-height: 150%;">
                                          <strong>STT</strong>
                                      </p>
                                  </td>
                                  <td colspan="2"
                                      style="width: 23.22%; border: 1pt solid #000; background: rgb(197, 224, 179); padding: 0in 5.4pt; vertical-align: center;">
                                      <p style="margin-bottom: 0in; font-size: 14px; text-align: center; line-height: 150%;">
                                          <strong>Tên khách</strong>
                                      </p>
                                  </td>
                                  <td
                                      style="width: 11.84%; border: 1pt solid #000; background: rgb(197, 224, 179); padding: 0in 5.4pt; vertical-align: center;">
                                      <p style="margin-bottom: 0in; font-size: 14px; text-align: center; line-height: 150%;">
                                          <strong>Loại phòng</strong>
                                      </p>
                                  </td>
                                  <td
                                      style="width: 9.88%; border: 1pt solid #000; background: rgb(197, 224, 179); padding: 0in 5.4pt; vertical-align: center;">
                                      <p style="margin-bottom: 0in; font-size: 14px; text-align: center; line-height: 150%;">
                                          <strong>SL Phòng</strong>
                                      </p>
                                  </td>
                                  <td
                                      style="width: 10.42%; border: 1pt solid #000; background: rgb(197, 224, 179); padding: 0in 5.4pt; vertical-align: center;">
                                      <p style="margin-bottom: 0in; font-size: 14px; text-align: center; line-height: 150%;">
                                          <strong>Check-in</strong>
                                      </p>
                                  </td>
                                  <td
                                      style="width: 10.42%; border: 1pt solid #000; background: rgb(197, 224, 179); padding: 0in 5.4pt; vertical-align: center;">
                                      <p style="margin-bottom: 0in; font-size: 14px; text-align: center; line-height: 150%;">
                                          <strong>Check-out</strong>
                                      </p>
                                  </td>
                                  <td colspan="2"
                                      style="width: 8.1%; border: 1pt solid #000; background: rgb(197, 224, 179); padding: 0in 5.4pt; vertical-align: center;">
                                      <p style="margin-bottom: 0in; font-size: 14px; text-align: center; line-height: 150%;">
                                          <strong>Số đêm</strong>
                                      </p>
                                  </td>
                                  <td
                                      style="width: 10.34%; border: 1pt solid #000; background: rgb(197, 224, 179); padding: 0in 5.4pt; vertical-align: center;">
                                      <p style="margin-bottom: 0in; font-size: 14px; text-align: center; line-height: 150%;">
                                          <strong>Giá phòng</strong>
                                      </p>
                                  </td>
                                  <td
                                      style="width: 10.58%; border: 1pt solid #000; background: rgb(197, 224, 179); padding: 0in 5.4pt; vertical-align: center;">
                                      <p style="margin-bottom: 0in; font-size: 14px; text-align: center; line-height: 150%;">
                                          <strong>Thành tiền</strong>
                                      </p>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="width:5.2%; border: 1pt solid #000; padding: 0in 5.4pt;">
                                      <p style="text-align: center; line-height: 150%;">
                                          <span>1</span>
                                      </p>
                                  </td>
                                  <td colspan="2" style="border: 1pt solid #000; padding: 0in 5.4pt;">
                                      ${this.getListInerHTMLCustomerInfoContentName(dataBookingHotel.bookingHotelDetails[0].bookingHotelPassengers)}
                                  </td>
                                  <td style="width:11.84%; border: 1pt solid #000; padding: 0in 5.4pt;">
                                      <p style="text-align: center; line-height: 150%;">
                                          <span>${dataBookingHotel.bookingHotelDetails[0].roomName}</span>
                                      </p>
                                  </td>
                                  <td style="width:9.88%; border: 1pt solid #000; padding: 0in 5.4pt;">
                                      <p style="text-align: center; line-height: 150%;">
                                          <span>${dataBookingHotel.bookingHotelDetails[0].amount}</span>
                                      </p>
                                  </td>
                                  <td style="width:10.42%; border: 1pt solid #000; padding: 0in 5.4pt;">
                                      <p style="text-align: center; line-height: 150%;">
                                          <span>${dataBookingHotel.bookingHotelDetails[0].checkinDate ?
          this.datePipe.transform(dataBookingHotel.bookingHotelDetails[0].checkinDate,
            'dd/MM/yyyy') : ''}</span>
                                      </p>
                                  </td>
                                  <td style="width:10.42%; border: 1pt solid #000; padding: 0in 5.4pt;">
                                      <p style="text-align: center; line-height: 150%;">
                                          <span>${dataBookingHotel.bookingHotelDetails[0].checkoutDate ?
          this.datePipe.transform(dataBookingHotel.bookingHotelDetails[0].checkoutDate,
            'dd/MM/yyyy') : ''}</span>
                                      </p>
                                  </td>
                                  <td colspan="2" style="width:8.1%; border: 1pt solid #000; padding: 0in 5.4pt;">
                                      <p style="text-align: center; line-height: 150%;">
                                          <span>${dataBookingHotel.bookingHotelDetails[0].numberOfNights}</span>
                                      </p>
                                  </td>
                                  <td style="width:10.34%; border: 1pt solid #000; padding: 0in 5.4pt;">
                                      <p style="text-align: center; line-height: 150%;">
                                          <span>${MoneyUtils.formatCurrencyVND(dataBookingHotel.bookingHotelDetails[0].price)}</span>
                                      </p>
                                  </td>
                                  <td style="width:10.58%; border: 1pt solid #000; padding: 0in 5.4pt;">
                                      <p style="text-align: center; line-height: 150%;">
                                          <span>${MoneyUtils.formatCurrencyVND(dataBookingHotel.bookingHotelDetails[0].totalPrice)}</span>
                                      </p>
                                  </td>
                              </tr>
                              <tr>
                                  <td colspan="7" style="width: 70.98%; border: 1pt solid #000; padding: 0in 5.4pt;">
                                      <p style="text-align: center; line-height: 150%;">
                                      </p>
                                  </td>
                                  <td colspan="3" style="width: 18.44%; border: 1pt solid #000; padding: 0in 5.4pt;">
                                      <p style="text-align: center; line-height: 150%; text-align: center;">
                                          <strong><span>Tổng cộng</span></strong>
                                      </p>
                                  </td>
                                  <td style="width: 10.58%; border: 1pt solid #000; padding: 0in 5.4pt;">
                                      <p style="text-align: center; line-height: 150%;">
                                          <strong><span>${MoneyUtils.formatCurrencyVND(dataBookingHotel.totalPrice)}</span></strong>
                                      </p>
                                  </td>
                              </tr>
                              <tr>
                                  <td colspan="11" style="padding: 0in 5.4pt;">
                                      <p style="text-align: left; line-height: 150%;"> Bằng chữ: <em>${MoneyUtils.convertMoneyText(dataBookingHotel.totalPrice)}</em></p>
                                  </td>
                              </tr>
                          </tbody>
                      </table>


                      <div>
                          <dl>
                              <dt><strong>1. Tiền phòng bao gồm:</strong></dt>
                              <dd style="margin-top: 4px;">- Ăn sáng tự chọn</dd>
                              <dd style="margin-top: 4px;">- Nước uống chào đón khi nhận phòng</dd>
                              <dd style="margin-top: 4px;">- Trà, café và nước suối mỗi ngày</dd>
                              <dd style="margin-top: 4px;">- Miễn phí truy cập wifi, bãi đậu xe</dd>
                              <dd style="margin-top: 4px;">- Thuế VAT và phí phục vụ</dd>
                              <dt style="margin-top: 8px;"><strong>2. Thời gian nhận và trả phòng:</strong></dt>
                              <dd style="margin-top: 4px;">- Giờ nhận phòng từ sau 14:00</dd>
                              <dd style="margin-top: 4px;">- Nhận phòng trước 6:00 : tính 100% tiền phòng đêm đầu tiên</dd>
                              <dd style="margin-top: 4px;">- Nhận phòng sớm từ 6:00 đến 9:00 : tính 50% tiền phòng đêm đầu
                                  tiên
                              </dd>
                              <dd style="margin-top: 4px;">- Nhận phòng sớm từ 9:00 đến 14:00 : tính 30% tiền phòng đêm đầu
                                  tiên
                              </dd>
                              <dd style="margin-top: 4px;">- Giờ trả phòng trước 12:00</dd>
                              <dd style="margin-top: 4px;">- Trả phòng muộn từ 12:00 đến 15:00 : tính 30% tiền phòng</dd>
                              <dd style="margin-top: 4px;">- Trả phòng muộn từ 15:00 đến 18:00 : tính 50% tiền phòng</dd>
                              <dd style="margin-top: 4px;">- Trả phòng muộn sau 18:00 : tính 100% tiền phòng</dd>
                              <dt style="margin-top: 8px;"><strong>3. Hình thức thanh toán: chuyển khoản:</strong></dt>
                              <dd style="margin-top: 4px;">- Thanh toán 100% khi nhận được xác nhận đặt phòng để đảm bảo cho việc giữ phòng</dd>
                              <dd style="margin-top: 4px;">- Đơn vị thụ hưởng: Cty TNHH TM DV DL CAO NGUYÊN VIỆT</dd>
                              <dd style="margin-top: 4px;">- Số tài khoản: 878978999999 tại NH Quân đội (MB Bank)</dd>
                          </dl>
                      </div>
                      <p style="margin-top: 3pt; line-height: 150%;">
                          Xin cảm ơn và chúc anh có chuyến nghỉ dưỡng vui vẻ</p>
                  </div>
              </div>

              <!-- Footer -->
              <div>
                  <div style='margin-bottom:8.0pt;border-bottom:solid 1.0pt;'>
                  </div>
                  <p>
                      Cty TNHH Du lịch CAO NGUYÊN VIỆT - VIET HIGHLAND TRAVEL</strong></p>
                  <p>
                      105H/15 Hồ Thị Kỷ, phường 1, quận 10, Tp. HCM</p>
                  <div style="display: inline-block;">
                      <sapn style="margin-right: 8px;">
                          Số điện thoại: 0868 456 9
                      </sapn>
                      <sapn style="margin-left: 8px; margin-right: 8px;">
                          Email: <a href="mailto:happy@vhl.vn">happy@vhl.vn</a>
                      </sapn>
                      <sapn style="margin-left: 8px;">
                          Website: <a href="www.vhl.vn">www.vhl.vn</a>
                      </sapn>
                  </div>
              </div>
          </div>

      </body>

      </html>`
      resolve(true);
    });
  }
  //   this.isVisibleConfirmSendEmaiBooking = true;
  // }
  private getListInerHTMLCustomerInfoContentName(bookingHotelPassengers: any) {
    let inerHTMLCustomerInfoVontentName = '';
    bookingHotelPassengers.forEach((objPassenger: any) => {
      inerHTMLCustomerInfoVontentName += `<div style="line-height: 200%; text-align: left;">${objPassenger.fullName}</div>`
    });
    return inerHTMLCustomerInfoVontentName;
  }
  private resetConfirmBookingHotel() {
    this.confirmBookingHotel.approvalCodeConfirm = '',
      this.confirmBookingHotel.textValueNoteConfirm = ''
  }

  onRefuseBookingHotel(booking: any) {
    this.item = booking;
    this.isVisibleRefuseBooking = true;
  }


  getIDUtilityHotels(utilityHotel: any) {
    const s = [];
    for (var i = 0; i < utilityHotel.length; i++) {
      s[i] = utilityHotel[i].id;
    }
    return s;
  }


  handleCancel() {
    this.isVisibleAddHotel = false;
    this.isVisibleAddRoom = false;
    this.updated = false;
    this.isVisibleDetailBookingHotelPassengers = false;
    this.isVisibleConfirmBooking = false;
    this.isVisibleRefuseBooking = false;
    this.isVisibleConfirmSendEmaiBooking = false;
    this.isConfirmSendEmailLoading = false;
    this.formAddHotel.reset();
    this.formAddRoom.reset();
  }

  handleCancelConfirmBooking() {
    this.isVisibleConfirmBooking = false;
    this.resetConfirmBookingHotel();
  }

  handleRemoveImageHotel = async (file: NzUploadFile): Promise<void> => {
    const idHotelImage = file.uid;
    this.generalService.deleteHotelImageByID(idHotelImage).subscribe(
      {
        next: (res) => {
          if (res) {
            if (res.ret && res.ret.length > 0) {
              res.ret.forEach((el: any) => {
                if (el.code === 0) {
                  this.msg.success(`Đã xoá ảnh ${file.name}.`);
                  this.getListData();
                } else if (res.code === 404) {
                  this.msg.error(`Không tìm thấy ảnh ${file.name}.`);
                } else {
                  this.msg.error(`Đã có lỗi xảy ra. Không thể xoá ảnh ${file.name}`);
                }
              });
            }
          } else {
            this.notificationService.showNotification(Constant.ERROR, `Hệ thống gặp lỗi, xoá ảnh ${file.name} thật bại.`);
          }
        },
        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, `Hệ thống gặp lỗi, xoá ảnh ${file.name} thật bại.`);
        },
        complete: () => {
        },

      }

    )
  }

  handleRemoveImageRoom = async (file: NzUploadFile): Promise<void> => {
    console.log('xoá file: ', file);
    const idHotelImage = file.uid;
    this.generalService.deleteRoomImageByID(idHotelImage).subscribe(
      {
        next: (res) => {
          if (res) {
            if (res.ret && res.ret.length > 0) {
              res.ret.forEach((el: any) => {
                if (el.code === 0) {
                  this.msg.success(`Đã xoá ảnh ${file.name}.`);
                  this.getListData();
                } else if (res.code === 404) {
                  this.msg.error(`Không tìm thấy ảnh ${file.name}.`);
                } else {
                  this.msg.error(`Đã có lỗi xảy ra. Không thể xoá ảnh ${file.name}`);
                }
              });
            }
          } else {
            this.notificationService.showNotification(Constant.ERROR, `Hệ thống gặp lỗi, xoá ảnh ${file.name} thật bại.`);
          }
        },
        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, `Hệ thống gặp lỗi, xoá ảnh ${file.name} thật bại.`);
        },
        complete: () => {
        },

      }

    )
  }



  saveHotel() {
    this.submitted = true;
    let formValue = this.formAddHotel.value;

    const checkEmail = this.validateEmail(formValue.contactEmail);
    if (!checkEmail) {
      this.notificationService.showNotification(Constant.ERROR, 'Email không đúng định dạng!');
      return;
    }
    if (this.formAddHotel.invalid) {
      this.notificationService.showNotification(Constant.ERROR, 'Tồn tại thông tin khách sạn chưa điền!');
      return;
    }

    // Sử dụng phương thức filter để lọc các phần tử có id trong danh sách idsUtilityHotels
    // const idsUtilityHotels = formValue.utilitieIds;
    // formValue.utilityHotels = this.listUtilityHotel.filter(utilityHotel => idsUtilityHotels.includes(utilityHotel.id));

    if (formValue.id === 0) {
      delete formValue.id;
      delete formValue.hotelFile;
      /// add
      this.generalService.addHotel(formValue).subscribe((res: any) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.getListData();
          this.isVisibleAddHotel = false;
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
        }
      }, (error: any) => {

      });
    } else {
      // / update
      delete formValue.hotelFile;
      delete formValue.hotelFileIds;
      this.generalService.updateHotelByID(formValue.id, formValue).subscribe((res: any) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.getListData();
          this.isVisibleAddHotel = false;
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
        }
      }, error => {

      })
    }
  }



  onDeleteClick(id: any): void {
    // alert(id)
    const c = confirm('Bạn có chắc muốn xóa khách sạn này?');
    // this.modalService.confirm({
    //   nzTitle: 'Confirm',
    //   nzContent: 'Bạn có muốn xóa hay không?',
    //   nzOkText: 'Đồng ý',
    //   nzCancelText: 'Bỏ qua',
    //   nzOnOk: () => this.deleteItem(id)
    // });
    if (c === true) {
      // Delete workspace here
      this.generalService.deleteTaikhoan(id).subscribe(res => {
        // Do some logic and close the popup
        if (res && res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, 'Không thể xóa.');
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
          this.getListData();
        }
      }, error => {
        // Error handling and close the popup
        this.notificationService.showNotification(Constant.ERROR, 'Đã có lỗi xảy ra!');
      });
    } else {
    }
  }

  exportData() {
    this.dataGridDetail.instance.exportToExcel(false);
  }


  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const from = this.dateFormatPipe.transformFull(new Date(), Constant.DATE_FMT_STR);
    const dateStr = from;
    const fileName = `DS_Dat_khach_san_${dateStr}`;
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName + '.xlsx');
      });
    });
    e.cancel = true;
  }

  onSearch() {
    const keyword = removeAccents(this.searchText.trim().toLowerCase());
    console.log(keyword);
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


  previewDetailBookingHotelPassengers(bookingHotelPassengers: any) {
    this.isVisibleDetailBookingHotelPassengers = true;
    this.listBookingHotelPassengers = bookingHotelPassengers;
    let stt = 0;
    this.listBookingHotelPassengers.forEach(en => {
      en.stt = ++stt;
    });
  }

  showModalAddRoom(idHotel: any) {
    this.isVisibleAddRoom = true;
    this.submitted = false;
    this.titleFormRoom = 'Thêm mới phòng';
    this.formAddRoom.reset();
    this.formAddRoom.patchValue({
      id: 0,
      name: '',
      description: '',
      hotelId: idHotel,
      hotelName: '',
      roomNumber: '',
      floorNumber: '',
      price: '',
      extraBed: '',
      extraBedPrice: '',
      adultSurcharge: '',
      childSurcharge: '',
      roomFiles: [],
      roomFileIds: [],
      utilitieIds: [],
    });
    this.fileList = [];
    this.listURLFiles = [];
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadRoomImage?roomId=0`;
  }

  showModalUpdateRoom(idHotel: any, data: any) {
    this.isVisibleAddRoom = true;
    this.submitted = false;
    this.item = data;
    this.titleFormRoom = 'Sủa thông tin phòng';
    this.updated = true;

    this.formAddRoom.patchValue({
      id: this.item.id,
      hotelId: idHotel,
      name: this.item.name,
      description: this.item.description,
      roomNumber: this.item.roomNumber,
      floorNumber: this.item.floorNumber,
      price: this.item.price,
      extraBed: this.item.extraBed,
      extraBedPrice: this.item.extraBedPrice,
      adultSurcharge: this.item.adultSurcharge,
      childSurcharge: this.item.childSurcharge,
      roomFiles: this.item.roomFiles,
      roomFileIds: [],
      utilitieIds: this.getIDUtilityRooms(this.item.utilityRooms),
    });

    this.fileList = [];
    for (const room of this.item.roomFiles) {
      const objRoom = {
        uid: room.id.toString(),
        name: room.fileName,
        url: `${this.configService.getConfig().api.baseUrl}/${room.filePath}`,
      }
      this.fileList.push(objRoom)
    }
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadRoomImage?roomId=${this.item.id}`;
  }

  saveRoom() {
    this.submitted = true;
    let formValue = this.formAddRoom.value;

    if (this.formAddRoom.invalid) {
      this.notificationService.showNotification(Constant.ERROR, 'Tồn tại thông tin khách sạn chưa điền!');
      return;
    }

    // const idsUtilityRooms = formValue.utilityRooms;
    // Sử dụng phương thức filter để lọc các phần tử có id trong danh sách idsUtilityRooms
    // formValue.utilityRooms = this.listUtilityRoom.filter(utilityRoom => idsUtilityRooms.includes(utilityRoom.id));

    if (formValue.id === 0) {
      // add
      delete formValue.id;
      delete formValue.roomFiles;
      this.generalService.addRoom(formValue).subscribe((res: any) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.getListData();
          this.isVisibleAddRoom = false;
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
        }
      }, (error: any) => {

      });
    } else {
      // / update
      delete formValue.roomFiles;
      delete formValue.roomFileIds;
      this.generalService.updateRoomByID(formValue.id, formValue).subscribe((res: any) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.getListData();
          this.isVisibleAddRoom = false;
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
        }
      }, error => {

      })
    }
  }

  previewImages(images: any) {
    console.log('image: ', images);
    let arrImage: any[] = [];
    if (typeof images === 'string') {
      let objImage = {
        src: images,
        width: '50%',
        height: '50%',
        alt: 'Ảnh trực quan'
      }
      arrImage.push(objImage);
    } else {
      images.forEach((objImage: any) => {
        let objImageView = {
          src: `${this.configService.getConfig().api.baseUrl}/${objImage.filePath}`,
          width: '50%',
          height: '50%',
          alt: 'Ảnh trực quan'
        }
        arrImage.push(objImageView);
      });
    }
    this.nzImageService.preview(arrImage, { nzZoom: 1.5, nzRotate: 0 });
  }

  handleChangeImages({ file, fileList }: NzUploadChangeParam, form: any): void {
    const status = file.status;
    if (status === 'done') {
      this.msg.success(`file ${file.name} tải lên thành công.`);
      console.log(file, fileList);
      this.fileList = fileList;
      console.log('this.fileList', this.fileList);
      if (form === 'hotel') {
        setTimeout(() => {
          if (this.fileList.length > 0) {
            this.fileList[this.fileList.length - 1].uid = file.response.hotelFileId.toString();
            this.fileList[this.fileList.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${file.response.path}`;
            // this.fileList[this.fileList.length - 1] = {
            //   uid: file.response.hotelFileId.toString(),
            //   name: file.response.fileName,
            //   url: `${this.configService.getConfig().api.baseUrl}/${file.response.path}`,
            //   "status": "success",
            //   "isUploading": false,
            //   "showDownload": true,
            // };
          }
        }, 200);
        this.listURLFiles.push(file.response.hotelFileId);
        console.log('this.listURLFiles: ', this.listURLFiles);
        this.formAddHotel.controls['hotelFileIds'].setValue(this.listURLFiles);
      } else if (form === 'room') {
        setTimeout(() => {
          if (this.fileList.length > 0) {
            this.fileList[this.fileList.length - 1].uid = file.response.roomFileId.toString();
            this.fileList[this.fileList.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${file.response.path}`;
          }
        }, 200);
        this.listURLFiles.push(file.response.roomFileId);
        console.log('this.listURLFiles: ', this.listURLFiles);
        this.formAddRoom.controls['roomFileIds'].setValue(this.listURLFiles);
      }
    } else if (status === 'error') {
      this.msg.error(`file ${file.name} tải lên không thành công.`);
    }
  }

  // switchValueIsAvaliable = false;
  clickSwitchIsAvaliable(isAvaliableUpdate: boolean, roomID: any): void {
    this.generalService.SetAvailableRoom({ roomId: roomID, isAvailable: isAvaliableUpdate }).subscribe(
      {
        next: (res) => {
          if (res.ret && res.ret[0].code !== 0) {
            this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
          } else {
            this.getListData();
            this.isVisibleAddRoom = false;
            this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật trạng thái phòng thành công');
          }
        },

        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Cập nhật trạng thái phòng thất bại');
        },

        complete: () => {

        }

      }
    );
  }

  getIDUtilityRooms(utilityRooms: any) {
    const ids = [];
    for (var i = 0; i < utilityRooms.length; i++) {
      ids[i] = utilityRooms[i].id;
    }
    return ids;
  }

  handleOkConfirmBookingHotel() {
    return new Promise((resolve, reject) => {
      this.isConfirmLoading = true;
      this.submitted = true;
      this.generalService
        .confirmBooking({ id: this.item.id, note: this.confirmBookingHotel.textValueNoteConfirm, approvalCode: this.confirmBookingHotel.approvalCodeConfirm })
        .subscribe({
          next: (res) => {
            if (res.isValid) {
              this.notificationService.showNotification(Constant.SUCCESS, 'Xác nhận đặt phòng thành công');
              resolve(true);
              this.isVisibleConfirmBooking = false;
              this.getListData();
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Xác nhận đặt phòng thật bại');
              }
            }
          },
          error: (error) => {
            this.notificationService.showNotification(Constant.ERROR, 'Xác nhận đặt phòng thật bại');
          },

          complete: () => {
          }
        })
        .add(() => {
          this.isConfirmLoading = false;
        });
    });

  }

  handleOkRefuse() {
    this.isRefuseLoading = true;
    this.generalService
      .refuseBooking({ id: this.item.id, note: this.textValueNoteRefuse })
      .subscribe({
        next: (res) => {
          if (res.isValid) {
            this.notificationService.showNotification(Constant.SUCCESS, 'Từ chối đặt phòng thành công');
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, 'Từ chối đặt phòng thật bại');
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Từ chối đặt phòng thật bại');
            }
          }
        },
      })
      .add(() => {
        this.isRefuseLoading = false;
        this.isVisibleRefuseBooking = false;
        this.getListData();
      });
  }


  handleOkConfirmSendEmailBookingHotel() {
    this.isConfirmSendEmailLoading = true;
    let emailContact = this.item.contactEmail;
    if (!StringUtils.validateEmail(emailContact)) {
      this.notificationService.showNotification(Constant.ERROR, 'Email người gửi chưa đúng định dạng');
      return;
    }
    let bookingHotelId = this.item.id;
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.contentFileConfirmBookingRoonHotel;
    let logoVHL = tempDiv.querySelector<HTMLElement>('#logo-vhl');
    if (logoVHL) {
      logoVHL.setAttribute('src', 'cid:LogoImage');
    }
    let serializer = new XMLSerializer();
    let tempDivString = serializer.serializeToString(tempDiv);
    let payloadSendEmailConfirmedBookingHotel = {
      toEmail: emailContact,
      subject: 'Xác nhận đặt phòng khách sạn',
      content: tempDivString,
      bookingHotelId: bookingHotelId
    }
    this.generalService
      .sendEmailConfirmedBookingHotel(payloadSendEmailConfirmedBookingHotel)
      .subscribe({
        next: (res) => {
          if (res.isValid) {
            this.notificationService.showNotification(Constant.SUCCESS, 'Xác nhận gửi Email đặt phòng thành công');
            this.isVisibleConfirmSendEmaiBooking = false;
            this.isConfirmSendEmailLoading = false;
            // this.getListData();
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Gửi Email đặt phòng thật bại');
            }
          }
        },
        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Gửi Email đặt phòng gặp lỗi');
        },

        complete: () => {
        }
      })
      .add(() => {

      });
  }

  handleConfirmAndSendBookingHotel() {
    this.handleOkConfirmBookingHotel().then(() => this.onConfirmSendEmailBookingHotel(this.item));
  }

  onChangeStatusBookingHotelExport(hotelFlightExport: any) {
    if (!hotelFlightExport.systemCancelled) {
      this.modalService.confirm({
        nzTitle: `Bạn có chắc KHÔNG tính chi phí khách sạn của khách hàng <strong>${hotelFlightExport.contactName? hotelFlightExport.contactName : ''}</strong> vào công nợ`,
        nzContent: `<b style="color: red;">Việc KHÔNG tính chi phí khách sạn của khách hàng <strong>${hotelFlightExport.contactName? hotelFlightExport.contactName : ''} vào công nợ sẽ không thể hoàn tác. Ấn đồng ý để tiếp tục</b>`,
        nzOkDanger: true,
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOnOk: () => this.changeSystemStatusBookingHotelExport(hotelFlightExport.id),
      });
    }
  }


  changeSystemStatusBookingHotelExport(idBookingTicketFlightExp: any) {
    this.generalService.markCanceledSystemBookingHotelExport(idBookingTicketFlightExp).subscribe({
      next: (res) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, 'Thiết lập không tính công nợ thành công');
        }
      },
      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Thiết lập không tính công nợ không thành công');
      },
      complete: () => {
        this.getListData();
      }
    });
  }

}
