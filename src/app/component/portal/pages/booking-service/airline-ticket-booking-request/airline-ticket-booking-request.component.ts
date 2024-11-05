import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Router, ActivatedRoute } from '@angular/router';
import { resolve } from 'path';
import { TypeOfDocument } from 'src/app/enums/type-of-document.enum';
import { DisabledTimeFn, DisabledTimePartial } from 'ng-zorro-antd/date-picker';
import { differenceInCalendarDays, isThisSecond, setHours } from 'date-fns';
import { EmployeePipe } from 'src/app/shared/pipe/employeePipe.pipe';
@Component({
  selector: 'airline-ticket-booking-request',
  templateUrl: './airline-ticket-booking-request.component.html',
  styleUrls: ['./airline-ticket-booking-request.component.scss']
})
export class AirlineTicketBookingRequestComponent extends TableSelectionAbstract implements OnInit, AfterViewInit, OnDestroy {


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
  uploadUrlFlightTicket = '';
  uploadUrlInvoice = '';
  listFileIds: any;
  fileFlightTicketList: NzUploadFile[] = [];
  fileInvoiceList: NzUploadFile[] = [];
  showUploadListOption = { showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: true };

  data: any;
  itemBookingRequest: any;
  loading: boolean;
  filteredDatas: any[] = [];
  searchText = '';
  payloadAdminrequestbooking = {
    "page": 1,
    "pageSize": 500,
    "status": AirlineTicketBookingRequestStatus.SubmitRequest
  }
  userInfor: any;
  titleFormPartner = '';
  // listDetailTicket: any[];
  readonly allowedPageSizes = [20, 50, 100, 200, 500, 'all']
  displayMode = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  isVisibleAirlineTicketInfo: boolean = false;
  isVisiblePopupViewRequestBookingTicket: boolean = false;
  itemTicketHistoryTicket: any;
  airports: any[] = [];
  intervalRequestBookingUpdateStatus: NodeJS.Timeout;

  isVisiblePopupUpdateNumberTicket: boolean = false;
  isVisibleRequestBookingHistory: boolean = false;


  listOfOptionPassengers = [];
  newStatus: any;
  oldStatus: any;
  // isSendEmailToPassengerToConfirmFlightTicket: boolean;
  isSendEmailToPassengerToConfirmSuccessIssuedTicket: boolean;
  listRequestBookingHistories: any;
  // signalOpenPopupUpdateNumberTicket: boolean = false;
  isSetSinalUpdateStatusRequestBooking: boolean = true;


  valueInputNumberAmount = '';
  tooltipTitleAmount = 'Nhập số tiền';

  @ViewChild('inputElementAmount', { static: false }) inputElementAmount?: ElementRef

