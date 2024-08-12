import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from 'src/app/service/general-service';
import { TableSelectionAbstract } from 'src/app/shared/component/table/table-selection.abstract';
import { Constant, RequestBookingConfig } from 'src/app/shared/constants/constant.class';
import { AppConfigService } from 'src/app-config.service';
import { NotificationService } from 'src/app/service/notification.service';
import { removeAccents } from 'src/app/shared/utils/filters/remove-accents'
import { Workbook } from 'exceljs';
import { DateFormatPipe } from 'src/app/shared/pipe/format-date.pipe';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs } from 'file-saver-es';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import {
  DxDataGridComponent,
  DxTemplateDirective,
  DxTooltipComponent,
  DxTooltipModule,
} from "devextreme-angular";
import { OptionAirlineTicketPopup } from 'src/app/enums/option-airline-ticket-popup.enum';
import { TypeAirlineTicket } from 'src/app/enums/type-airline-ticket.enum';
import { AIRLINE_CODE_OPTIONS, AirlineCompany } from 'src/app/enums/airline-company.enum';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { AIRLINE_TICKET_BOOKING_REQUEST_STATUS_OPTIONS, AirlineTicketBookingRequestStatus } from 'src/app/enums/airline-ticket-booking-request-status.enum';
import { FlightUtils } from 'src/app/shared/utils/flight-utils.class';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'airline-ticket-booking-request',
  templateUrl: './airline-ticket-booking-request.component.html',
  styleUrls: ['./airline-ticket-booking-request.component.scss']
})
export class AirlineTicketBookingRequestComponent extends TableSelectionAbstract implements OnInit, OnDestroy {


  @ViewChild("ListAccount") dataGridDetail: DxDataGridComponent;
  datas: any[] = [];
  OptionAirlineTicketInfoEnum = OptionAirlineTicketPopup;
  optionAirlineTicketInfo: OptionAirlineTicketPopup = OptionAirlineTicketPopup.View;

  TypeAirlineTicketEnum = TypeAirlineTicket;

  AirlineCompanyEnum = AirlineCompany;

  BookingRequestStatusEnum = AirlineTicketBookingRequestStatus

  AIRLINE_TICKET_BOOKING_REQUEST_STATUS_OPTIONS = AIRLINE_TICKET_BOOKING_REQUEST_STATUS_OPTIONS;


  AIRLINE_CODE_OPTIONS = AIRLINE_CODE_OPTIONS;
  formAirlineTicketPopup: FormGroup;

  listOfOption: string[] = [];
  listOfSelectedValue = ['a10', 'c12'];

  ticketRoundTrip: boolean;


  uploading = false;
  uploadHeader: any;
  uploadUrl = '';
  listFileIds: any;
  fileList: NzUploadFile[] = [];
  showUploadListOption = { showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: true };

  data: any;
  itemBookingRequest: any;
  loading: boolean;
  filteredDatas: any[] = [];
  searchText = '';
  payloadAdminrequestbooking = {
    "page": 1,
    "pageSize": 500,
    "status": AirlineTicketBookingRequestStatus.All
  }
  userInfor: any;
  titleFormPartner = '';
  // listDetailTicket: any[];
  readonly allowedPageSizes = [10, 20, 50, 100, 200, 'all'];
  displayMode = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  isVisibleAirlineTicketInfo: boolean = false;
  itemTicketHistoryTicket: any;
  airports: any[] = [];
  intervalIdUserRegister: NodeJS.Timeout;

  isVisiblePopupUpdateNumberTicket: boolean = false;
  isVisibleRequestBookingHistory: boolean = false;


