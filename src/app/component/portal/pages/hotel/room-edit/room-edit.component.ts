import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Constant} from '../../../../../shared/constants/constant.class';
import {ActivatedRoute, Router} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NotificationService} from '../../../../../service/notification.service';
import {GeneralService} from '../../../../../service/general-service';
import {ActionsSubject} from '@ngrx/store';
import {AppConfigService} from '../../../../../../app-config.service';
import {DateFormatPipe} from '../../../../../shared/pipe/format-date.pipe';
import {NzImageService} from 'ng-zorro-antd/image';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DataService} from '../../../../../service/data.service';
import {PhoneUtils} from '../../../../../shared/utils/phone-utils.class';
import {AreaUtils} from '../../../../../shared/utils/area-utils.class';
import {forkJoin} from 'rxjs';
import {NzUploadChangeParam, NzUploadFile} from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.scss']
})
export class RoomEditComponent implements OnInit {
  formAddRoom: FormGroup;
  uploadHeader: any;
  uploadUrl: any;
  editTitle: any;
  submitted = false;
  utilityGroupOptions: any[];
  hotelId: any;
  roomId: any;
  hotelItem: any;
  roomItem: any;
  isEdit = false;
  fileList: any[];
  roomFileIds: any[];
  filterFromDate: string | null = null;
  filterToDate: string | null = null;
  filteredPrices: any[] = [];
  statusPriceDetail: any[] = [];
  @ViewChild('myForm') myForm!: NgForm;
  isActiveChanged: any;
  isAvailableChanged: any;
  amenityCheckAll = false;
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
    public phoneUtils: PhoneUtils,
    public areaUtils: AreaUtils,
    private route: ActivatedRoute,
  ) {
    this.formAddRoom = this.fb.group({
      id: [null],
      hotelId: [null],
      code: [{ value: '', disabled: true }],
      name: [null, [Validators.required]],
      numberOfPeople: [0, [Validators.required]],
      childNumber: [0],
      bedType: [null],
      roomArea: [null],
      description: [null],
      roomNumber: [0],
      floorNumber: [0],
      costPrice: [null, [Validators.required]],
      price: [null],
      extraBed: [0],
      extraBedPrice: [null],
      adultSurcharge: [null],
      childSurcharge: [null],
      roomFiles: [[]],
      roomFileIds: [[]],
      prices: [[]],
      amenities: [[]],
      priceByTime: [false],
      amenityCheckAll: [false]
    });
    this.uploadHeader = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    };
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload`;
    this.editTitle = 'Thêm mới loại phòng';
    this.roomFileIds = [];
    this.statusPriceDetail = [
      { name: 'Kích hoạt', value: true },
      { name: 'Vô hiệu hoá', value: false },
    ];
    this.roomItem = {
      isActive: true
    };
  }

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId');
    this.roomId = this.route.snapshot.paramMap.get('id');
    console.log(this.hotelId, this.roomId);
    forkJoin([
      this.generalService.getListUtilityRoom(),
      this.generalService.getHotelById(this.hotelId)
    ]).subscribe(([resUtility, hotelItem]) => {
      console.log(resUtility.data);
      this.hotelItem = hotelItem;
      this.utilityGroupOptions = resUtility.data.map(en => {
        return {label: en.name, value: en.id, checked: false};
      });
      if (this.roomId) {
        this.isEdit = true;
        this.binRoomDetail();
      } else {
        this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadRoomImage?roomId=0`;
        this.formAddRoom.patchValue({
          amenities: this.utilityGroupOptions
        });
      }

    });

    this.formAddRoom.controls.costPrice.valueChanges.subscribe(($event) => {
      console.log($event);
      if ($event && !isNaN($event)) {
        this.formAddRoom.patchValue({
          price: parseFloat($event) * 1.06
        });
      }
    });

    this.formAddRoom.get('amenities')?.valueChanges.subscribe(value => {
      this.amenityCheckAll = !this.utilityGroupOptions.map(en => en.checked).includes(false);
      this.formAddRoom.patchValue({
        amenityCheckAll: this.amenityCheckAll
      });
    });
  }

  binRoomDetail() {
    this.editTitle = 'Sửa thông tin phòng';
    this.generalService.getRoomById(this.roomId).subscribe(res => {
      this.roomItem = res;
      this.submitted = false;
      const item = res;
      this.formAddRoom.patchValue({
        id: item.id,
        hotelId: this.hotelId,
        name: item.name,
        code: item.code,
        numberOfPeople: item.numberOfPeople,
        roomArea: item.roomArea,
        description: item.description,
        roomNumber: item.roomNumber,
        floorNumber: 0,
        price: item.price,
        costPrice: item.costPrice,
        bedType: item.bedType,
        extraBed: item.extraBed,
        extraBedPrice: item.extraBedPrice,
        adultSurcharge: item.adultSurcharge,
        childSurcharge: item.childSurcharge,
        roomFiles: item.roomFiles,
        roomFileIds: [],
        prices: item.prices,
        priceByTime: item.priceByTime
      });
      this.filterPrices();
      this.fileList = [];
      if (item.roomFiles) {
        for (const room of item.roomFiles) {
          const objRoom = {
            uid: room.id.toString(),
            name: room.fileName,
            url: `${this.configService.getConfig().api.baseUrl}/${room.filePath}`,
          };
          this.fileList.push(objRoom);
        }
      }
      console.log(this.fileList);

      // bind utlities
      const utilityRoomIds = item.utilityRooms.map(en => en.id);
      this.utilityGroupOptions.forEach(en => {
        en.checked = utilityRoomIds.includes(en.value);
      });
      this.formAddRoom.patchValue({
        amenities: this.utilityGroupOptions
      });
      this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadRoomImage?roomId=${this.roomId}`;
    });
  }

  handleCancel() {
    this.formAddRoom.reset();
  }

  goHotelDetail() {
    this.router.navigate(['hotel/edit-hotel', this.hotelId]);
  }

  get formControlRoom() {
    return this.formAddRoom.controls;
  }

  triggerSubmit() {
    if (this.myForm) {
      this.myForm.ngSubmit.emit();  // Gọi sự kiện submit của form
    }
  }

  saveRoom() {
    this.submitted = true;
    const formValue = this.formAddRoom.value;

    if (this.formAddRoom.invalid) {
        this.notificationService.showNotification(Constant.ERROR, 'Tồn tại thông tin khách sạn chưa điền!');
        return;
    }

    const utilitieIds = this.formAddRoom.value.amenities.filter(en => en.checked).map(en => en.value);
    formValue.utilitieIds = utilitieIds;

    formValue.shortDescription = this.hotelItem.shortDescription;
    formValue.description = this.hotelItem.description;

    formValue.isActive = this.isActiveChanged ?? this.roomItem?.isActive ?? false;
    formValue.isAvailable = this.isAvailableChanged ?? this.roomItem?.isAvailable ?? false;

    console.log(this.formAddRoom.value);

    if (formValue.id === 0 || formValue.id === undefined || formValue.id === null) {
        delete formValue.id;
        delete formValue.amenities;
        formValue.hotelId = this.hotelId;
        formValue.roomFileIds = this.roomFileIds;

        this.generalService.addRoom(formValue).subscribe((res: any) => {
            if (res.ret && res.ret[0].code !== 0) {
                this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
            } else {
                // this.getListData();
                this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
                this.roomId = res.jsonData;
                this.router.navigate(['hotel/edit-room', this.hotelId, this.roomId]);
            }
        }, (error: any) => {
        });
    } else {
        // / update
        delete formValue.amenities;
        this.generalService.updateRoomByID(formValue.id, formValue).subscribe((res: any) => {
            if (res.ret && res.ret[0].code !== 0) {
                this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
            } else {
                // this.getListData();
                // this.router.navigate(['hotel']);
                this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
            }
        }, error => {
        });
    }
}

  handleChangeImages({file, fileList}: NzUploadChangeParam, form: any): void {
    const status = file.status;
    if (status === 'done') {
      this.msg.success(`file ${file.name} tải lên thành công.`);
      if (form === 'room') {
        alert('vao day');
        this.fileList = fileList;
        setTimeout(() => {
          if (this.fileList.length > 0) {
            this.fileList[this.fileList.length - 1].uid = file.response.roomFileId.toString();
            this.fileList[this.fileList.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${file.response.path1}`;
          }
        }, 0);
        this.roomFileIds.push(file.response.roomFileId);
        console.log(this.roomFileIds);
      }
    } else if (status === 'error') {
      this.msg.error(`file ${file.name} tải lên không thành công. ${file.error.error.text}`);
    }
  }


  handleRemoveImageRoom = async (file: NzUploadFile): Promise<void> => {
    const roomImageId = file.uid;
    if (roomImageId) {
      this.generalService.deleteRoomImageByID(roomImageId).subscribe(
        {
          next: (res) => {
            if (res) {
              if (res.ret && res.ret.length > 0) {
                res.ret.forEach((el: any) => {
                  if (el.code === 0) {
                    this.msg.success(`Đã xoá ảnh ${file.name}.`);
                    // this.getListData();
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
      );
    }
  }
  onInitNewRowPriceDetail(event: any) {
  }

  onRowInsertingPriceDetail(event: any, roomId: any) {
    if (!this.isEdit) {
      return;
    }
    const newData = event.data === null ? event : event.data;
    const newPriceDetail = {
      id: 0,
      roomId,
      title: newData.title,
      price: newData.price,
      fromDate: newData.fromDate,
      toDate: newData.toDate,
      isUse: true
    }
    this.generalService.createRoomPriceDetail(newPriceDetail).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notificationService.showNotification(Constant.SUCCESS, 'Tạo giá phòng thành công');
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((error: any) => {
              this.notificationService.showNotification(Constant.ERROR, error.errorMessage);
            });
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Tạo giá phòng thật bại');
          }
        }
      },

      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Dữ liệu trả về đã gặp lỗi');
      },

      complete: () => {
      }
    }).add(() => {
      this.binRoomDetail();
    });
  }

  onRowInsertedPriceDetail(event: any) {
  }

  onRowUpdatingPriceDetail(event: any) {
    if (!this.isEdit) {
      return;
    }
    const oldData = event.oldData;
    const newData = event.newData;
    const updateData = {};
    Object.assign(updateData, oldData, newData);
    this.generalService.updateRoomPriceDetailByID(updateData).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật giá phòng thành công');
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((error: any) => {
              this.notificationService.showNotification(Constant.ERROR, error.errorMessage);
            });
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Cập nhật giá phòng thật bại');
          }
        }
      },

      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Cập nhật giá phòng đã gặp lỗi');
      },

      complete: () => {

      }
    }).add(() => this.binRoomDetail());
  }

  onRowUpdatedPriceDetail(event: any) {
    const newPriceDetail = {

    };
  }
  logEvent(eventName: any) {
    // this.events.unshift(eventName);
  }
  onSavingPriceDetail(event: any) {
  }

  filterPrices(): void {
    const fromDate = this.filterFromDate ? new Date(this.filterFromDate) : null;
    const toDate = this.filterToDate ? new Date(this.filterToDate) : null;

    this.filteredPrices = this.formAddRoom.value.prices.filter(price => {
      const priceFromDate = new Date(price.fromDate);
      const priceToDate = new Date(price.toDate);

      const isAfterFromDate = fromDate ? priceFromDate >= fromDate : true;
      const isBeforeToDate = toDate ? priceToDate <= toDate : true;

      return isAfterFromDate && isBeforeToDate;
    });
}
  setActive(data: any) {
    data.isActive = !data.isActive;
    this.isActiveChanged = data.isActive;
    this.generalService.setActiveRoom({roomId: data.id, isActive: data.isActive}).subscribe(
      {
        next: (res) => {
          if (res.ret && res.ret[0].code !== 0) {

            this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
          } else {
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
  clickSwitchIsAvaliable(isAvaliableUpdate: boolean, roomID: any): void {
    const newIsAvailable = !isAvaliableUpdate;
    this.isAvailableChanged = newIsAvailable;
    this.generalService.SetAvailableRoom({ roomId: roomID, isAvailable: newIsAvailable }).subscribe(
        {
            next: (res) => {
                if (res.ret && res.ret[0].code !== 0) {
                    this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
                } else {
                    this.roomItem.isAvailable = newIsAvailable;
                    this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật trạng thái phòng thành công');
                }
            },
            error: (error) => {
                this.notificationService.showNotification(Constant.ERROR, 'Cập nhật trạng thái phòng thất bại');
            },
            complete: () => {}
        }
    );
  }
  onUserInteraction($event: Event) {
    this.utilityGroupOptions.filter(en => {
      en.checked = this.formAddRoom.get('amenityCheckAll')?.value;
    });
    this.formAddRoom.patchValue({
      amenities: this.utilityGroupOptions
    });
  }
}
