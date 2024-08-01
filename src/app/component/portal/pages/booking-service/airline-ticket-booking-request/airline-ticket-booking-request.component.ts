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
  isVisibleDetailTransactionHistoryTickets: boolean = false;
  listDetailTicket: any[];
  readonly allowedPageSizes = [10, 20, 50, 100, 200, 'all'];
  displayMode = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  isVisibleAirlineTicketInfo: boolean = false;
  itemTicketHistoryTicket: any;
  airports: any[] = [];
  intervalIdUserRegister: NodeJS.Timeout;

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
      fileIds: new FormControl({ value: [], disabled: false }, Validators.required),
      tripItineraryDeparture: new FormControl({ value: null, disabled: false }, Validators.required),
      flightTimeDeparture: new FormControl({ value: [], disabled: false }, Validators.required),
      airlineCodeDeparture: new FormControl({ value: '', disabled: false }, Validators.required),
      bookingCodeDeparture: new FormControl({ value: null, disabled: false }, Validators.required),
      flightNumberDeparture: new FormControl({ value: null, disabled: false }, Validators.required),
      ticketHoldExpiryDateDeparture: new FormControl({ value: null, disabled: false }, Validators.required),
      ticketPriceDeparture: new FormControl({ value: null, disabled: false }, Validators.required),
      baggageFeeDeparture: new FormControl({ value: null, disabled: false }, Validators.required),
      refundFeeDeparture: new FormControl({ value: null, disabled: false }, Validators.required),
      cancelFeeDeparture: new FormControl({ value: null, disabled: false }, Validators.required),
      changeFeeDeparture: new FormControl({ value: null, disabled: false }, Validators.required),

      flightTimeReturn: new FormControl({ value: [], disabled: false }, Validators.required),
      airlineCodeReturn: new FormControl({ value: '', disabled: false }, Validators.required),
      bookingCodeReturn: new FormControl({ value: null, disabled: false }, Validators.required),
      flightNumberReturn: new FormControl({ value: null, disabled: false }, Validators.required),
      ticketHoldExpiryDateReturn: new FormControl({ value: null, disabled: false }, Validators.required),
      ticketPriceReturn: new FormControl({ value: null, disabled: false }, Validators.required),
      baggageFeeReturn: new FormControl({ value: null, disabled: false }, Validators.required),
      refundFeeReturn: new FormControl({ value: null, disabled: false }, Validators.required),
      cancelFeeReturn: new FormControl({ value: null, disabled: false }, Validators.required),
      changeFeeReturn: new FormControl({ value: null, disabled: false }, Validators.required),

    });

  }

  ngOnInit(): void {
    this.getListData();
    this.getUserInfo();
    this.getAirport();


    this.intervalIdUserRegister = setInterval(() => {
      setTimeout(() => {
        if (this.router.url === '/booking-service/airline-ticket-booking-request') {
          this.getListData().then((r) => {
            // cập nhất lại trạng thái quá hạn giữ chỗ
            this.datas.forEach(requestBooking => {
              if (requestBooking.status == this.BookingRequestStatusEnum.ReserveSeat) {
                const ticketHoldExpiryDate = requestBooking.ticketHoldExpiryDate != null ? new Date(requestBooking.ticketHoldExpiryDate) : new Date(0);
                const now = new Date();
                if (ticketHoldExpiryDate < now) {
                  this.updateStatusRequestBooking(requestBooking.id, this.BookingRequestStatusEnum.ExpiredTicket);
                }
              }
            });
          });
        } else {
          clearInterval(this.intervalIdUserRegister);
        }
      }, 200);
    }, RequestBookingConfig.TIME_UPDATE_DATAS);
  }

  ngOnDestroy(): void {

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




  previewDetailTransactionHistoryTickets(historyTransaction: any) {
    this.isVisibleDetailTransactionHistoryTickets = true;
    this.listDetailTicket = this.getListDetailTicket(historyTransaction);
    let stt = 0;
    this.listDetailTicket.forEach(en => {
      en.gender = en.gender ? 'Nam' : 'Nữ'
      en.startPoint = this.convertRotueBookingReservations(en.route)[stt].startPoint;
      en.endPoint = this.convertRotueBookingReservations(en.route)[stt].endPoint;
      en.fromToPoint = `${en.startPoint} - ${en.endPoint}`
      en.stt = ++stt;
    });
  }

  getListDetailTicket(historyTransaction: any) {
    const bookingFlights = historyTransaction.bookingFlights;
    const bookingPassengers = historyTransaction.bookingPassengers;
    const bookingReservations = historyTransaction.bookingReservations;

    // Create a dictionary to store objects based on bookingId
    let arraybookingDataMap = [];

    // Populate the dictionary with data from bookingFlights
    bookingFlights.forEach((flight: any) => {
      let bookingDataMap = {};
      if (flight) {
        bookingDataMap = { ...flight };
      }
      const bookingId = flight.bookingId;

      const matchingPassenger = bookingPassengers.find((passenger: any) => passenger.bookingId = flight.bookingId);
      if (matchingPassenger) {
        bookingDataMap = { ...bookingDataMap, ...matchingPassenger };
      }

      const matchingReservation = bookingReservations.find((reservation: any) => reservation.bookingId === flight.bookingId);
      if (matchingReservation) {
        bookingDataMap = { ...bookingDataMap, ...matchingReservation };
      }

      arraybookingDataMap.push(bookingDataMap);
    });

    return arraybookingDataMap;
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

  handleCancel() {
    this.isVisibleDetailTransactionHistoryTickets = false;
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

  formatCurrencyVND(value) {
    console.log("value formatCurrencyVND", value);

    if (!value) {
      return '0 đ';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  }


  handleChangeStatusByItem(status: any) {
    let newStatus = status.value;
    let oldStatus = status.data.statusOld;
    let requestBookingId = status.data.id;
    console.log("status: ", status);

    // setTimeout(() => {
    //   status.value = oldStatus;
    // }, 200);
    switch (newStatus) {
      case this.BookingRequestStatusEnum.SubmitRequest:

        break;
      case this.BookingRequestStatusEnum.ReserveSeat:
        this.updateStatusRequestBooking(requestBookingId, this.BookingRequestStatusEnum.ReserveSeat).then((r) => {
          this.generalService.sendEmailToPassengerToConfirmFlightTicket(requestBookingId).subscribe(
            {
              next: (res: any) => {
                if (res.isValid) {

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
        break;
      case this.BookingRequestStatusEnum.ReceivedTicket:

        break;
      case this.BookingRequestStatusEnum.ExpiredTicket:

        break;
      case this.BookingRequestStatusEnum.IssuedTicket:

        break;
      default:
        break;
    }
    status.data.statusOld = newStatus;
  }

  updateStatusRequestBooking(requestBookingId: number, status: number) {
    return new Promise((resolve, reject) => {
      this.generalService.updateStatusRequestBooking(requestBookingId, status).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              this.notificationService.showNotification(Constant.SUCCESS, 'Thay đổi trạng thái thành công');
              this.getListData();
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
            this.getListData();
          }
        }
      ).add(() => {
        this.getListData();
      });
    });



  }

  showPopupAirlineTicket(itemData: any, opPopupAirlineTicket: OptionAirlineTicketPopup) {
    // console.log("this.itemData : ", itemData);

    this.itemBookingRequest = itemData;
    this.isVisibleAirlineTicketInfo = true;
    this.optionAirlineTicketInfo = opPopupAirlineTicket;

    if (this.optionAirlineTicketInfo == this.OptionAirlineTicketInfoEnum.View) {
      this.formAirlineTicketPopup.disable();
      this.showUploadListOption = { ...this.showUploadListOption, ...{ showPreviewIcon: true, showRemoveIcon: false, showDownloadIcon: true } }
    }
    if (this.optionAirlineTicketInfo == this.OptionAirlineTicketInfoEnum.Update) {
      this.formAirlineTicketPopup.enable();
      this.showUploadListOption = { ...this.showUploadListOption, ...{ showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: true } }
    }
    this.formAirlineTicketPopup.patchValue({
      typeTicket: itemData.typeTicket,
      passengers: itemData.passengers.map(passenger => passenger.fullName),

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

  handleUploadFileTicketBookingRequest1({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status === 'done') {
      this.msg.success(`file ${file.name} tải lên thành công.`);
      this.getListData();
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
    } else if (status === 'error') {
      this.msg.error(`file ${file.name} tải lên không thành công.`);
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
            this.msg.success(`file ${file.name} tải lên thành công.`);
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
      const idFile = file.uid;
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
    } else {
      this.notificationService.showNotification(Constant.ERROR, `Không thể xoá file khi ở chế độ View Ticket`);
    }
  };

  handleSavelArilineTicketPopup() {
    let formValue = this.formAirlineTicketPopup.value;
    let payLoad = {
      id: this.itemBookingRequest.id,
      approvalCode: this.itemBookingRequest.approvalCode,
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

    }
    this.generalService.updateRequestBooking(payLoad).subscribe(
      (res: any) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
        }
      }, error => {

      });
  }

  handleCancelArilineTicketPopup() {
    this.isVisibleAirlineTicketInfo = false;
  }
}
