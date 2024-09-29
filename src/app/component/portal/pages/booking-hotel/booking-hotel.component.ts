import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GeneralService } from 'src/app/service/general-service';
import { TableSelectionAbstract } from 'src/app/shared/component/table/table-selection.abstract';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
} from "devextreme-angular";

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { StringUtils } from 'src/app/shared/utils/string-utils.class';
import { MoneyUtils } from 'src/app/shared/utils/money-utils.class';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { BookingHotelStatusPipe } from 'src/app/shared/pipe/booking-hotel-status.pipe';
import { HotelBookingStatusEnum, HOTEL_BOOKING_STATUS_LIST } from 'src/app/enums/hotel-booking-status.enum';
import { UploadService } from 'src/app/service/upload-service';
import { ObjectValidator } from 'src/app/shared/custom-validator/objectValidator';
import { MinNumberValidator } from 'src/app/shared/custom-validator/minValueValidator';
import { WhiteSpaceValidator } from 'src/app/shared/custom-validator/whiteSpaceValidator';
import { CheckValidatorForm } from 'src/app/shared/custom-validator/checkValidatorForm';
import { Attachment } from 'src/app/model/attachment';
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
  nzVisibleCancelSystem: boolean = false;
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

  bookingCode: any;
  checkBookingId:any;
  dataEmail:any;
  // isOnSendEmailLoading: boolean = false;
  isConfirmSendEmailLoading: boolean = false;
  confirmBookingHotel = {
    textValueNoteConfirm: '',
    reservationCodeCodeConfirm: '',

  }

  systemCancelBookingHotel = {
    nodeSystemCancelled: '',
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
  isVisibleConfirmRoomId: boolean = false;

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
  STATUS_LIST = [...HOTEL_BOOKING_STATUS_LIST];
  isVisibleViewInVoice = false;
  dataDetailBookingHotel: any = null;

  detailContactUserForm: FormGroup;
  detailBookingGeneralForm: FormGroup;
  detailBookingRoomForm: FormGroup;
  detailHotelPassengerAdtForm: FormGroup[];
  detailHotelPassengerChdForm: FormGroup[];

  orderForm: FormGroup;
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
    private uploadService: UploadService,
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
    this.detailBookingRoomForm = this.fb.group({
      /// Thông tin đặt phòng
      id: [null], // ngày nhận phòng *
      hotelId: [null],
      inf: [null],
      price: [null],
      adultSurcharge: [null],
      childSurcharge: [null],
      extraBedPrice: [null],
      totalPrice: [null],

      checkinDate: [null, [Validators.required]], // ngày nhận phòng *
      checkoutDate: [null, [Validators.required]], // ngày trả phòng *
      numberOfNights: [null],// số đêm
      room: [null, [ObjectValidator()]], // loại phòng* // id name
      amount: [null, [MinNumberValidator(1)]],// số lượng phòng đăng ký*
      adt: [0, [MinNumberValidator(1)]],// số lượng người lớn >= 12 tuổi*
      chd: [0],// số lượng trẻ em 0-11 tuổi
      extraBed: [0],// số lượng giường phụ
      approvalCode: [null, [Validators.required, WhiteSpaceValidator()]]// mã phê duyệth
    });
    this.detailContactUserForm = this.fb.group({
      companyName: [null],
      userCode: [null],
      userFullName: [null],
    });
    this.detailBookingGeneralForm = this.fb.group({
      id: [null],
      isUrgent: [false],
      otherRequirements: [null]
    });
    this.detailHotelPassengerAdtForm = [];
    this.detailHotelPassengerChdForm = [];

    this.orderForm = fb.group({
      pdfFile: [null, Validators.required],
      xmlFile: [null, Validators.required]
    });

    this.uploadHeader = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    };

    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadHotelImage?hotelId=0`;


    this.contentFileConfirmBookingRoonHotel = ``;
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

  // onConfirmBookingHotel(booking: any) {
  //   this.item = booking;
  //   this.isVisibleConfirmBooking = true;
  //   this.confirmBookingHotel.reservationCodeCodeConfirm = booking.reservationCode;
  //   this.confirmBookingHotel.textValueNoteConfirm = booking.bookingNote;
  //   this.submitted = false;
  //   // this.resetConfirmBookingHotel();
  // }

  confirmBookingRoomId() {    
    if (this.bookingCode != this.checkBookingId) {
      this.notificationService.showNotification(Constant.ERROR, 'Mã không đúng');
      return;
    }else{
      this.isVisibleConfirmRoomId = false;
      this.onConfirmSendEmailBookingHotel(this.dataEmail);
    }
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
                          Số điện thoại: 028 3620 2800
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
    this.confirmBookingHotel.reservationCodeCodeConfirm = '';
    this.confirmBookingHotel.textValueNoteConfirm = '';
  }

  private resetConfirmSystemCancel() {
    this.systemCancelBookingHotel.nodeSystemCancelled = '';
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
    this.nzVisibleCancelSystem = false;
    this.isVisibleConfirmRoomId = false;
    this.formAddHotel.reset();
    this.formAddRoom.reset();
  }

  handleCancelConfirmBooking() {
    this.isVisibleConfirmBooking = false;
    this.resetConfirmBookingHotel();
  }

  handleCancelConfirmCancelSystem() {
    this.submitted = false;
    this.nzVisibleCancelSystem = false;
    this.resetConfirmSystemCancel();
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
    this.titleFormRoom = 'Sửa thông tin phòng';
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
      this.fileList = fileList;
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
        this.formAddHotel.controls['hotelFileIds'].setValue(this.listURLFiles);
      } else if (form === 'room') {
        setTimeout(() => {
          if (this.fileList.length > 0) {
            this.fileList[this.fileList.length - 1].uid = file.response.roomFileId.toString();
            this.fileList[this.fileList.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${file.response.path}`;
          }
        }, 200);
        this.listURLFiles.push(file.response.roomFileId);
        this.formAddRoom.controls['roomFileIds'].setValue(this.listURLFiles);
      }
    } else if (status === 'error') {
      this.msg.error(`file ${file.name} tải lên không thành công. ${file.error.error.text}`);
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
        .confirmBooking({ id: this.item.id, note: this.confirmBookingHotel.textValueNoteConfirm, reservationCode: this.confirmBookingHotel.reservationCodeCodeConfirm })
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
      subject: `Xác nhận đặt phòng với VHL – Mã đặt phòng: ${this.item.bookingCode}}`,
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
            if (this.checkBookingId != null) {      
              this.updateBookingHotelStatus(this.dataEmail.id, HotelBookingStatusEnum.Successful);
              this.checkBookingId == null;
              this.getListData();
            }
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
          console.log(error);
          
          this.notificationService.showNotification(Constant.ERROR, 'Gửi Email đặt phòng gặp lỗi');
        },

        complete: () => {
        }
      })
      .add(() => {

      });
      payloadSendEmailConfirmedBookingHotel == null;
  }

  handleConfirmAndSendBookingHotel() {
    this.handleOkConfirmBookingHotel().then(() => this.onConfirmSendEmailBookingHotel(this.item));
  }

  onChangeStatusBookingHotelExport(hotelFlightExport: any) {
    this.nzVisibleCancelSystem = true;
    this.item = hotelFlightExport;
    // if (!hotelFlightExport.systemCancelled) {
    //   this.modalService.confirm({
    //     nzTitle: `Bạn có chắc KHÔNG tính chi phí khách sạn của khách hàng <strong>${hotelFlightExport.contactName? hotelFlightExport.contactName : ''}</strong> vào công nợ`,
    //     nzContent: `<b style="color: red;">Việc KHÔNG tính chi phí khách sạn của khách hàng <strong>${hotelFlightExport.contactName? hotelFlightExport.contactName : ''} vào công nợ sẽ không thể hoàn tác. Ấn đồng ý để tiếp tục.</b>`,
    //     nzOkDanger: true,
    //     nzOkText: 'Đồng ý',
    //     nzCancelText: 'Không',
    //     nzOnOk: () => this.changeSystemStatusBookingHotelExport(hotelFlightExport.id),
    //   });
    // }
  }


  changeSystemStatusBookingHotelExport(idBookingTicketFlightExp: any, noteSystemCancelled: any) {
    this.submitted = true;
    if (!noteSystemCancelled) {
      this.notificationService.showNotification(Constant.ERROR, 'Nội dung ghi chú không được để trống');
      return;
    }
    let payload = { noteSystemCancelled: noteSystemCancelled };
    this.generalService.markCanceledSystemBookingHotelExport(idBookingTicketFlightExp, payload).subscribe({
      next: (res) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, 'Thiết lập không tính công nợ thành công');
          this.handleCancelConfirmCancelSystem();
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
  formatCurrencyVND(value: any) {
    if (!value) {
      return '0 đ';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  }
  //#region Room
  listRoomType: any[] = [];
  getRoomsByIdHotel(idHotel: number) {
    this.generalService.getRooms().subscribe({
      next: (res) => {
        this.listRoomType = res.rooms.filter(ele => ele.hotelId === idHotel).map((ele: any) => {
          return {
            id: ele.id,
            name: ele.name
          }
        });
      },
      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Có lỗi xảy ra');
      },
      complete: () => {
        // this.getListData();
      }
    })
  }
  //#endregion





  //#region hóa đơn
  @ViewChild('fileInputOrderPdf', { static: false }) orderPdfFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputOrderXml', { static: false }) orderXmlFileInput!: ElementRef<HTMLInputElement>;
  selectedOrderPdfFile: Attachment = { name: '', path: '', file: null };
  selectedOrderXmlFile: Attachment = { name: '', path: '', file: null };

  closeViewInVoice() {
    this.isVisibleViewInVoice = false;
  }
  showDialogSelectOrderPdfFile() {
    this.orderPdfFileInput.nativeElement.click();
  }
  showDialogSelectOrderXmlFile() {
    this.orderXmlFileInput.nativeElement.click();
  }
  onOrderPdfFileSelected(event: any): void { // đã chọn file đính kèm
    const input = event.target as HTMLInputElement; // trỏ đến thẻ input chứa file
    if (input.files && input.files.length > 0) { // input có chứa file
      let file = input.files[0]; // lấy ra file
      const fileExtension = file.name.split('.').pop()?.toLowerCase(); // lấy ra đuôi của file
      if (fileExtension === 'pdf') {
        this.orderForm.controls['pdfFile'].setValue(file.name);
        this.selectedOrderPdfFile.file = file;
        this.selectedOrderPdfFile.name = file.name;
        this.selectedOrderPdfFile.path = null;
      } else {
        // this.orderForm.controls['pdfFile'].reset();
        this.selectedOrderPdfFile = { name: '', path: '', file: null };
        this.notificationService.showNotification(Constant.ERROR, 'Chỉ nhận file pdf');
      }
    }
  }
  onOrderXmlFileSelected(event: any): void { // đã chọn file đính kèm
    const input = event.target as HTMLInputElement; // trỏ đến thẻ input chứa file
    if (input.files && input.files.length > 0) { // input có chứa file
      let file = input.files[0]; // lấy ra file
      const fileExtension = file.name.split('.').pop()?.toLowerCase(); // lấy ra đuôi của file
      if (fileExtension === 'xml') {
        this.orderForm.controls['xmlFile'].setValue(file.name);
        this.selectedOrderXmlFile.file = file;
        this.selectedOrderXmlFile.name = file.name;
        this.selectedOrderXmlFile.path = null;
      } else {
        // this.orderForm.controls['xmlFile'].reset();
        this.selectedOrderXmlFile = { name: '', path: '', file: null };
        this.notificationService.showNotification(Constant.ERROR, 'Chỉ nhận file xml');
      }
    }
  }
  viewOrderFilePdf() {
    window.open(this.uploadService.getFile(this.item.pdfFile), '_blank');
  }
  viewOrderFileXml() {
    window.open(this.uploadService.getFile(this.item.xmlFile), '_blank');
  }
  async uploadOrderFile() {
    let valid = CheckValidatorForm(this.orderForm);
    if (!valid) {
      this.notificationService.showNotification(Constant.ERROR, "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    let waitUpload = [];
    if (this.selectedOrderPdfFile.file) {
      let formDataPdf = new FormData();
      formDataPdf.append("postedFile", this.selectedOrderPdfFile.file);
      formDataPdf.append("BookingHotelId", this.item.id);
      waitUpload.push(this.uploadOrderPdf(formDataPdf));
    }
    if (this.selectedOrderXmlFile.file) {
      let formDataXml = new FormData();
      formDataXml.append("postedFile", this.selectedOrderXmlFile.file);
      formDataXml.append("BookingHotelId", this.item.id);
      waitUpload.push(this.uploadOrderXml(formDataXml));
    }
    await Promise.all(waitUpload).then((rev) => {
      this.getListData();
      this.isVisibleViewInVoice = false;
    })

  }
  uploadOrderPdf(formDataPdf): Promise<any> {
    return new Promise((rev, rej) => {
      this.uploadService.uploadOrderBookingHotelPdfFile(formDataPdf).subscribe({
        next: (res) => {
          this.notificationService.showNotification(Constant.SUCCESS, 'Tải hóa đơn thành công');
          rev(res.path);
        },
        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Tải hóa đơn không thành công');
          rej({});
        }
      });
    })
  }
  uploadOrderXml(formDataXml): Promise<any> {
    return new Promise((rev, rej) => {
      this.uploadService.uploadOrderBookingHotelXmlFile(formDataXml).subscribe({
        next: (res) => {
          this.notificationService.showNotification(Constant.SUCCESS, 'Tải hóa đơn thành công');
          rev(res.path);
        },
        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Tải hóa đơn không thành công');
          rej({});
        }
      });
    })
  }
  deleteOrderPdfFile() {
    this.uploadService.removeOrderBookingHotelPdfFile(this.item.id).subscribe({
      next: (res) => {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa hóa đơn thành công');
        this.orderForm.clearValidators();
        this.orderPdfFileInput.nativeElement.value = null;
        this.orderForm.controls['pdfFile'].setValue(null);
        this.selectedOrderPdfFile = { name: '', path: '', file: null };
      },
      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Xóa hóa đơn không thành công');
      },
      complete: () => {
        this.getListData();
      }
    });
  }
  deleteOrderXmlFile() {
    this.uploadService.removeOrderBookingHotelXmlFile(this.item.id).subscribe({
      next: (res) => {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa hóa đơn thành công');
        this.orderXmlFileInput.nativeElement.value = null;
        this.orderForm.controls['xmlFile'].setValue(null);
        this.selectedOrderXmlFile = { name: '', path: '', file: null };
      },
      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Xóa hóa đơn không thành công');
      },
      complete: () => {
        this.getListData();
      }
    });
  }
  onOpenViewInVoice(data: any) {
    this.item = data;
    this.isVisibleViewInVoice = true;
    this.orderForm.reset();
    if (this.item.pdfFile) {
      this.selectedOrderPdfFile = { name: this.item.pdfFile.split('/').pop(), path: this.item.pdfFile, file: null };
      this.orderForm.controls["pdfFile"].setValue(this.item.pdfFile.split('/').pop());
    }
    else {
      this.orderForm.controls["pdfFile"].setValue(null);
    }
    if (this.item.xmlFile) {
      this.selectedOrderXmlFile = { name: this.item.xmlFile.split('/').pop(), path: this.item.xmlFile, file: null };
      this.orderForm.controls["xmlFile"].setValue(this.item.xmlFile.split('/').pop());
    }
    else {
      this.orderForm.controls["xmlFile"].setValue(null);
    }
  }
  //#endregion





  //#region trạng thái
  statusOld = null;
  statusNew = null;
  handleChangeStatusByItem(oldValue: number, newValue: number, dataFocus: any) {
    if (newValue === HotelBookingStatusEnum.Failure) {
      this.updateBookingHotelStatus(dataFocus.data.id, HotelBookingStatusEnum.Failure);
      return;
    }
    if (newValue === HotelBookingStatusEnum.SendRequest && oldValue === HotelBookingStatusEnum.Holding) {
      this.updateBookingHotelStatus(dataFocus.data.id, HotelBookingStatusEnum.SendRequest);
      return;
    }
    if(newValue === HotelBookingStatusEnum.Successful && oldValue === HotelBookingStatusEnum.Confirmed){
      this.checkBookingId = dataFocus.data.bookingCode;
      this.dataEmail = dataFocus.data;
      this.isVisibleConfirmRoomId = true;
      return;
    }
    this.statusOld = oldValue;
    this.statusNew = newValue;
    this.item = dataFocus;
    if (this.checkCallShowEditBookingHotel(oldValue, newValue)) {
      this.showDetailBookingHotel(this.item.data.id, 'edit');
      this.isShowEditBookingHotel = true;
      this.modeViewEditStatus = 1;
      this.editBookingHotelHeader = "Cập nhật thông tin lưu trú";

    }
    else
    if (this.checkCallShowAddCodeBookingRoom(oldValue, newValue)) {
      this.bookingRoomCodeForm = this.fb.group({
        reservationCode: [null, Validators.required]
      })
      this.isShowAddCodeBookingRoom = true;
      }
    // else if(this)
  }
  updateBookingHotelStatus(bookingHotelId: number, status: number): Promise<any> {
    return new Promise((resolve, rejects) => {
      this.generalService.updateBookingHotelStatus(
        {
          bookingHotelId: bookingHotelId,
          status: status,
        }
      ).subscribe({
        next: (res) => {
          this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật trạng thái thành công');
          resolve(true);
        },
        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Cập nhật trạng thái không thành công');
          rejects(error);
        },
        complete: () => {
          this.getListData();
        }
      });
    });

  }
  checkCallShowEditBookingHotel(oldValue: number, newValue: number) {
    if (oldValue === HotelBookingStatusEnum.SendRequest && newValue === HotelBookingStatusEnum.Holding) {
      return true;
    }
    return false;
  }
  checkCallShowAddCodeBookingRoom(oldValue: number, newValue: number) {
    if (oldValue === HotelBookingStatusEnum.Holding && newValue === HotelBookingStatusEnum.Confirmed) {
      return true;
    }
    return false;
  }
  checkConfirmBookingRoomSuccess(oldValue: number, newValue: number) {
    if (oldValue === HotelBookingStatusEnum.Confirmed && newValue === HotelBookingStatusEnum.Successful) {
      return true;
    }
    return false;
  }
  //#endregion





  //#region chi tiết lưu trú
  editBookingHotelHeader = "Cập nhật thông tin lưu trú";
  isShowEditBookingHotel = false;
  cancelEditBookingHotel() {
    if (this.modeViewEditStatus === 1) {
      this.item.data.bookingStatus = this.statusOld;
    }
    this.isShowEditBookingHotel = false;
    this.isFirstLoadDetailBookingHotel = true;
  }
  resetDetailBookingForms() {
    this.detailContactUserForm.reset();
    this.detailBookingGeneralForm.reset();
    this.detailBookingRoomForm.reset();
    this.detailHotelPassengerAdtForm = [];
    this.detailHotelPassengerChdForm = [];
    this.dataDetailBookingHotel = null;
  }
  modeViewEditStatus = 0; // view 0 , edit 1
  // @type: [ edit , view ]
  // @idBookingHotel: id của yêu cầu đặt khách sạn
  // & điều hướng hiển thị view/edit chi tiết
  showDetailBookingHotel(idBookingHotel: any, type: string) {
    this.resetDetailBookingForms();
    this.generalService.getBookingHotelById(idBookingHotel).subscribe({
      next: (res) => {
        this.dataDetailBookingHotel = res;
        if (type === 'add') {
          this.showViewBookingHotel(res);
        } else {
          this.showEditBookingHotel(res);
          this.getRoomsByIdHotel(res.bookingHotelDetails[0].hotelId);
        }
      },
      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Có lỗi xảy ra');
      }
    })
  }
  // @data: res trả về api chi tiết
  // & set hoàn cảnh view chi tiết
  showViewBookingHotel(data: any) {
    this.setFormDetailBookingHotel(data);
    this.isShowEditBookingHotel = true;
    this.editBookingHotelHeader = "Xem yêu cầu lưu trú";
    this.modeViewEditStatus = 0;
  }
  // @data: res trả về api chi tiết
  // & set data vào form group
  setFormDetailBookingHotel(data: any) {
    // set thông tin chung
    this.detailBookingGeneralForm.controls['id'].setValue(data.id);
    this.detailBookingGeneralForm.controls['otherRequirements'].setValue(data.otherRequirements);
    this.detailBookingGeneralForm.controls['isUrgent'].setValue(data.isUrgent);

    // set thông tin người dặt vé
    this.detailContactUserForm.controls['companyName'].setValue(data.companyName);
    this.detailContactUserForm.controls['userCode'].setValue(data.userCode);
    this.detailContactUserForm.controls['userFullName'].setValue(data.userFullName);

    // set thông tin đặt phòng
    this.detailBookingRoomForm.controls['id'].setValue(data.bookingHotelDetails[0].id);
    this.detailBookingRoomForm.controls['hotelId'].setValue(data.bookingHotelDetails[0].hotelId);
    this.detailBookingRoomForm.controls['inf'].setValue(data.bookingHotelDetails[0].inf);
    this.detailBookingRoomForm.controls['price'].setValue(data.bookingHotelDetails[0].price);
    this.detailBookingRoomForm.controls['adultSurcharge'].setValue(data.bookingHotelDetails[0].adultSurcharge);
    this.detailBookingRoomForm.controls['childSurcharge'].setValue(data.bookingHotelDetails[0].childSurcharge);
    this.detailBookingRoomForm.controls['extraBedPrice'].setValue(data.bookingHotelDetails[0].extraBedPrice);
    this.detailBookingRoomForm.controls['totalPrice'].setValue(data.bookingHotelDetails[0].totalPrice);

    this.detailBookingRoomForm.controls['checkinDate'].setValue(new Date(data.bookingHotelDetails[0].checkinDate));
    this.detailBookingRoomForm.controls['checkoutDate'].setValue(new Date(data.bookingHotelDetails[0].checkoutDate));
    this.detailBookingRoomForm.controls['numberOfNights'].setValue(data.bookingHotelDetails[0].numberOfNights);
    this.detailBookingRoomForm.controls['room'].setValue({
      id: data.bookingHotelDetails[0].roomId,
      name: data.bookingHotelDetails[0].roomName
    });
    this.detailBookingRoomForm.controls['amount'].setValue(data.bookingHotelDetails[0].amount);
    this.detailBookingRoomForm.controls['adt'].setValue(data.bookingHotelDetails[0].adt);
    this.detailBookingRoomForm.controls['chd'].setValue(data.bookingHotelDetails[0].chd);
    this.detailBookingRoomForm.controls['extraBed'].setValue(data.bookingHotelDetails[0].extraBed);
    this.detailBookingRoomForm.controls['approvalCode'].setValue(data.approvalCode);
    // set giá trị thông tin người lưu trú (người lớn)
    let index = 0
    for (; index < this.detailBookingRoomForm.value.adt; index++) {
      let form = this.createBookingHotelPassengerForm(0);
      form.controls['id'].setValue(data.bookingHotelDetails[0].bookingHotelPassengers[index].id);
      form.controls['fullName'].setValue(data.bookingHotelDetails[0].bookingHotelPassengers[index].fullName);
      form.controls['phone'].setValue(data.bookingHotelDetails[0].bookingHotelPassengers[index].phone);
      form.controls['email'].setValue(data.bookingHotelDetails[0].bookingHotelPassengers[index].email);
      form.controls['passengerType'].setValue(data.bookingHotelDetails[0].bookingHotelPassengers[index].passengerType);
      form.controls['jobTitle'].setValue(data.bookingHotelDetails[0].bookingHotelPassengers[index].jobTitle);
      this.detailHotelPassengerAdtForm.push(form);
    }
    // set giá trị thông tin người lưu trú (trẻ em)
    for (; index < this.detailBookingRoomForm.value.chd + this.detailBookingRoomForm.value.adt; index++) {
      let form = this.createBookingHotelPassengerForm(1);
      form.controls['id'].setValue(data.bookingHotelDetails[0].bookingHotelPassengers[index].id);
      form.controls['fullName'].setValue(data.bookingHotelDetails[0].bookingHotelPassengers[index].fullName);
      form.controls['dateOfBirth'].setValue(new Date(data.bookingHotelDetails[0].bookingHotelPassengers[index].dateOfBirth));
      form.controls['height'].setValue(data.bookingHotelDetails[0].bookingHotelPassengers[index].height);
      form.controls['passengerType'].setValue(data.bookingHotelDetails[0].bookingHotelPassengers[index].passengerType);
      this.detailHotelPassengerChdForm.push(form);
    }
  }
  // @data: res trả về api chi tiết
  // & set hoàn cảnh edit chi tiết
  showEditBookingHotel(data: any) {
    this.setFormDetailBookingHotel(data);
    this.editBookingHotelHeader = "Cập nhật thông tin lưu trú";
    this.modeViewEditStatus = 1;
    this.isShowEditBookingHotel = true;
  }

  // @passengerType: 0 người lớn, 1 trẻ em
  // & tạo một item form thuộc detailHotelPassengerForm
  createBookingHotelPassengerForm(passengerType: number): FormGroup {
    let passengerFormGroup: FormGroup;
    if (passengerType === 0) {
      passengerFormGroup = this.fb.group({
        id: [0], //id
        fullName: [null, [Validators.required]], //họ tên
        phone: [null, [Validators.required, Validators.pattern('^[+0-9]*$')]], //  SĐT
        email: [null, [Validators.required, Validators.email]], // Email
        passengerType: [passengerType], // loại ( trẻ em hay người lớn )
        jobTitle: [null],  // Chức danh
      });
    }
    else if (passengerType === 1) {
      passengerFormGroup = this.fb.group({
        id: [0], //id
        fullName: [null, [Validators.required]], //họ tên
        passengerType: [passengerType], // loại ( trẻ em hay người lớn )
        dateOfBirth: [null, [Validators.required]],  // ngày sinh của trẻ em
        height: [null],  // chiều cao của trẻ em
      });
    }
    else throw new Error('PassengerType nằm ngoài giá trị cho phép [0-1]');
    return passengerFormGroup;
  }
  isFirstLoadDetailBookingHotel = true;
  changePassengerAmount(type: string) {
    if (this.isFirstLoadDetailBookingHotel) {
      this.isFirstLoadDetailBookingHotel = false;
      return;
    }
    if (type === 'adt') {
      let adtAmount = this.detailBookingRoomForm.value.adt;
      while (this.detailHotelPassengerAdtForm.length < adtAmount) { // cần thêm
        this.detailHotelPassengerAdtForm.push(this.createBookingHotelPassengerForm(0));
      }
      while (this.detailHotelPassengerAdtForm.length > adtAmount) { // cần xoas
        this.detailHotelPassengerAdtForm.pop();
      }
    }
    else {
      let chdAmount = this.detailBookingRoomForm.value.chd;
      while (this.detailHotelPassengerChdForm.length < chdAmount) { // cần thêm
        this.detailHotelPassengerChdForm.push(this.createBookingHotelPassengerForm(1));
      }
      while (this.detailHotelPassengerChdForm.length > chdAmount) { // cần xoas
        this.detailHotelPassengerChdForm.pop();
      }
    }
  }
  checkValidateDetailBookingHotelForm() {
    for (let form of this.detailHotelPassengerAdtForm) {
      if (!CheckValidatorForm(form)) return false;
    }
    for (let form of this.detailHotelPassengerChdForm) {
      if (!CheckValidatorForm(form)) return false;
    }
    if (!CheckValidatorForm(this.detailBookingGeneralForm)) return false;
    if (!CheckValidatorForm(this.detailContactUserForm)) return false;
    if (!CheckValidatorForm(this.detailBookingRoomForm)) return false;
    if (!this.detailBookingRoomForm.value.room?.id) return false;
    return true;
  }
  setPayloadBookingHotelPassengers() {
    let arrAdt = this.detailHotelPassengerAdtForm.map((form: FormGroup) => {
      return {
        id: form.value.id,
        fullName: form.value.fullName,
        phone: form.value.phone,
        email: form.value.email,
        passengerType: form.value.passengerType, // 0 for adult, 1 for child, etc.
        jobTitle: form.value.jobTitle,
      }
    });
    let arrChd = this.detailHotelPassengerChdForm.map((form: FormGroup) => {
      return {
        id: form.value.id,
        fullName: form.value.fullName,
        passengerType: form.value.passengerType, // 0 for adult, 1 for child, etc.
        dateOfBirth: new Date(form.value.dateOfBirth),
        height: form.value.height
      }
    });
    return [...arrAdt, ...arrChd];
  }


  handleUpdateBookingHotel() {
    this.updateBookingHotel().then((result: any) => {
      this.updateBookingHotelStatus(this.detailBookingGeneralForm.value.id, HotelBookingStatusEnum.Holding).then((result: any) => {
        //gửi email xác nhận giữ chỗ đặt phòng khách sạn
        this.sendEmailConfirmationOfHotelReservation(this.detailBookingGeneralForm.value.id);
      });

    }).catch((error: any) => {

    });
  }

  sendEmailConfirmationOfHotelReservation(bookingHotelId: any) {
    return new Promise((resolve, reject) => {
      this.generalService.sendEmailConfirmationOfHotelReservation(bookingHotelId).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              resolve(true);
              this.notificationService.showNotification(Constant.SUCCESS, 'Đã gửi email thông báo giữ phòng khách sạn tới khách hàng');
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Gửi email thông báo giữ phòng khách sạn tới khách hàng không thành công');
              }
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Gửi email thông báo giữ phòng khách sạn tới khách hàng thất bại do lỗi hệ thống');
          },
          complete: () => {
          }
        }
      ).add(() => {
      });
    })

  }

  // update
  updateBookingHotel(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.checkValidateDetailBookingHotelForm()) {
        this.notificationService.showNotification(Constant.ERROR, "Vui lòng nhập đầy đủ thông tin");
        return;
      }
      let payload = {
        id: this.detailBookingGeneralForm.value.id,
        otherRequirements: this.detailBookingGeneralForm.value.otherRequirements,
        isUrgent: this.detailBookingGeneralForm.value.isUrgent,
        contactName: this.dataDetailBookingHotel.userFullName,
        contactPhone: this.dataDetailBookingHotel.userEmail,
        contactEmail: this.dataDetailBookingHotel.userPhoneNo,
        roomDetails: [
          {
            id: this.detailBookingRoomForm.value.id,
            hotelId: this.detailBookingRoomForm.value.hotelId,
            roomHotelId: this.detailBookingRoomForm.value.room.id,
            checkinDate: new Date(this.detailBookingRoomForm.value.checkinDate),
            checkoutDate: new Date(this.detailBookingRoomForm.value.checkoutDate),
            numberOfNights: this.detailBookingRoomForm.value.numberOfNights,
            amount: this.detailBookingRoomForm.value.amount,
            extraBed: this.detailBookingRoomForm.value.extraBed,
            adt: this.detailBookingRoomForm.value.adt, // số lượng người lớn (adult)
            chd: this.detailBookingRoomForm.value.chd, // số lượng trẻ em (child)
            inf: this.detailBookingRoomForm.value.inf, // số lượng trẻ sơ sinh (infant)
            price: this.detailBookingRoomForm.value.price,
            adultSurcharge: this.detailBookingRoomForm.value.adultSurcharge, // phụ phí người lớn
            childSurcharge: this.detailBookingRoomForm.value.childSurcharge, // phụ phí trẻ em
            extraBedPrice: this.detailBookingRoomForm.value.extraBedPrice, // giá giường phụ
            totalPrice: this.detailBookingRoomForm.value.totalPrice, // tổng giá
            passengers: this.setPayloadBookingHotelPassengers()
          }
        ],
        approvalCode: this.detailBookingRoomForm.value.approvalCode
      }
      this.generalService.updateBookingHotel(payload).subscribe({
        next: (res) => {
          this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật thông tin đặt phòng thành công');
          resolve(true);
        },
        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Có lỗi xảy ra');
          reject(error);
        },
        complete: () => {
          this.isShowEditBookingHotel = false;
        }
      });
    });

  }

  changeRoomType(event: any) {
    if (event) {
      this.detailBookingRoomForm.controls['room'].setValue({
        id: event,
        name: ''
      });
    } else {
      this.detailBookingRoomForm.controls['room'].setValue(null);
    }
  }
  //#endregion chi tiết lưu trú





  //#region thêm mã đặt phòng
  isShowAddCodeBookingRoom = false;
  cancelAddCodeBookingRoom() {
    this.item.data.bookingStatus = this.statusOld;
    this.isShowAddCodeBookingRoom = false;
  }
  bookingRoomCodeForm: FormGroup;
  addBookingRoomCode() {
    let valid = CheckValidatorForm(this.bookingRoomCodeForm);
    if (!valid) {
      this.notificationService.showNotification(Constant.ERROR, "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    this.generalService.confirmBooking({ id: this.item.data.id, reservationCode: this.bookingRoomCodeForm.value.reservationCode }).subscribe({
      next: (res) => {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xác nhận đặt phòng thành công');
        this.updateBookingHotelStatus(this.item.data.id, HotelBookingStatusEnum.Successful);

      },
      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Xác nhận không thành công');
      },
      complete: () => {
        this.isShowAddCodeBookingRoom = false;
        this.getListData();
      }
    })
  }
  //#endregion thêm mã đặt phòng





  //#region lịch sử
  isVisibleRequestBookingHistory = false;
  listRequestBookingHistories: any[] = [];
  handleCancelPopupRequestBookingHistory() {
    this.isVisibleRequestBookingHistory = false;
  }
  getHistoryBookingHotel(id: number) {
    this.generalService.getGetChangeStatusHistory(id).subscribe({
      next: (res) => {
        let stt = 0;
        this.listRequestBookingHistories = res.map((ele: any) => {
          return {
            stt: ++stt,
            status: this.STATUS_LIST[ele.newStatus],
            userIdModified: ele.userIdModified,
            fullName: ele.fullName,
            dateLog: new Date(ele.dateLog)
          }
        })
        this.isVisibleRequestBookingHistory = true;
      },
      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Có lỗi xảy ra');
      }
    })
  }
  calcStatusHistory(rowData: any) {
    return rowData.status.name;
  }
  calcImplementerHistory(rowData: any) {
    return 'ID: ' + rowData.userIdModified + ' ,Name: ' + rowData.fullName;
  }

}