  isLoadingButtonSaveAirlineTicketInfo: boolean = false;
  idRequestBooking: number;
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
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super('id');
    this.uploadHeader = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    };
    this.uploadUrlFlightTicket = `${this.configService.getConfig().api.baseUrl}/Upload/UploadRequestBookingFile?RequestBookingId=null&TypeFile=null`;
    this.uploadUrlInvoice = `${this.configService.getConfig().api.baseUrl}/Upload/UploadRequestBookingFile?RequestBookingId=null&TypeFile=null`;
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
  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe(async params => {
      this.idRequestBooking = +params[Constant.ID];
      if (this.idRequestBooking) {
        this.getRequestBookingByID(this.idRequestBooking).then((result: any) => {
          this.showPopupViewRequestBookingTicket(result);
        });
      }
    });
  }


  private getRequestBookingByID(requestBookingId: number) {
    return new Promise((resolve, reject) => {
      this.generalService.getRequestBookingByID(requestBookingId).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              return resolve(res.data);
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Lấy lượt đặt vé theo yêu cầu không thành công');
              }
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Lấy lượt đặt vé theo yêu cầu thất bại do lỗi hệ thống');
          },
        }
      ).add(() => {
      });
    });

  }

  onRowPrepared(e) {
    this.activatedRoute.queryParams.subscribe(async params => {
      this.idRequestBooking = +params[Constant.ID]; // Lấy id từ query parameter
      if (e.rowType === "data") {
        if (e.data.id == this.idRequestBooking) {
          e.cellElement.style.cssText = "color: black; background-color: #ffffaa;";
        } else {
          e.cellElement.style.cssText = "";
        }
      }
    });
  }

  disabledHoldExpiryDateDepartureDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) < 0;


  onChangeInputAmount(value: string, controlName?: string): void {
    this.updateValueInputAmount(value);

  }

  onClickInputAmount(event: any, controlName?: string): void {
    const inputElement = event.target as HTMLInputElement;
    this.valueInputNumberAmount = inputElement.value;

    this.updateValueInputAmount(this.valueInputNumberAmount);
  }

  // '.' at the end or only '-' in the input box.
  onBlurInputAmount(controlName?: string): void {
    if (this.valueInputNumberAmount.charAt(this.valueInputNumberAmount.length - 1) === '.' || this.valueInputNumberAmount === '-') {
      this.updateValueInputAmount(this.valueInputNumberAmount.slice(0, -1), controlName);
      this.tooltipTitleAmount = "0 VNĐ"
    }
  }


  updateValueInputAmount(value: string, controlName?: string): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      this.valueInputNumberAmount = value;
    }
    // Chỉ cập nhật nếu giá trị khác
    if (controlName) {
      const control = this.formAirlineTicketPopup.get(controlName);
      if (control && control.value !== this.valueInputNumberAmount) {
        control.setValue(this.valueInputNumberAmount, { emitEvent: false });
      }
    }
    this.updateTooltipTitleAmount();
  }

  updateTooltipTitleAmount(): void {
    this.tooltipTitleAmount = ((this.valueInputNumberAmount !== '-' ? this.formatNumber(this.valueInputNumberAmount) : '-') || '0') + " VNĐ";
  }

  formatNumber(value: string): string {
    const stringValue = `${value}`;
    const list = stringValue.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
  }

  ngOnInit(): void {
    this.getListData().then(result => {
      if (this.router.url === '/booking-service/airline-ticket-booking-request') {
        // cập nhất lại trạng thái quá hạn giữ chỗ
        this.datas.forEach(requestBooking => {
          if (this.isSetSinalUpdateStatusRequestBooking) {
            if (requestBooking.status == this.BookingRequestStatusEnum.ReserveSeat || requestBooking.status == this.BookingRequestStatusEnum.AdjustTicket) {
              const ticketHoldExpiryDate = requestBooking.ticketHoldExpiryDate != null ? new Date(requestBooking.ticketHoldExpiryDate) : new Date(0);
              const now = new Date();
              if (ticketHoldExpiryDate < now) {
                this.updateStatusRequestBooking(requestBooking.id, this.BookingRequestStatusEnum.ExpiredTicket).then((r) => {
                  this.getListData();
                });
              }
            }
          }
        });
      }
    });
    this.getUserInfo();
    this.getAirport();



    this.intervalRequestBookingUpdateStatus = setInterval(() => {
      setTimeout(() => {
        if (this.router.url === '/booking-service/airline-ticket-booking-request') {
          // cập nhất lại trạng thái quá hạn giữ chỗ
          this.datas.forEach(requestBooking => {
            if (this.isSetSinalUpdateStatusRequestBooking) {
              if (requestBooking.status == this.BookingRequestStatusEnum.ReserveSeat || requestBooking.status == this.BookingRequestStatusEnum.AdjustTicket) {
                const ticketHoldExpiryDate = requestBooking.ticketHoldExpiryDate != null ? new Date(requestBooking.ticketHoldExpiryDate) : new Date(0);
                const now = new Date();
                if (ticketHoldExpiryDate < now) {
                  this.updateStatusRequestBooking(requestBooking.id, this.BookingRequestStatusEnum.ExpiredTicket).then((r) => {
                    this.getListData();
                  });
                }
              }
            }
          });
        } else {
          clearInterval(this.intervalRequestBookingUpdateStatus);
        }
      }, 200);
    }, RequestBookingConfig.TIME_UPDATE_DATAS);
  }

  ngOnDestroy(): void {

  }

  requiredIfRoundTrip(control: FormControl) {
    return this.itemBookingRequest?.typeTicket == TypeAirlineTicket.RoundTrip ? Validators.required(control) : null;
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
            en.userCreatedName = en.userBooking?.fullname ?? "";
            en.statusOld = en.status;
            en.isLoadingRequestBookingHistory = false;
            en.ticketPriceTotal = en.ticketPrice + (en.typeTicket == TypeAirlineTicket.RoundTrip ? (en.returnTicketPrice ?? 0) : 0);
            en.refundFeeTotal = en.refundFee + (en.typeTicket == TypeAirlineTicket.RoundTrip ? (en.returnRefundFee ?? 0) : 0);
            en.cancelFeeTotal = en.cancelFee + (en.typeTicket == TypeAirlineTicket.RoundTrip ? (en.returnCancelFee ?? 0) : 0);
            en.changeFeeTotal = en.changeFee + (en.typeTicket == TypeAirlineTicket.RoundTrip ? (en.returnChangeFee ?? 0) : 0);
            en.baggageFeeTotal = en.baggageFee + (en.typeTicket == TypeAirlineTicket.RoundTrip ? (en.returnBaggageFee ?? 0) : 0);
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
    this.fileFlightTicketList = this.fileFlightTicketList.concat(file);
    return false;
  };


  previewPopupRequestBookingHistory(requestBookingItem: any) {
    this.itemBookingRequest = requestBookingItem;
    let requestBookingID = requestBookingItem.id;
    this.getHistoriesByRequestBookingID(requestBookingID).then((r) => {
      this.isVisibleRequestBookingHistory = true;
    });
  }

  getHistoriesByRequestBookingID(requestBookingID: number) {
    this.itemBookingRequest.isLoadingRequestBookingHistory = true;
    return new Promise((resolve, reject) => {
      this.generalService.getHistoriesByRequestBookingId(requestBookingID).subscribe({
        next: (res: any) => {
          if (res.isValid) {
            this.listRequestBookingHistories = res.data;
            let stt = 0;
            this.listRequestBookingHistories.forEach((en: any) => {
              en.stt = ++stt;
            });
            resolve(true);
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Lỗi khi lấy dữ liệu lịch sử book vé');
            }
          }
        },

        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Lỗi hệ thống');
        },

        complete: () => {
          this.itemBookingRequest.isLoadingRequestBookingHistory = false;
        }
      });

    });
  }

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
      return '0 VNĐ';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VNĐ';
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


      flightTimeDeparture: [
        requestPartnerValue.startTime ?? (requestPartnerValue.departureDay ? new Date(`${requestPartnerValue.departureDay}`).setHours(0, 0, 0, 0) : '-'),
        requestPartnerValue.endTime ?? (requestPartnerValue.departureDay ? new Date(`${requestPartnerValue.departureDay}`).setHours(23, 59, 0, 0) : '-')
      ],
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
      flightTimeReturn: [
        requestPartnerValue.returnStartTime ?? (requestPartnerValue.returnDay ? new Date(`${requestPartnerValue.returnDay}`).setHours(0, 0, 0, 0) : '-'),
        requestPartnerValue.returnEndTime ?? (requestPartnerValue.returnDay ? new Date(`${requestPartnerValue.returnDay}`).setHours(23, 59, 0, 0) : '-')],
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
    this.ticketRoundTrip = this.itemBookingRequest.typeTicket == TypeAirlineTicket.RoundTrip
    this.itemBookingRequest.status = status.value;
    this.newStatus = status.value;
    this.oldStatus = status.data.statusOld;
    let requestBookingId = status.data.id;
    switch (this.newStatus) {
      case this.BookingRequestStatusEnum.SubmitRequest:
        this.updateStatusRequestBooking(this.itemBookingRequest.id, this.BookingRequestStatusEnum.SubmitRequest).then((r) => {
          this.getListData();
        });
        break;
      case this.BookingRequestStatusEnum.ReserveSeat:
        this.isSetSinalUpdateStatusRequestBooking = false;

        // this.sendEmailToPassengerToConfirmFlightTicket(requestBookingId);
        this.showPopupAirlineTicket(this.itemBookingRequest, this.OptionAirlineTicketInfoEnum.Update)


        // this.signalOpenPopupUpdateNumberTicket = false;
        // this.isSendEmailToPassengerToConfirmFlightTicket = true;
        // this.isSendEmailToPassengerToConfirmSuccessIssuedTicket = false;

        this.getListData();
        break;
      case this.BookingRequestStatusEnum.ReceivedTicket:

        break;
      case this.BookingRequestStatusEnum.ExpiredTicket:

        break;

      case this.BookingRequestStatusEnum.AdjustTicket:
        //Mở popup Cập nhật thông tin vé
        this.showPopupAirlineTicket(this.itemBookingRequest, this.OptionAirlineTicketInfoEnum.Update)

        // this.signalOpenPopupUpdateNumberTicket = false;
        // this.isSendEmailToPassengerToConfirmFlightTicket = true;
        // this.isSendEmailToPassengerToConfirmSuccessIssuedTicket = false;
        break;

      case this.BookingRequestStatusEnum.IssuedTicket:
        //Mở popup Cập nhật thông tin vé
        this.showPopupAirlineTicket(this.itemBookingRequest, this.OptionAirlineTicketInfoEnum.Update)

        // this.signalOpenPopupUpdateNumberTicket = true;
        // this.isSendEmailToPassengerToConfirmFlightTicket = false;
        this.isSendEmailToPassengerToConfirmSuccessIssuedTicket = true;
        break;

      case this.BookingRequestStatusEnum.FailureTicket:
        this.FailureTicketRequestBookingById(this.itemBookingRequest.id);
        break
      default:
        break;
    }
    status.data.statusOld = this.newStatus;
    this.oldStatus = this.newStatus;
  }

  sendEmailToPassengerToConfirmFlightTicket(requestBookingId: any) {
    return new Promise((resolve, reject) => {
      this.generalService.sendEmailToPassengerToConfirmFlightTicket(requestBookingId).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              resolve(true);
              this.notificationService.showNotification(Constant.SUCCESS, 'Đã gửi email thông báo giữ chỗ tới khách hàng');
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Gửi email thông báo giữ chỗ tới khách hàng không thành công');
              }
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Gửi email thông báo giữ chỗ tới khách hàng thất bại do lỗi hệ thống');
          },
          complete: () => {
          }
        }
      ).add(() => {
      });
    })

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
              reject(res.errors);
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Thay đổi trạng thái thất bại do lỗi hệ thống');
            reject(err);
          },
          complete: () => {
          }
        }
      ).add(() => {
      });
    });



  }

  showPopupAirlineTicket(itemData: any, opPopupAirlineTicket: OptionAirlineTicketPopup) {
    this.isSetSinalUpdateStatusRequestBooking = false;
    this.itemBookingRequest = itemData;
    this.isVisibleAirlineTicketInfo = true;
    this.ticketRoundTrip = this.itemBookingRequest.typeTicket == TypeAirlineTicket.RoundTrip;
    this.optionAirlineTicketInfo = opPopupAirlineTicket;
    this.newStatus = this.itemBookingRequest.status;
    if (itemData.status == AirlineTicketBookingRequestStatus.ReserveSeat) {
      // this.isSendEmailToPassengerToConfirmFlightTicket = true;
      // this.isSendEmailToPassengerToConfirmSuccessIssuedTicket = false;
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
      flightTimeDeparture: [
        itemData.startTime ?? (itemData.departureDay ? new Date(`${itemData.departureDay}`).setHours(0, 0, 0, 0) : '-'),
        itemData.endTime ?? (itemData.departureDay ? new Date(`${itemData.departureDay}`).setHours(23, 59, 0, 0) : '-')],
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


      flightTimeReturn: [
        itemData.returnStartTime ?? (itemData.returnDay ? new Date(`${itemData.returnDay}`).setHours(0, 0, 0, 0) : '-'),
        itemData.returnEndTime ?? (itemData.returnDay ? new Date(`${itemData.returnDay}`).setHours(23, 59, 0, 0) : '-')],
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

    this.ticketRoundTrip = itemData.typeTicket == TypeAirlineTicket.RoundTrip
    this.listFileIds = [];
    this.fileFlightTicketList = [];
    for (const file of itemData.files) {
      const objFile = {
        uid: file.id.toString(),
        name: file.fileName,
        url: `${this.configService.getConfig().api.baseUrl}/${file.filePath}`,
      };
      this.fileFlightTicketList.push(objFile);
    }
    this.uploadUrlFlightTicket = `${this.configService.getConfig().api.baseUrl}/Upload/UploadRequestBookingFile?RequestBookingId=${itemData.id}&TypeFile=${TypeOfDocument.FlightTicketFile}`;
    this.uploadUrlInvoice = `${this.configService.getConfig().api.baseUrl}/Upload/UploadRequestBookingFile?RequestBookingId=${itemData.id}&TypeFile=${TypeOfDocument.InvoiceFile}`;
  }

  showPopupUpdateNumberTicket(requestBooking: any) {
    this.itemBookingRequest = requestBooking;
    this.newStatus = this.itemBookingRequest.status;
    this.isVisiblePopupUpdateNumberTicket = true;
    // this.isSendEmailToPassengerToConfirmFlightTicket = false;
    this.isSendEmailToPassengerToConfirmSuccessIssuedTicket = false;
  }

  handleUploadFileTicketBookingRequest1({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status === 'done') {
      this.msg.success(`file ${file.name} tải lên thành công.`);
      this.fileFlightTicketList = fileList;
      setTimeout(() => {
        if (this.fileFlightTicketList.length > 0) {
          this.fileFlightTicketList[this.fileFlightTicketList.length - 1].fileId = file.response.fileId.toString();
          this.fileFlightTicketList[this.fileFlightTicketList.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${file.response.path}`;
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
    this.getListData();
  }


  handleUploadFileTicketBookingRequest2BeforSelect({ file, fileList }: NzUploadChangeParam): void {
    this.uploading = true;
    this.fileFlightTicketList.forEach((file: any) => {
      const formData = new FormData();
      formData.append('postedFile', file);
      const req = new HttpRequest('POST', `${this.uploadUrlFlightTicket}`, formData, {
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
            this.fileFlightTicketList = fileList;
            setTimeout(() => {
              if (this.fileFlightTicketList.length > 0) {
                this.fileFlightTicketList[this.fileFlightTicketList.length - 1].uid = file.response.fileId.toString();
                this.fileFlightTicketList[this.fileFlightTicketList.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${file.response.path}`;
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
      const idFile = file.uid;
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
              this.getListData();
            },

          }
        );
      }

    } else {
      this.notificationService.showNotification(Constant.ERROR, `Không thể xoá file khi ở chế độ View Ticket`);
    }
  }


  handleUploadFileInvoiceBookingRequest1({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status === 'done') {
      this.msg.success(`file ${file.name} tải lên thành công.`);
      this.fileInvoiceList = fileList;
      setTimeout(() => {
        if (this.fileInvoiceList.length > 0) {
          this.fileInvoiceList[this.fileInvoiceList.length - 1].fileId = file.response.fileId.toString();
          this.fileInvoiceList[this.fileInvoiceList.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${file.response.path}`;
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
    this.getListData();
  }
  handleRemoveFileInvoiceBookingRequest = async (file: NzUploadFile): Promise<void> => {
    if (this.optionAirlineTicketInfo == this.OptionAirlineTicketInfoEnum.Update) {
      const idFile = file.uid;
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
              this.getListData();
            },

          }
        );
      }

    } else {
      this.notificationService.showNotification(Constant.ERROR, `Không thể xoá file khi ở chế độ View Ticket`);
    }
  }

  handleSaveArilineTicketPopup() {
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


        startTime: new Date(formValue.flightTimeDeparture[0]) ?? new Date(),
        endTime: new Date(formValue.flightTimeDeparture[1]) ?? new Date(),


        bookingCode: formValue.bookingCodeDeparture,
        flightNumber: formValue.flightNumberDeparture,
        ticketPrice: formValue.ticketPriceDeparture,
        refundFee: formValue.refundFeeDeparture,
        changeFee: formValue.changeFeeDeparture,
        cancelFee: formValue.cancelFeeDeparture,
        baggageFee: formValue.baggageFeeDeparture,
        ticketHoldExpiryDate: formValue.ticketHoldExpiryDateDeparture,
        reservationCode: formValue.reservationCodeDeparture,

        returnStartTime: new Date(formValue.flightTimeReturn[0]) ?? new Date(),
        returnEndTime: new Date(formValue.flightTimeReturn[1]) ?? new Date(),
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

      this.isLoadingButtonSaveAirlineTicketInfo = true;
      this.updateRequestBooking(payload).then((result) => {
        this.isLoadingButtonSaveAirlineTicketInfo = false;
        // this.isVisibleAirlineTicketInfo = false;
        this.isSetSinalUpdateStatusRequestBooking = true;
        // Mở popup cập nhật số vé
        switch (this.newStatus) {
          case this.BookingRequestStatusEnum.ReserveSeat:
            this.ReserveSeatRequestBookingById(this.itemBookingRequest.id).then((result) => {
              this.notificationService.showNotification(Constant.SUCCESS, "Cập nhật vé thành công");
              this.getListData();
              this.isVisibleAirlineTicketInfo = false;
              if (result) {
                // this.isVisiblePopupUpdateNumberTicket = this.signalOpenPopupUpdateNumberTicket;
                // this.isVisiblePopupUpdateNumberTicket = false;
                this.sendEmailToPassengerToConfirmFlightTicket(this.itemBookingRequest.id);
                // if (this.isSendEmailToPassengerToConfirmFlightTicket) {
                //   this.sendEmailToPassengerToConfirmFlightTicket(this.itemBookingRequest.id);
                // }
              } else {
              }

            }).catch((error) => {
              this.getListData();
            });
            break;

          case this.BookingRequestStatusEnum.AdjustTicket:
            if (payload) {
              if (payload.typeTicket == TypeAirlineTicket.OneWay) {
                if (!payload.baggageFee && !payload?.refundFee && !payload.cancelFee && !payload.changeFee) {
                  this.msg.error("Phải nhập ít nhất một trong các phí hành lý/hoàn vé/huỷ vé/đổi vé chiều đi");
                  return;
                }
              } else if (payload.typeTicket == TypeAirlineTicket.RoundTrip) {
                if (!payload.baggageFee && !payload?.refundFee && !payload.cancelFee && !payload.changeFee) {
                  this.msg.error("Phải nhập ít nhất một trong các phí hành lý/hoàn vé/huỷ vé/đổi vé chiều đi");
                  if (!payload.returnBaggageFee && !payload?.returnRefundFee && !payload.returnCancelFee && !payload.returnChangeFee) {
                    this.msg.error("Phải nhập ít nhất một trong các phí hành lý/hoàn vé/huỷ vé/đổi vé chiều vé");
                  }
                  return;
                }
              }
            }
            this.AdjuctTicketRequestBookingById(this.itemBookingRequest.id).then((r) => {
              this.notificationService.showNotification(Constant.SUCCESS, "Cập nhật vé thành công");
              this.isVisibleAirlineTicketInfo = false;
              this.getListData();
              this.sendEmailToPassengerToConfirmFlightTicket(this.itemBookingRequest.id).then(() => {
                // this.isSendEmailToPassengerToConfirmFlightTicket = false;
              });
              // if (this.isSendEmailToPassengerToConfirmFlightTicket) {
              //   this.sendEmailToPassengerToConfirmFlightTicket(this.itemBookingRequest.id).then(() => {
              //     // this.isSendEmailToPassengerToConfirmFlightTicket = false;
              //   });
              // }
            }).catch((error) => {
              this.getListData();
            });;
            break;

          case this.BookingRequestStatusEnum.IssuedTicket:
            var isValidateFile = true;
            if (this.fileFlightTicketList == null || this.fileFlightTicketList == undefined || this.fileFlightTicketList?.length == 0) {
              this.msg.error("File vé máy bay không được để trống");
              isValidateFile = false;
            }

            // if (this.fileInvoiceList == null || this.fileInvoiceList == undefined || this.fileInvoiceList?.length == 0) {
            //   this.msg.error("File hoá đơn không được để trống");
            //   isValidateFile = false;
            // }

            if (!isValidateFile) {
              return;
            }
            this.isVisibleAirlineTicketInfo = false;
            this.isVisiblePopupUpdateNumberTicket = true;
            break;
          default:
            this.getListData();
        }
      }).catch((error) => {
        this.getListData();
        this.isVisibleAirlineTicketInfo = true;
        this.isSetSinalUpdateStatusRequestBooking = true;
        this.isLoadingButtonSaveAirlineTicketInfo = false;

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
        // (res: any) => {
        //   if (res.ret && res.ret[0].code !== 0) {
        //     this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        //   } else {
        //     // this.notificationService.showNotification(Constant.SUCCESS, "Cập nhật vé thành công");
        //     resolve(true);
        //   }
        // }, error => {
        //   reject(error);
        // }
        {
          next: (res) => {
            if (res.isValid) {
              resolve(res.data);
            } else {
              if (res.errors && res.errors.length > 0) {
                reject(res.errors)
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Cập nhật vé không thành công');
              }
            }
          },
          error: (error) => {
            this.notificationService.showNotification(Constant.ERROR, 'Cập nhật thông tin vé phòng thật bại do lỗi hệ thống');
          },

          complete: () => {
          }
        }

      );
    });

  }

  handleCancelArilineTicketPopup() {
    this.isLoadingButtonSaveAirlineTicketInfo = false;
    this.isVisibleAirlineTicketInfo = false;
    this.getListData();
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
    // this.signalOpenPopupUpdateNumberTicket = false;
    this.getListData();
  }

  handleSavelPopupUpdateNumberTicket() {
    return new Promise((resolve, reject) => {
      const passengersUpdatePayload = this.itemBookingRequest.passengers;
      let findPassengerError = passengersUpdatePayload.find(passenger => !passenger.ticketNumber);
      if (findPassengerError) {
        this.msg.error("Tồn tại trường số vé chưa nhập");
      } else {
        this.generalService.updatePassengerRequestBookings({ passengers: passengersUpdatePayload }).subscribe(
          {
            next: (res: any) => {
              if (res.isValid) {
                this.notificationService.showNotification(Constant.SUCCESS, `Cập nhật số vé khách hàng thành công!`);
                this.isVisiblePopupUpdateNumberTicket = false;
                switch (this.newStatus) {
                  case this.BookingRequestStatusEnum.IssuedTicket:
                    this.IssuedTicketRequestBookingById(this.itemBookingRequest.id).then((r) => {
                      this.getListData();
                      if (this.isSendEmailToPassengerToConfirmSuccessIssuedTicket) {
                        this.sendEmailToPassengerToConfirmSuccessIssuedTicket(this.itemBookingRequest.id).then((result) => {
                          if (result) {
                            this.isSendEmailToPassengerToConfirmSuccessIssuedTicket = false;
                          }
                        });
                      }
                    }).catch((err) => {
                      this.getListData();
                    });

                    break;

                  default:
                    this.getListData();
                    break;
                }
                resolve(true);
              } else {
                if (res.errors && res.errors.length > 0) {
                  res.errors.forEach((el: any) => {
                    this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                  });
                } else {
                  this.notificationService.showNotification(Constant.ERROR, 'Cập nhật số vé khách hàng không thành công');
                }
              }
            },
            error: (err: any) => {
              this.notificationService.showNotification(Constant.ERROR, 'Cập nhật số vé khách hàng thật bại do lỗi hệ thống');
              reject(err);
            },
            complete: () => {

            }
          }
        ).add(() => {
        });
      }
    });
  }

  ReserveSeatRequestBookingById(id: number) {
    return new Promise((resolve, reject) => {
      this.generalService.updateStatusRequestBooking(id, this.BookingRequestStatusEnum.ReserveSeat).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              this.notificationService.showNotification(Constant.SUCCESS, `Giữ chỗ thành công!`);
              resolve(true);
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Giữ chỗ không thành công.');
              }
              reject(res.errors);
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Giữ chỗ thất bại do lỗi hệ thống');
            reject(err);
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
              reject(res.errors);
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Điều chỉnh vé thất bại do lỗi hệ thống');
            reject(err);
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
              reject(false);
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Xuất vé thất bại do lỗi hệ thống');
            reject(err);
          },
          complete: () => {
          }
        }
      ).add(() => {
      });
    });

  }

  FailureTicketRequestBookingById(id: number) {
    return new Promise((resolve, reject) => {
      this.generalService.updateStatusRequestBooking(id, this.BookingRequestStatusEnum.FailureTicket).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              this.notificationService.showNotification(Constant.SUCCESS, `Đã chuyển trạng thái vé thành Xuất vé thất bại`);
              resolve(true);
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Không thể trạng thái vé thành Xuất vé thất bại');
              }
              reject(false);
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Không thể trạng thái vé thành Xuất vé thất bại do lỗi hệ thống');
            reject(err);
          },
          complete: () => {
          }
        }
      ).add(() => {
      });
    });

  }

  sendEmailToPassengerToConfirmSuccessIssuedTicket(requestBookingId: number) {
    return new Promise((resolve, reject) => {
      this.generalService.sendEmailToPassengerToConfirmSuccessIssuedTicket(requestBookingId).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              this.notificationService.showNotification(Constant.SUCCESS, 'Đã gửi email thông báo xuất vé đến khách hàng');
              resolve(true);
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Gửi email thông báo xuất vé đến khách hàng không thành công');
              }
              resolve(false);
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Gửi email thông báo xuất vé đến khách hàng thất bại do lỗi hệ thống');
            reject(err);
          },
          complete: () => {
          }
        }
      ).add(() => {
      });
    });

  }


  handleCancelRequestBookingTicketPopup() {
    this.isVisiblePopupViewRequestBookingTicket = false;
    this.getListData();
  }

  showPopupViewRequestBookingTicket(requestBooking: any) {
    this.itemBookingRequest = requestBooking;
    this.isVisiblePopupViewRequestBookingTicket = true;
  }

  handleChangeTypeTicket(event: any) {
    let typeTicket = event;
    this.itemBookingRequest.typeTicket = typeTicket;

    // Nếu cần kiểm tra lại tính hợp lệ của form sau khi thay đổi loại vé
    this.formAirlineTicketPopup.updateValueAndValidity();
    // Hoặc cập nhật lại giá trị và tính hợp lệ của từng control cụ thể
    this.formAirlineTicketPopup.get('airlineCodeReturn')?.updateValueAndValidity();
    this.formAirlineTicketPopup.get('reservationCodeReturn')?.updateValueAndValidity();
    this.formAirlineTicketPopup.get('flightTimeReturn')?.updateValueAndValidity();
    this.formAirlineTicketPopup.get('flightNumberReturn')?.updateValueAndValidity();
    this.formAirlineTicketPopup.get('ticketHoldExpiryDateReturn')?.updateValueAndValidity();
    this.formAirlineTicketPopup.get('ticketPriceReturn')?.updateValueAndValidity();
    this.ticketRoundTrip = typeTicket == TypeAirlineTicket.RoundTrip
  }
}
