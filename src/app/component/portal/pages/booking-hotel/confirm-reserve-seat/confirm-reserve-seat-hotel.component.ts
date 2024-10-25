import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AirlineTicketBookingRequestStatus } from 'src/app/enums/airline-ticket-booking-request-status.enum';
import { GeneralService } from 'src/app/service/general-service';
import { NotificationService } from 'src/app/service/notification.service';
import { Constant } from 'src/app/shared/constants/constant.class';
import { FlightUtils } from 'src/app/shared/utils/flight-utils.class';
import { MenuStateService } from 'src/app/shared/app-state/menu-state.service';
import { HotelBookingStatusEnum } from 'src/app/enums/hotel-booking-status.enum';

@Component({
  selector: 'confirm-reserve-seat',
  templateUrl: './confirm-reserve-seat-hotel.component.html',
  styleUrls: ['./confirm-reserve-seat-hotel.component.scss']
})
export class ConfirmReserveSeatHotelComponent implements OnInit {

  hotelBookingId: number = null;
  hotelBookingCurrent: any;
  isReservedSuccess: boolean = null;
  BookingHotelStatusEnum = HotelBookingStatusEnum
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
    this.hotelBookingId = +url.searchParams.get('hotel-booking-id');


    this.getHotelBookingByID().then((r) => {
      this.reserveSeateHotelBookingById(this.hotelBookingId).then((r) => {
        this.sendEmailToAdminVHLNotifyBookingHotelConfirmed();
      });
    });

  }


  ngAfterViewChecked() {

  }

  getHotelBookingByID() {
    return new Promise((resolve, reject) => {
      this.generalService.getBookingHotelById(this.hotelBookingId).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              this.hotelBookingCurrent = res.data;
              return resolve(true);
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Lấy thông lượt đặt phòng khách sạn theo yêu cầu không thành công');
              }
            }
          },
          error: (err: any) => {
            this.notificationService.showNotification(Constant.ERROR, 'Lấy thông lượt đặt phòng khách sạn theo yêu cầu thất bại do lỗi hệ thống');
          },
          complete: () => {
          }
        }
      ).add(() => {
      });
    });

  }

  reserveSeateHotelBookingById(id: number) {
    return new Promise((resolve, reject) => {
      if (this.hotelBookingCurrent.bookingStatus == this.BookingHotelStatusEnum.Holding) {
        this.generalService.reserveSeateHotelBookingById({
          "bookingHotelId": id,
          "status": this.BookingHotelStatusEnum.Confirmed
        }).subscribe(
          {
            next: (res: any) => {
              if (res.isValid) {
                // this.notificationService.showNotification(Constant.SUCCESS, `Đã giữ phòng khách sạn thành công!`);
                this.isReservedSuccess = true;
                this.successMessenger = `Thông tin đặt dịch vụ của bạn đã được ghi nhận, VHL sẽ liên hệ đến bạn sớm nhất!`;
                resolve(true);
              } else {
                if (res.errors && res.errors.length > 0) {
                  res.errors.forEach((el: any) => {
                    this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                    this.errorMessenger = "Giữ phòng khách sạn không thành công. Vui lòng kiểm tra lại thông tin."
                    this.isReservedSuccess = false;
                  });
                } else {
                  this.notificationService.showNotification(Constant.ERROR, 'Giữ phòng khách sạn không thành công.');
                  this.errorMessenger = "Giữ phòng khách sạn không thành công. Vui lòng kiểm tra lại thông tin."
                  this.isReservedSuccess = false;
                }
              }
            },
            error: (err: any) => {
              this.notificationService.showNotification(Constant.ERROR, 'Giữ phòng khách sạn thất bại do lỗi hệ thống');
              this.errorMessenger = "Giữ phòng khách sạn không thành công. Vui lòng kiểm tra lại đường truyền internet."
              this.isReservedSuccess = false;
            },
            complete: () => {
            }
          }
        ).add(() => {
        });
      } else if (this.hotelBookingCurrent.bookingStatus == this.BookingHotelStatusEnum.Confirmed ||
        this.hotelBookingCurrent.bookingStatus == this.BookingHotelStatusEnum.Successful
      ) {
        // this.notificationService.showNotification(Constant.SUCCESS, `Phòng khách sạn ${this.hotelBookingCurrent.bookingCode} đã được xác nhận trước đó.`);
        this.successMessenger = `Yêu cầu đã được anh/chị xác nhận trước đó. Vui lòng thử lại sau!`;
        this.isReservedSuccess = true;
      } else if (this.hotelBookingCurrent.bookingStatus == this.BookingHotelStatusEnum.Failure){
        // this.notificationService.showNotification(Constant.ERROR, 'Không thể xác nhận giữ phòng khách sạn');
        this.errorMessenger = `Yêu cầu đã được anh/chị hết hiệu lực. Vui lòng thử lại sau!`

        this.isReservedSuccess = false;
      }
      else {
        // this.notificationService.showNotification(Constant.ERROR, 'Không thể xác nhận giữ phòng khách sạn');
        this.errorMessenger = `Không thể xác nhận giữ phòng khách sạn. Vui lòng kiểm tra lại thông tin.`
        this.isReservedSuccess = false;
      }
    });

  }


  sendEmailToAdminVHLNotifyBookingHotelConfirmed() {
    this.generalService.sendEmailToAdminVHLNotifyHotelBookingConfirmed(this.hotelBookingId).subscribe(
      {
        next: (res: any) => {
          if (res.isValid) {

          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Gửi mail thông báo người dùng đã xác nhận đặt phòng cho admin Cao Nguyên Viên không thành công');
            }
          }
        },
        error: (err: any) => {
          this.notificationService.showNotification(Constant.ERROR, 'Gửi mail thông báo người dùng đã xác nhận đặt phòng cho admin Cao Nguyên Viên thất bại do lỗi hệ thống');
        },
        complete: () => {
        }
      }
    ).add(() => {
    });
  }
}
