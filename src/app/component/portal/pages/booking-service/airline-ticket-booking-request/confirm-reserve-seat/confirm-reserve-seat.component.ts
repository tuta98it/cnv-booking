import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AirlineTicketBookingRequestStatus } from 'src/app/enums/airline-ticket-booking-request-status.enum';
import { GeneralService } from 'src/app/service/general-service';
import { NotificationService } from 'src/app/service/notification.service';
import { Constant } from 'src/app/shared/constants/constant.class';
import { FlightUtils } from 'src/app/shared/utils/flight-utils.class';
import { MenuStateService } from 'src/app/shared/app-state/menu-state.service';

@Component({
  selector: 'confirm-reserve-seat',
  templateUrl: './confirm-reserve-seat.component.html',
  styleUrls: ['./confirm-reserve-seat.component.scss']
})
export class ConfirmReserveSeatComponent implements OnInit {

  requestBookingId: number = null;
  requestBookingCurrent: any;
  airports: any;
  isReservedSuccess: boolean = false;
  BookingRequestStatusEnum = AirlineTicketBookingRequestStatus
  errorMessenger: any;
  successMessenger: any;
  constructor(private router: Router,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    public flightUtils: FlightUtils,
    private menuStateService: MenuStateService
  ) { }

  ngOnInit(): void {
    //this.menuStateService.dispatch(false);
    this.successMessenger = ``;
    const currentUrl = window.location.href;
    // Tạo một đối tượng URL từ URL hiện tại
    const url = new URL(currentUrl);
    // Lấy giá trị của tham số 'request-booking-id'
    this.requestBookingId = +url.searchParams.get('request-booking-id');

    this.getAirport().then((r) => {
      this.getRequestBookingByID().then((r) => {
        this.reserveSeateRequestBookingById(this.requestBookingId).then((r) => {
          this.sendEmailToAdminVHLNotifyFlightTicketConfirmed();
        });
      });
    });
  }


  ngAfterViewChecked() {

  }


  getAirport() {
    return new Promise((resolve, reject) => {
      this.generalService.getAirport().subscribe((res: any) => {
        if (res !== null) {
          this.airports = res;
          return resolve(true);
        }
      }, error => {
      });
    });

  }

  getRequestBookingByID() {
    return new Promise((resolve, reject) => {
      this.generalService.getRequestBookingByID(this.requestBookingId).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              this.requestBookingCurrent = res.data;
              this.requestBookingCurrent.airlineName = this.flightUtils.toAirlineNameByCode(this.requestBookingCurrent.airlineCode);
              this.requestBookingCurrent.tripItineraryDeparture = `${this.flightUtils.toNameAirportByCode(this.airports, this.requestBookingCurrent.startPoint)} - ${this.flightUtils.toNameAirportByCode(this.airports, this.requestBookingCurrent.endPoint)}`;
              return resolve(true);
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Lấy thông lượt đặt vé theo yêu cầu không thành công');
              }
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Lấy thông lượt đặt vé theo yêu cầu thất bại do lỗi hệ thống');
          },
          complete: () => {
          }
        }
      ).add(() => {
      });
    });

  }

  reserveSeateRequestBookingById(id: number) {
    return new Promise((resolve, reject) => {
      if (this.requestBookingCurrent.status == this.BookingRequestStatusEnum.ReserveSeat || this.requestBookingCurrent.status == this.BookingRequestStatusEnum.AdjustTicket) {
        this.generalService.updateStatusRequestBooking(id, this.BookingRequestStatusEnum.ReceivedTicket).subscribe(
          {
            next: (res: any) => {
              if (res.isValid) {
                this.notificationService.showNotification(Constant.SUCCESS, `Đã giữ vé thành công!`);
                this.isReservedSuccess = true;
                this.successMessenger = `Mã đặt vé : ${this.requestBookingCurrent.bookingCode} đã được lưu lại trên hệ thống!`;
                resolve(true);
              } else {
                if (res.errors && res.errors.length > 0) {
                  res.errors.forEach((el: any) => {
                    this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                    this.errorMessenger = "Giữ vé không thành công. Vui lòng kiểm tra lại thông tin."
                    this.isReservedSuccess = false;
                  });
                } else {
                  this.notificationService.showNotification(Constant.ERROR, 'Giữ vé không thành công.');
                  this.errorMessenger = "Giữ vé không thành công. Vui lòng kiểm tra lại thông tin."
                  this.isReservedSuccess = false;
                }
              }
            },
            error: (err: any) => {
              this.notificationService.showNotification(Constant.ERROR, 'Giữ vé thất bại do lỗi hệ thống');
              this.errorMessenger = "Giữ vé không thành công. Vui lòng kiểm tra lại đường truyền internet."
              this.isReservedSuccess = false;
            },
            complete: () => {
            }
          }
        ).add(() => {
        });
      } else if (this.requestBookingCurrent.status == this.BookingRequestStatusEnum.ReceivedTicket) {
        this.notificationService.showNotification(Constant.SUCCESS, `Vé ${this.requestBookingCurrent.bookingCode} đã được xác nhận trước đó.`);
        this.successMessenger = `Vé ${this.requestBookingCurrent.bookingCode} đã được xác nhận trước đó!`;
        this.isReservedSuccess = true;
      } else {
        this.notificationService.showNotification(Constant.ERROR, 'Không thể xác nhận giữ vé');
        this.errorMessenger = `Không thể xác nhận giữ vé. Vui lòng kiểm tra lại thông tin.`
        this.isReservedSuccess = false;
      }
    });

  }

  sendEmailToAdminVHLNotifyFlightTicketConfirmed() {
    this.generalService.sendEmailToAdminVHLNotifyFlightTicketConfirmed(this.requestBookingId).subscribe(
      {
        next: (res: any) => {
          if (res.isValid) {

          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Gửi mail thông báo người dùng đã xác nhận giữ vé cho admin Cao Nguyên Viên không thành công');
            }
          }
        },
        error: (err: any) => {
          this.notificationService.showNotification(Constant.ERROR, 'Gửi mail thông báo người dùng đã xác nhận giữ vé cho admin Cao Nguyên Viên thất bại do lỗi hệ thống');
        },
        complete: () => {
        }
      }
    ).add(() => {
    });
  }
}