  listOfOptionPassengers = [];
  newStatus: any;
  oldStatus: any;
  isSendEmailToPassengerToConfirmFlightTicket: boolean;
  isSendEmailToPassengerToConfirmSuccessIssuedTicket: boolean;
  listRequestBookingRequests: any;
  signalOpenPopupUpdateNumberTicket: boolean = false;
  constructor(
    public translate: TranslateService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private dateFormatPipe: DateFormatPipe,
    private formBuilder: FormBuilder,
    public flightUtils: FlightUtils,
    private http: HttpClient,
    private msg: NzMessageService,
    private router: Router
  ) {
    super('id');
    this.uploadHeader = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    };
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload`;
    this.formAirlineTicketPopup = this.formBuilder.group({
      id: [null],
      typeTicket: new FormControl({ value: TypeAirlineTicket.OneWay, disabled: false }, Validators.required),
      passengers: new FormControl({ value: [], disabled: false }, Validators.required),
      fileIds: new FormControl({ value: [], disabled: false }),
      tripItineraryDeparture: new FormControl({ value: null, disabled: true }),
      flightTimeDeparture: new FormControl({ value: [], disabled: false }, Validators.required),

      airlineCodeDeparture: new FormControl({ value: '', disabled: false }, Validators.required),
      reservationCodeDeparture: new FormControl({ value: null, disabled: false }, Validators.required),
      flightNumberDeparture: new FormControl({ value: null, disabled: false }, Validators.required),
      ticketHoldExpiryDateDeparture: new FormControl({ value: null, disabled: false }, Validators.required),
      ticketPriceDeparture: new FormControl({ value: null, disabled: false }, Validators.required),
      baggageFeeDeparture: new FormControl({ value: null, disabled: false }),
      refundFeeDeparture: new FormControl({ value: null, disabled: false }),
      cancelFeeDeparture: new FormControl({ value: null, disabled: false }),
      changeFeeDeparture: new FormControl({ value: null, disabled: false }),

      airlineCodeReturn: new FormControl({ value: '', disabled: false }, this.requiredIfRoundTrip.bind(this)),
      reservationCodeReturn: new FormControl({ value: null, disabled: false }, this.requiredIfRoundTrip.bind(this)),
      flightTimeReturn: new FormControl({ value: [], disabled: false }, this.requiredIfRoundTrip.bind(this)),
      flightNumberReturn: new FormControl({ value: null, disabled: false }, this.requiredIfRoundTrip.bind(this)),
      ticketHoldExpiryDateReturn: new FormControl({ value: null, disabled: false }, this.requiredIfRoundTrip.bind(this)),
      ticketPriceReturn: new FormControl({ value: null, disabled: false }, this.requiredIfRoundTrip.bind(this)),
      baggageFeeReturn: new FormControl({ value: null, disabled: false }),
      refundFeeReturn: new FormControl({ value: null, disabled: false }),
      cancelFeeReturn: new FormControl({ value: null, disabled: false }),
      changeFeeReturn: new FormControl({ value: null, disabled: false }),
    });

  }

  ngOnInit(): void {
    this.getListData();
    this.getUserInfo();
    this.getAirport();


    this.intervalIdUserRegister = setInterval(() => {
      setTimeout(() => {
        if (this.router.url === '/booking-service/airline-ticket-booking-request') {
          // cập nhất lại trạng thái quá hạn giữ chỗ
          this.datas.forEach(requestBooking => {
            if (requestBooking.status == this.BookingRequestStatusEnum.ReserveSeat) {
              const ticketHoldExpiryDate = requestBooking.ticketHoldExpiryDate != null ? new Date(requestBooking.ticketHoldExpiryDate) : new Date(0);
              const now = new Date();
              if (ticketHoldExpiryDate < now) {
                this.updateStatusRequestBooking(requestBooking.id, this.BookingRequestStatusEnum.ExpiredTicket).then((r) => {
                  this.getListData();
                });
              }
            }
          });
        } else {
          clearInterval(this.intervalIdUserRegister);
        }
      }, 200);
    }, RequestBookingConfig.TIME_UPDATE_DATAS);
  }

  ngOnDestroy(): void {

  }

  requiredIfRoundTrip(control: FormControl) {
    return this.itemBookingRequest?.typeTicket == this.TypeAirlineTicketEnum.RoundTrip ? Validators.required(control) : null;
  }
  getUserInfo() {
    this.userInfor = JSON.parse(localStorage.getItem(Constant.USER_INFO));
  }

  getAirport() {
    this.generalService.getAirport().subscribe((res: any) => {
      if (res !== null) {
        this.airports = res;
      }
    }, error => {
    });
  }

  getListData() {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.generalService.adminRequestBooking(this.payloadAdminrequestbooking).subscribe((res: any) => {
        if (res !== null) {
          this.datas = res.data;
          this.loading = false;
          let stt = 0;
          this.datas.forEach(en => {
            en.stt = ++stt;
            en.statusOld = en.status;
            en.isLoadingViewTicket = false;
          });
          this.filteredDatas = this.datas;
          super.setListOfAllData(this.datas);
          resolve(true);
        }
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'Đã xảy ra lỗi khi tải dữ liệu');
      });
    });

  }


  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };


  previewPopupRequestBookingHistory(requestBookingRequests: any) {
    this.isVisibleRequestBookingHistory = true;
    this.listRequestBookingRequests = requestBookingRequests;
    if (this.listRequestBookingRequests) {
      let stt = 0;
      this.listRequestBookingRequests.forEach((en: any) => {
        en.stt = ++stt;
      });
    }
  }

  // getListDetailTicket(historyTransaction: any) {
  //   const bookingFlights = historyTransaction.bookingFlights;
  //   const bookingPassengers = historyTransaction.bookingPassengers;
  //   const bookingReservations = historyTransaction.bookingReservations;

  //   // Create a dictionary to store objects based on bookingId
  //   let arraybookingDataMap = [];

  //   // Populate the dictionary with data from bookingFlights
  //   bookingFlights.forEach((flight: any) => {
  //     let bookingDataMap = {};
  //     if (flight) {
  //       bookingDataMap = { ...flight };
  //     }
  //     const bookingId = flight.bookingId;

  //     const matchingPassenger = bookingPassengers.find((passenger: any) => passenger.bookingId = flight.bookingId);
  //     if (matchingPassenger) {
  //       bookingDataMap = { ...bookingDataMap, ...matchingPassenger };
  //     }

  //     const matchingReservation = bookingReservations.find((reservation: any) => reservation.bookingId === flight.bookingId);
  //     if (matchingReservation) {
  //       bookingDataMap = { ...bookingDataMap, ...matchingReservation };
  //     }

  //     arraybookingDataMap.push(bookingDataMap);
  //   });

  //   return arraybookingDataMap;
  // }
  onOpenPopupTicketDetail(booking: any) {
    booking.isLoadingViewTicket = true;
    this.generalService.getBookingByID(booking.bookingId).subscribe({
      next: (res: any) => {
        if (res) {
          this.itemTicketHistoryTicket = res;
          let bookingFlightTotalPrice = 0;
          let i = 0;
          this.itemTicketHistoryTicket.bookingFlights.forEach((bookingFlight: any) => {
            bookingFlightTotalPrice += bookingFlight.totalPrice;
            bookingFlight.startPoint = this.convertRotueBookingReservations(this.itemTicketHistoryTicket.bookingReservations[0].route)[i].startPoint;
            bookingFlight.endPoint = this.convertRotueBookingReservations(this.itemTicketHistoryTicket.bookingReservations[0].route)[i].endPoint;
            i++;
          });
          this.itemTicketHistoryTicket.totalPricebookingFlight = bookingFlightTotalPrice;
        } else {
          this.notificationService.showNotification(Constant.ERROR, `Dữ liệu vé máy bay của khách hàng <strong>${booking.passengerName}</strong> không tồn tại`);
        }
      },

      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Dữ liệu vé máy bay trả về đã gặp lỗi');
      },

      complete: () => {
        booking.isLoadingViewTicket = false;
        this.isVisibleAirlineTicketInfo = true;
      }
    })
  }


  private convertRotueBookingReservations(route: string): any {
    // Tách chuỗi theo dấu "|"
    const parts = route.trim().split("|");
    // Khởi tạo mảng để lưu kết quả
    const result = [];
    // Lặp qua từng phần tử
    parts.forEach(part => {
      // Sử dụng regex để tìm các cặp từ
      const matches = part.trim().match(/([A-Z]{3})([A-Z]{3})/);
      if (matches && matches.length === 3) {
        // Lấy các match và tạo đối tượng
        const startPoint = matches[1];
        const endPoint = matches[2];
        result.push({ startPoint, endPoint });
      }
    });
    return result;
  }

  toNameAirportByCode(code: String) {
    let mameAirport = '';
    if (code) {
      let airport = this.airports.find((objAirports: any) => objAirports.code === code);
      if (airport) {
        mameAirport = airport.name;
      }
    }
    return mameAirport;
  }

  toAirlineNameByCode(codeAirline: string) {
    switch (codeAirline) {
      case "VN":
        return "Vietnam Airlines";
      case "QH":
        return "Bamboo Airways";
      case "VJ":
        return "VietJet Air";
      default:
        return "";
    }
  }

  handleCancelPopupRequestBookingHistory() {
    this.isVisibleRequestBookingHistory = false;
  }

  exportData() {
    this.dataGridDetail.instance.exportToExcel(false);
  }

  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const from = this.dateFormatPipe.transformFull(new Date(), Constant.DATE_FMT_STR);
    const dateStr = from;
    const fileName = `DS_Book_ve_yeu_cau_${dateStr}`;
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
      removeAccents(en.contactName?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.contactPhone?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.contactEmail?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.dateCreated?.trim()).toLowerCase().includes(keyword)
    );
  }

  formatCurrencyVND(value: any) {
    if (!value) {
      return '0 đ';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  }

  getLabelRequestBookingStatus(value: any) {
    if (!value) {
      return '';
    }
    var objStatusOption = AIRLINE_TICKET_BOOKING_REQUEST_STATUS_OPTIONS.find((t: any) => t.value == value)
    if (!objStatusOption) return "";
    return objStatusOption.label;
  }


  setFormRequestPartnerValue(requestPartnerValue: any) {
    this.listOfOptionPassengers = requestPartnerValue.passengers;
    this.formAirlineTicketPopup.patchValue({
      typeTicket: requestPartnerValue.typeTicket,
      // passengers: requestPartnerValue.passengers.map(passenger => passenger.fullName),
      passengers: requestPartnerValue.passengers,

      tripItineraryDeparture: `${this.flightUtils.toNameAirportByCode(this.airports, requestPartnerValue.startPoint)} - ${this.flightUtils.toNameAirportByCode(this.airports, requestPartnerValue.endPoint)}`,
      flightTimeDeparture: [requestPartnerValue.startTime, requestPartnerValue.endTime],
      airlineCodeDeparture: requestPartnerValue.airlineCode,
      bookingCodeDeparture: requestPartnerValue.bookingCode,
      flightNumberDeparture: requestPartnerValue.flightNumber,
      ticketHoldExpiryDateDeparture: requestPartnerValue.ticketHoldExpiryDate,
      ticketPriceDeparture: requestPartnerValue.ticketPrice,
      baggageFeeDeparture: requestPartnerValue.baggageFee,
      refundFeeDeparture: requestPartnerValue.refundFee,
      cancelFeeDeparture: requestPartnerValue.cancelFee,
      changeFeeDeparture: requestPartnerValue.changeFee,
      reservationCodeDeparture: requestPartnerValue.reservationCode,


      flightTimeReturn: [requestPartnerValue.returnStartTime, requestPartnerValue.returnEndTime],
      airlineCodeReturn: requestPartnerValue.returnAirlineCode,
      bookingCodeReturn: requestPartnerValue.returnBookingCode,
      flightNumberReturn: requestPartnerValue.returnFlightNumber,
      ticketHoldExpiryDateReturn: requestPartnerValue.returnTicketHoldExpiryDate,
      ticketPriceReturn: requestPartnerValue.returnTicketPrice,
      baggageFeeReturn: requestPartnerValue.returnBaggageFee,
      refundFeeReturn: requestPartnerValue.returnRefundFee,
      cancelFeeReturn: requestPartnerValue.returnCancelFee,
      changeFeeReturn: requestPartnerValue.returnChangeFee,
      reservationCodeReturn: requestPartnerValue.returnReservationCode
    });
  }

  handleChangeStatusByItem(status: any) {
    this.itemBookingRequest = status.data;
    console.log('status.data : ', status.data);

    this.setFormRequestPartnerValue(this.itemBookingRequest);
    console.log('this.formAirlineTicketPopup.value ; ', this.formAirlineTicketPopup.value);
    this.newStatus = status.value;
    this.oldStatus = status.data.statusOld;
    let requestBookingId = status.data.id;
    switch (this.newStatus) {
      case this.BookingRequestStatusEnum.SubmitRequest:

        break;
      case this.BookingRequestStatusEnum.ReserveSeat:
        this.updateStatusRequestBooking(requestBookingId, this.BookingRequestStatusEnum.ReserveSeat).then((r) => {
          // this.sendEmailToPassengerToConfirmFlightTicket(requestBookingId);
          this.isVisibleAirlineTicketInfo = true;
          this.signalOpenPopupUpdateNumberTicket = false;
          this.isSendEmailToPassengerToConfirmFlightTicket = true;
          this.isSendEmailToPassengerToConfirmSuccessIssuedTicket = false;
          this.optionAirlineTicketInfo = OptionAirlineTicketPopup.Update;
          this.getListData();
        });
        break;
      case this.BookingRequestStatusEnum.ReceivedTicket:

        break;
      case this.BookingRequestStatusEnum.ExpiredTicket:

        break;

      case this.BookingRequestStatusEnum.AdjustTicket:
        //Mở popup Cập nhật thông tin vé
        this.isVisibleAirlineTicketInfo = true;
        this.optionAirlineTicketInfo = this.OptionAirlineTicketInfoEnum.Update;
        this.isSendEmailToPassengerToConfirmFlightTicket = true;
        break;

      case this.BookingRequestStatusEnum.IssuedTicket:
        //Mở popup Cập nhật thông tin vé
        this.isVisibleAirlineTicketInfo = true;
        this.optionAirlineTicketInfo = this.OptionAirlineTicketInfoEnum.Update;
        this.isSendEmailToPassengerToConfirmSuccessIssuedTicket = true;
        break;
      default:
        break;
    }
    status.data.statusOld = this.newStatus;
    this.oldStatus = this.newStatus;
  }

  sendEmailToPassengerToConfirmFlightTicket(requestBookingId: any) {
    this.generalService.sendEmailToPassengerToConfirmFlightTicket(requestBookingId).subscribe(
      {
        next: (res: any) => {
          if (res.isValid) {
            this.notificationService.showNotification(Constant.SUCCESS, 'Đã gửi email thông báo giữ chỗ thời khách hàng');
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Gửi email thông báo giữ chỗ thời khách hàng không thành công');
            }
          }
        },
        error: (err: any) => {
          this.notificationService.showNotification(Constant.ERROR, 'Gửi email thông báo giữ chỗ thời khách hàng thất bại do lỗi hệ thống');
        },
        complete: () => {
        }
      }
    ).add(() => {
    });
  }

  updateStatusRequestBooking(requestBookingId: number, status: number) {
    return new Promise((resolve, reject) => {
      this.generalService.updateStatusRequestBooking(requestBookingId, status).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              this.notificationService.showNotification(Constant.SUCCESS, 'Thay đổi trạng thái thành công');
              resolve(true);
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Thay đổi trạng thái không thành công');
              }
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Thay đổi trạng thái thất bại do lỗi hệ thống');
          },
          complete: () => {
          }
        }
      ).add(() => {
      });
    });



  }

  showPopupAirlineTicket(itemData: any, opPopupAirlineTicket: OptionAirlineTicketPopup) {



    this.itemBookingRequest = itemData;
    this.isVisibleAirlineTicketInfo = true;
    this.optionAirlineTicketInfo = opPopupAirlineTicket;

    if(itemData.status == AirlineTicketBookingRequestStatus.ReserveSeat){
      this.isSendEmailToPassengerToConfirmFlightTicket = true;
      this.isSendEmailToPassengerToConfirmSuccessIssuedTicket = false;
    }

    if (this.optionAirlineTicketInfo == this.OptionAirlineTicketInfoEnum.View) {
      this.formAirlineTicketPopup.disable();
      this.showUploadListOption = { ...this.showUploadListOption, ...{ showPreviewIcon: true, showRemoveIcon: false, showDownloadIcon: true } }
    }
    if (this.optionAirlineTicketInfo == this.OptionAirlineTicketInfoEnum.Update) {
      this.formAirlineTicketPopup.enable();
      this.showUploadListOption = { ...this.showUploadListOption, ...{ showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: true } }
    }
    this.listOfOptionPassengers = itemData.passengers;
    this.formAirlineTicketPopup.patchValue({
      typeTicket: itemData.typeTicket,
      // passengers: itemData.passengers.map(passenger => passenger.fullName),
      passengers: itemData.passengers,

      tripItineraryDeparture: `${this.flightUtils.toNameAirportByCode(this.airports, itemData.startPoint)} - ${this.flightUtils.toNameAirportByCode(this.airports, itemData.endPoint)}`,
      flightTimeDeparture: [itemData.startTime, itemData.endTime],
      airlineCodeDeparture: itemData.airlineCode,
      bookingCodeDeparture: itemData.bookingCode,
      flightNumberDeparture: itemData.flightNumber,
      ticketHoldExpiryDateDeparture: itemData.ticketHoldExpiryDate,
      ticketPriceDeparture: itemData.ticketPrice,
      baggageFeeDeparture: itemData.baggageFee,
      refundFeeDeparture: itemData.refundFee,
      cancelFeeDeparture: itemData.cancelFee,
      changeFeeDeparture: itemData.changeFee,
      reservationCodeDeparture: itemData.reservationCode,


      flightTimeReturn: [itemData.returnStartTime, itemData.returnEndTime],
      airlineCodeReturn: itemData.returnAirlineCode,
      bookingCodeReturn: itemData.returnBookingCode,
      flightNumberReturn: itemData.returnFlightNumber,
      ticketHoldExpiryDateReturn: itemData.returnTicketHoldExpiryDate,
      ticketPriceReturn: itemData.returnTicketPrice,
      baggageFeeReturn: itemData.returnBaggageFee,
      refundFeeReturn: itemData.returnRefundFee,
      cancelFeeReturn: itemData.returnCancelFee,
      changeFeeReturn: itemData.returnChangeFee,
      reservationCodeReturn: itemData.returnReservationCode


    });

    this.ticketRoundTrip = itemData.typeTicket == this.TypeAirlineTicketEnum.RoundTrip
    // console.log("this.formAirlineTicketPopup : ", this.formAirlineTicketPopup.value);
    this.listFileIds = [];
    this.fileList = [];
    for (const file of itemData.files) {
      const objFile = {
        uid: file.id.toString(),
        name: file.fileName,
        url: `${this.configService.getConfig().api.baseUrl}/${file.filePath}`,
      };
      this.fileList.push(objFile);
    }
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadRequestBookingFile?RequestBookingId=${itemData.id}`;
  }

  showPopupUpdateNumberTicket(requestBooking: any) {
    this.isVisiblePopupUpdateNumberTicket = true;
    this.isSendEmailToPassengerToConfirmFlightTicket = false;
    this.isSendEmailToPassengerToConfirmSuccessIssuedTicket = false;
  }

  handleUploadFileTicketBookingRequest1({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status === 'done') {
      this.msg.success(`file ${file.name} tải lên thành công.`);
      this.getListData();
      this.fileList = fileList;
      setTimeout(() => {
        if (this.fileList.length > 0) {
          this.fileList[this.fileList.length - 1].fileId = file.response.fileId.toString();
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
      this.listFileIds.push(file.response.fileId);
      this.formAirlineTicketPopup.controls['fileIds'].setValue(this.listFileIds);
    } else if (status === 'error') {
      this.msg.error(`File ${file.name} tải lên không thành công.`);
    }
  }


  handleUploadFileTicketBookingRequest2BeforSelect({ file, fileList }: NzUploadChangeParam): void {
    this.uploading = true;
    this.fileList.forEach((file: any) => {
      const formData = new FormData();
      formData.append('postedFile', file);
      const req = new HttpRequest('POST', `${this.uploadUrl}`, formData, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
        }),
      });
      this.http
        .request(req)
        .pipe(filter(e => e instanceof HttpResponse))
        .subscribe(
          () => {
            this.uploading = false;
            this.msg.success(`File ${file.name} tải lên thành công.`);
            this.fileList = fileList;
            setTimeout(() => {
              if (this.fileList.length > 0) {
                this.fileList[this.fileList.length - 1].uid = file.response.fileId.toString();
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
            this.listFileIds.push(file.response.fileId);
            this.formAirlineTicketPopup.controls['fileIds'].setValue(this.listFileIds);
            this.uploading = false;
          },
          () => {
            this.uploading = false;
            this.msg.error(`Tải file ${file.name} thất bại.`);
          }
        );
    });

  }

  handleRemoveFileTicketBookingRequest = async (file: NzUploadFile): Promise<void> => {

    if (this.optionAirlineTicketInfo == this.OptionAirlineTicketInfoEnum.Update) {
      const idFile = file.fileId;
      if (idFile) {
        this.generalService.deleteRequestBookingFileByID(idFile).subscribe(
          {
            next: (res) => {
              if (res) {
                if (res.ret && res.ret.length > 0) {
                  res.ret.forEach((el: any) => {
                    if (el.code === 0) {
                      this.msg.success(`Đã xoá file ${file.name}.`);
                      this.getListData();
                    } else if (res.code === 404) {
                      this.msg.error(`Không tìm thấy file ${file.name}.`);
                    } else {
                      this.msg.error(`Đã có lỗi xảy ra. Không thể xoá file ${file.name}`);
                    }
                  });
                }
              } else {
                this.notificationService.showNotification(Constant.ERROR, `Hệ thống gặp lỗi, xoá file ${file.name} thật bại.`);
              }
            },
            error: (error) => {
              this.notificationService.showNotification(Constant.ERROR, `Hệ thống gặp lỗi, xoá file ${file.name} thật bại.`);
            },
            complete: () => {
            },

          }
        );
      }

    } else {
      this.notificationService.showNotification(Constant.ERROR, `Không thể xoá file khi ở chế độ View Ticket`);
    }
  }

  handleSavelArilineTicketPopup() {
    if (this.formAirlineTicketPopup.valid) {
      let formValue = this.formAirlineTicketPopup.value;
      let payload = {
        id: this.itemBookingRequest.id,
        // approvalCode: this.itemBookingRequest.approvalCode,
        typeTicket: formValue.typeTicket,
        departureDay: this.itemBookingRequest.departureDay,
        returnDay: this.itemBookingRequest.returnDay,
        startPoint: this.itemBookingRequest.startPoint,
        endPoint: this.itemBookingRequest.endPoint,
        airlineId: null,
        airlineCode: formValue.airlineCodeDeparture,
        fareClass: this.itemBookingRequest.fareClass,
        adt: this.itemBookingRequest.adt,
        chd: this.itemBookingRequest.chd,
        inf: this.itemBookingRequest.inf,
        baggage: this.itemBookingRequest.baggage,
        passengers: formValue.passengers,


        startTime: formValue.flightTimeDeparture[0],
        endTime: formValue.flightTimeDeparture[1],
        bookingCode: formValue.bookingCodeDeparture,
        flightNumber: formValue.flightNumberDeparture,
        ticketPrice: formValue.ticketPriceDeparture,
        refundFee: formValue.refundFeeDeparture,
        changeFee: formValue.changeFeeDeparture,
        cancelFee: formValue.cancelFeeDeparture,
        baggageFee: formValue.baggageFeeDeparture,
        ticketHoldExpiryDate: formValue.ticketHoldExpiryDateDeparture,
        reservationCode: formValue.reservationCodeDeparture,

        returnStartTime: formValue.flightTimeReturn[0],
        returnEndTime: formValue.flightTimeReturn[1],
        returnBookingCode: formValue.bookingCodeReturn,
        returnFlightNumber: formValue.flightNumberReturn,
        returnTicketPrice: formValue.ticketPriceReturn,
        returnRefundFee: formValue.refundFeeReturn,
        returnChangeFee: formValue.changeFeeReturn,
        returnCancelFee: formValue.cancelFeeReturn,
        returnBaggageFee: formValue.baggageFeeReturn,
        returnTicketHoldExpiryDate: formValue.ticketHoldExpiryDateReturn,
        returnAirlineId: null,
        returnAirlineCode: formValue.airlineCodeReturn,
        returnReservationCode: formValue.reservationCodeReturn ?? null

      }
      // console.log("formValue: ", formValue);
      // console.log("payload: ", payload);

      this.updateRequestBooking(payload).then((r) => {
        // Mở popup cập nhật số vé
        this.isVisibleAirlineTicketInfo = false;
        this.isVisiblePopupUpdateNumberTicket = this.signalOpenPopupUpdateNumberTicket;
        console.log("this.isSendEmailToPassengerToConfirmFlightTicket :  ", this.isSendEmailToPassengerToConfirmFlightTicket);

        if (this.isSendEmailToPassengerToConfirmFlightTicket) {
          this.sendEmailToPassengerToConfirmFlightTicket(this.itemBookingRequest.id);
        }
      });

    } else {
      // Đánh dấu tất cả các trường là đã được chạm (touched) để hiển thị lỗi
      this.formAirlineTicketPopup.markAllAsTouched();
      // this.notificationService.showNotification(Constant.SUCCESS, "Tồn tại trường thông tin chưa được nhập");
      this.msg.error(`Tồn tại trường thông tin chưa được nhập`);
    }

  }

  updateRequestBooking(payload: any) {
    return new Promise((resolve, reject) => {
      this.generalService.updateRequestBooking(payload).subscribe(
        (res: any) => {
          if (res.ret && res.ret[0].code !== 0) {
            this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
          } else {
            this.notificationService.showNotification(Constant.SUCCESS, "Cập nhật vé thành công");
            return resolve(true);
          }
        }, error => {

        });
    });

  }

  handleCancelArilineTicketPopup() {
    this.isVisibleAirlineTicketInfo = false;
  }

  addItemPassenger(input: HTMLInputElement): void {
    const value = input.value;
    if (value) {
      const newItem = {
        "id": null,
        "indexCode": null,
        "fullName": value,
        "gender": true,
        "email": null,
        "phone": null,
        "membership": "",
        "typeCode": "",
        "dateOfBirth": "",
        "ticketNumber": null
      }
      this.listOfOptionPassengers = [...this.listOfOptionPassengers, newItem || `Một ai đó`];
    } else {
      this.msg.error(`Tồn tại trường thông tin chưa được nhập`);
    }
    input.value = '';
  }

  handleCancelPopupUpdateNumberTicket() {
    this.isVisiblePopupUpdateNumberTicket = false;
  }

  handleSavelPopupUpdateNumberTicket() {
    return new Promise((resolve, reject) => {
      const passengersUpdatePayload = this.itemBookingRequest.passengers;
      this.generalService.updatePassengersRequestBooking(passengersUpdatePayload).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              this.notificationService.showNotification(Constant.SUCCESS, `Cập nhật số vé khách hàng thành công!`);
              this.isVisiblePopupUpdateNumberTicket = false;
              switch (this.newStatus) {
                case this.BookingRequestStatusEnum.AdjustTicket:
                  this.AdjuctTicketRequestBookingById(this.itemBookingRequest.id).then((r) => {
                    if (this.isSendEmailToPassengerToConfirmFlightTicket) {
                      this.sendEmailToPassengerToConfirmFlightTicket(this.itemBookingRequest.id);
                    }
                  });
                  break;

                case this.BookingRequestStatusEnum.IssuedTicket:
                  this.IssuedTicketRequestBookingById(this.itemBookingRequest.id).then((r) => {
                    if (this.isSendEmailToPassengerToConfirmSuccessIssuedTicket) {
                      this.sendEmailToPassengerToConfirmSuccessIssuedTicket(this.itemBookingRequest.id);
                    }
                  });
                  break;

                default:
                  break;
              }
              this.getListData();
              resolve(true);
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Cập nhật số vé khách hàng không thành công.');
              }
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Cập nhật số vé khách hàng do lỗi hệ thống');
          },
          complete: () => {

          }
        }
      ).add(() => {
      });

    });

  }


  AdjuctTicketRequestBookingById(id: number) {
    return new Promise((resolve, reject) => {

      this.generalService.updateStatusRequestBooking(id, this.BookingRequestStatusEnum.AdjustTicket).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              this.notificationService.showNotification(Constant.SUCCESS, `Điều chỉnh vé thành công!`);
              resolve(true);
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Điều chỉnh vé không thành công.');
              }
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Điều chỉnh vé thất bại do lỗi hệ thống');
          },
          complete: () => {
          }
        }
      ).add(() => {
      });
    });

  }


  IssuedTicketRequestBookingById(id: number) {
    return new Promise((resolve, reject) => {
      this.generalService.updateStatusRequestBooking(id, this.BookingRequestStatusEnum.IssuedTicket).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              this.notificationService.showNotification(Constant.SUCCESS, `Đã xuất vé thành công!`);
              resolve(true);
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Xuất vé không thành công.');
              }
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Xuất vé thất bại do lỗi hệ thống');
          },
          complete: () => {
          }
        }
      ).add(() => {
      });
      // if (this.itemBookingRequest.status == this.BookingRequestStatusEnum.ReceivedTicket) {

      // } else if (this.itemBookingRequest.status == this.BookingRequestStatusEnum.IssuedTicket) {
      //   this.notificationService.showNotification(Constant.SUCCESS, `Vé ${this.itemBookingRequest.bookingCode} đã được xuất.`);
      // } else {
      //   this.notificationService.showNotification(Constant.ERROR, 'Không thể xuất vé, vui lòng kiểm tra lại thông tin');
      // }
    });

  }

  sendEmailToPassengerToConfirmSuccessIssuedTicket(requestBookingId: number) {
    this.generalService.sendEmailToPassengerToConfirmSuccessIssuedTicket(requestBookingId).subscribe(
      {
        next: (res: any) => {
          if (res.isValid) {
            this.notificationService.showNotification(Constant.ERROR, 'Đã gửi email thống báo xuất vé đến khách hàng');
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Gửi email thống báo xuất vé đến khách hàng không thành công');
            }
          }
        },
        error: (err: any) => {
          this.notificationService.showNotification(Constant.ERROR, 'Gửi email thống báo xuất vé đến khách hàng thất bại do lỗi hệ thống');
        },
        complete: () => {
        }
      }
    ).add(() => {
    });
  }

}
