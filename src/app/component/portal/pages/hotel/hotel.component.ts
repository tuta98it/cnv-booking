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
} from 'devextreme-angular';
import { IsEmptyPipe } from 'src/app/shared/pipe/is-empty.pipe';
import { filter } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { StringUtils } from 'src/app/shared/utils/string-utils.class';
// @ts-ignore
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { PhoneUtils } from 'src/app/shared/utils/phone-utils.class';
import { AreaUtils } from 'src/app/shared/utils/area-utils.class';
import { PipeUtils } from 'src/app/shared/utils/pipe-utils.class';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})
export class HotelComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  @ViewChild('ListHotels') dataGridDetail: DxDataGridComponent;
  datas: any[] = [];
  listPriceRoomDetail: any[] = [];
  statusPriceDetail: any[] = [];
  data: any;
  listUtilityHotel = [];
  listUtilityRoom = [];
  passwordVisible: boolean;
  repeatpasswordVisible: boolean;
  isVisibleAddHotel: boolean;
  isVisibleAddRoom: boolean;
  isVisibleUpdate: boolean;
  isVisiblePassword: boolean;
  item: any;
  loading: boolean;
  checkDelete = true;
  submitted = false;
  updated: boolean;
  formAddHotel: FormGroup;
  formAddRoom: FormGroup;
  filteredDatas: any[] = [];
  searchText = '';
  titleFormHotel = '';
  titleFormRoom = '';
  isVisibleDetailUtility: boolean = false;
  listDetailUtility: any[];
  uploadHeader: any;
  uploadUrl = '';
  fileList: NzUploadFile[] = [];
  listURLFiles: any[] = [];
  configDescriptionHotel: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
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
  loadingActiveHotel: boolean = false;
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
      numberOfPeople: [null],
      roomArea: [null],
      description: [null],
      roomNumber: [0],
      floorNumber: [0],
      price: [null, [Validators.required]],
      extraBed: [null, [Validators.required]],
      extraBedPrice: [null, [Validators.required]],
      adultSurcharge: [null],
      childSurcharge: [null],
      roomFiles: [[]],
      roomFileIds: [[]],
      prices: [[]],
      utilitieIds: [null, [Validators.required]],
    });

    this.uploadHeader = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    };

    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload`;

    this.statusPriceDetail = [
      { name: 'Kích hoạt', value: true },
      { name: 'Vô hiệu hoá', value: false },
    ]
  }

  ngOnInit(): void {
    this.getListUtilityHotels();
    this.getListUtilityRooms();
    this.getListData();
  }

  ngOnDestroy(): void {

  }

  getListData() {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.generalService.getHotels().subscribe(
        {
          next: (res) => {
            this.datas = res;
            let stt = 0;
            this.datas.forEach((en: any) => {
              en.stt = ++stt;
              en.loadingActiveHotel = false;
              let sttx = 0;
              en.roomHotels.forEach((roomHotel: any) => {
                roomHotel.stt = ++sttx;
                let sttp = 0;
                roomHotel.prices.forEach((priceCustom: any) => {
                  priceCustom.stt = ++sttp;
                });
              });
            });
            this.filteredDatas = this.datas;
          },

          error: (error) => {

          },

          complete: () => {
            resolve(true);
          }

        }).add(() => {
          this.loading = false;
        });
    });


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

  validateEmail(mail: any) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) || !mail) {
      return (true);
    }
    alert('Chưa đúng định dạng email!');
    return (false);
  }

  get formControlHotel() {
    return this.formAddHotel.controls;
  }

  get formControlRoom() {
    return this.formAddRoom.controls;
  }


  showConfirmDeleteHotel(id: any): void {
    this.modalService.confirm({
      nzTitle: 'Bạn có chắc muốn xóa khách sạn này?',
      nzContent: '<b style="color: red;">khách sạn sẽ không thể hoàn tác sau khi xoá. Ấn đồng ý để xoá</b>',
      nzOkDanger: true,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOnOk: () => this.deleteItemHotelByID(id).then(() => this.getListData()),
    });
  }

  showConfirmDeleteRoom(id: any): void {
    this.modalService.confirm({
      nzTitle: 'Bạn có chắc muốn xóa phòng này?',
      nzContent: '<b style="color: red;">Phòng sẽ không thể hoàn tác sau khi xoá. Ấn đồng ý để xoá</b>',
      nzOkDanger: true,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOnOk: () => this.deleteItemRoomByID(id).then(() => this.getListData()),
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

  deleteItemRoomByID(id: any) {
    // Delete workspace here
    return new Promise((resolve, reject) => {
      this.generalService.deleteRoomByID(id).subscribe((res: any) => {
        // Do some logic and close the popup
        if (res && res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, 'Không thể xóa phòng');
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, 'Xóa phòng thành công');
          resolve(true);
        }
      }, error => {
        // Error handling and close the popup
        this.notificationService.showNotification(Constant.ERROR, 'Đã có lỗi xảy ra khi xoá phòng!');
      });
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
      };
      this.fileList.push(objHotel);
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
    this.isVisibleDetailUtility = false;
    this.formAddHotel.reset();
    this.formAddRoom.reset();
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
    );
  };

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
  };

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

    if (formValue.id == 0 || formValue.id == null || formValue.id == undefined) {
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

      });
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
    const fileName = `DS_Khach_san_${dateStr}`;
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
      removeAccents((en.name?? "").toString()).trim().toLowerCase().includes(keyword) ||
      removeAccents(en.address?? "").trim().toLowerCase().includes(keyword) ||
      removeAccents(en.phoneNo?? "").trim().toLowerCase().includes(keyword) ||
      removeAccents(en.websiteUrl?? "").trim().toLowerCase().includes(keyword) ||
      removeAccents(en.contactEmail?? "").trim().toLowerCase().includes(keyword) ||
      removeAccents(en.facebook?? "").trim().toLowerCase().includes(keyword) ||
      removeAccents((en.ratingStar?? "").toString()).trim().toLowerCase().includes(keyword) ||
      removeAccents(en.province?.name?? "").trim().toLowerCase().includes(keyword) ||
      removeAccents(en.district?.name?? "").trim().toLowerCase().includes(keyword)
    );
  }


  previewDetailUtilityHotels(utilityHotels: any) {
    this.isVisibleDetailUtility = true;
    this.listDetailUtility = utilityHotels;
    let stt = 0;
    this.listDetailUtility.forEach(en => {
      en.stt = ++stt;
    });
  }

  previewDetailUtilityRooms(utilityRooms: any) {
    this.isVisibleDetailUtility = true;
    this.listDetailUtility = utilityRooms;
    let stt = 0;
    this.listDetailUtility.forEach(en => {
      en.stt = ++stt;
    });
  }

  showModalAddRoom(idHotel: any) {
    this.isVisibleAddRoom = true;
    this.submitted = false;
    this.titleFormRoom = 'Thêm mới phòng';
    this.updated = false;
    this.formAddRoom.reset();
    this.formAddRoom.patchValue({
      id: 0,
      name: '',
      numberOfPeople: '',
      roomArea: '',
      description: '',
      hotelId: idHotel,
      hotelName: '',
      roomNumber: 0,
      floorNumber: 0,
      price: '',
      extraBed: 1,
      extraBedPrice: '',
      adultSurcharge: '',
      childSurcharge: '',
      prices: [],
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
      numberOfPeople: this.item.numberOfPeople,
      roomArea: this.item.roomArea,
      description: this.item.description,
      roomNumber: 0,
      floorNumber: 0,
      price: this.item.price,
      extraBed: this.item.extraBed,
      extraBedPrice: this.item.extraBedPrice,
      adultSurcharge: this.item.adultSurcharge,
      childSurcharge: this.item.childSurcharge,
      roomFiles: this.item.roomFiles,
      roomFileIds: [],
      prices: this.item.prices,
      utilitieIds: this.getIDUtilityRooms(this.item.utilityRooms),
    });

    this.fileList = [];
    for (const room of this.item.roomFiles) {
      const objRoom = {
        uid: room.id.toString(),
        name: room.fileName,
        url: `${this.configService.getConfig().api.baseUrl}/${room.filePath}`,
      };
      this.fileList.push(objRoom);
    }
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadRoomImage?roomId=${this.item.id}`;
  }

  saveRoom() {
    this.submitted = true;
    const formValue = this.formAddRoom.value;
    if (this.formAddRoom.invalid) {
      this.notificationService.showNotification(Constant.ERROR, 'Tồn tại thông tin khách sạn chưa điền!');
      return;
    }

    // const idsUtilityRooms = formValue.utilityRooms;
    // Sử dụng phương thức filter để lọc các phần tử có id trong danh sách idsUtilityRooms
    // formValue.utilityRooms = this.listUtilityRoom.filter(utilityRoom => idsUtilityRooms.includes(utilityRoom.id));

    if (formValue.id === 0 || formValue.id == null || formValue.id == undefined) {
      this.addNewRoom(formValue);
    } else {
      this.updateRoom(formValue);
    }
  }

  private addNewRoom(roomNew: any) {
    // add
    delete roomNew.id;
    delete roomNew.roomFiles;
    roomNew.prices.forEach((price: any) => {
      delete price.id;
    });


    this.generalService.addRoom(roomNew).subscribe(
      {
        next: (res: any) => {
          if (res.ret && res.ret[0].code !== 0) {
            this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
          } else {
            this.getListData();
            this.isVisibleAddRoom = false;
            this.notificationService.showNotification(Constant.SUCCESS, `Thêm mới phòng thành công`);
          }
        },
        error: (error: any) => {
          this.notificationService.showNotification(Constant.ERROR, `Đã có lỗi khi thêm mới phòng`);
        },
        complete: () => {

        }
      });
  }

  private updateRoom(roomUpdate: any) {
    // / update
    delete roomUpdate.roomFiles;
    delete roomUpdate.roomFileIds;
    delete roomUpdate.prices;
    this.generalService.updateRoomByID(roomUpdate.id, roomUpdate).subscribe((res: any) => {
      if (res.ret && res.ret[0].code !== 0) {
        this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
      } else {
        this.getListData();
        this.isVisibleAddRoom = false;
        this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
      }
    }, error => {

    });
  }



  previewImages(images: any) {
    let arrImage: any[] = [];
    if (typeof images === 'string') {
      let objImage = {
        src: images,
        width: '50%',
        height: '50%',
        alt: 'Ảnh trực quan'
      };
      arrImage.push(objImage);
    } else {
      images.forEach((objImage: any) => {
        const objImageView = {
          src: `${this.configService.getConfig().api.baseUrl}/${objImage.filePath}`,
          width: '50%',
          height: '50%',
          alt: 'Ảnh trực quan'
        };
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

  logEvent(eventName: any) {
    // this.events.unshift(eventName);
  }

  onInitNewRowPriceDetail(event: any) {
  }

  onRowInsertingPriceDetail(event: any, roomId: any) {

    if (!this.updated) {
      return;
    }
    let newData = event.data === null ? event : event.data;
    let newPriceDetail = {
      id: 0,
      roomId: roomId,
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
      this.getListData().then((r) => {
        if (this.item) {
          let findHotel = this.filteredDatas.find((objHotel: any) => objHotel.id === this.item.hotelId);
          if (findHotel) {
            let findRoom = findHotel.roomHotels.find((objRoom: any) => objRoom.id === this.item.id);
            if (findRoom) {
              this.item = findRoom;
            }
          }
        }

        this.formAddRoom.patchValue({
          id: this.item.id,
          hotelId: this.item.hotelId,
          name: this.item.name,
          numberOfPeople: this.item.numberOfPeople,
          roomArea: this.item.roomArea,
          description: this.item.description,
          roomNumber: 0,
          floorNumber: 0,
          price: this.item.price,
          extraBed: this.item.extraBed,
          extraBedPrice: this.item.extraBedPrice,
          adultSurcharge: this.item.adultSurcharge,
          childSurcharge: this.item.childSurcharge,
          roomFiles: this.item.roomFiles,
          roomFileIds: [],
          prices: this.item.prices,
          utilitieIds: this.getIDUtilityRooms(this.item.utilityRooms),
        });
      });
    });
  }

  onRowInsertedPriceDetail(event: any) {
  }

  onRowUpdatingPriceDetail(event: any) {
    if (!this.updated) {
      return;
    }
    let oldData = event.oldData;
    let newData = event.newData;
    let updateData = {};

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
    }).add(() => this.getListData());;
  }

  onRowUpdatedPriceDetail(event: any) {
    let newPriceDetail = {

    }
  }

  onRowRemovingdPriceDetail(event: any) {
    if (!this.updated) {
      return;
    }
    let idRecordPriceDetail = event.data.id;
    this.generalService.removeRoomPriceDetail(idRecordPriceDetail).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notificationService.showNotification(Constant.SUCCESS, 'Xoá giá phòng thành công');
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((error: any) => {
              this.notificationService.showNotification(Constant.ERROR, error.errorMessage);
            });
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Xoá giá phòng thật bại');
          }
        }
      },

      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Xoá giá phòng đã gặp lỗi');
      },

      complete: () => {

      }
    }).add(() => this.getListData());
  }

  onSavingPriceDetail(event: any) {
  }

  phoneNumberFormat(value: any) {
    let phoneNo = value;
    if (value) {
      const USNumber = value.match(/(\d{3})(\d{3})(\d{4})/);
      if (USNumber) {
        phoneNo = `(${USNumber[1]}) ${USNumber[2]}-${USNumber[3]}`;
      }
    }
    return phoneNo;
  }

  formatCurrencyVND(value) {
    if (!value) {
      return '0 đ';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  }

  onChangeActiveHotel(hotel: any) {
    hotel.loadingActiveHotel = true;
    let changeIsActiveHotel = !hotel.isActive;
    this.generalService.setActiveHotel(hotel.id, changeIsActiveHotel).subscribe({
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
        this.getListData().then(() => {
          this.notificationService.showNotification(Constant.SUCCESS, `${changeIsActiveHotel ? 'Active' : 'Inactive'} khách sạn thành công`);
        });
      }
    }).add(() => {
      hotel.loadingActiveHotel = false;
    });
  }
}
