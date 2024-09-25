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
@Component({
  selector: 'app-data-statistics',
  templateUrl: './data-statistics.component.html',
  styleUrls: ['./data-statistics.component.scss']
})
export class DataStatisticsComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  @ViewChild("DataStatistics") dataGridDetail: DxDataGridComponent;
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
  isVisibleConfirm: boolean = false;
  isConfirmLoading: boolean = false;
  textValueNoteConfirm = '';

  textValueNoteRefuse = '';
  isVisibleRefuse: boolean = false;
  isRefuseLoading: boolean = false;

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
            let sttx = 0;
            en.bookingHotelDetails.forEach(element => {
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
    this.isVisibleConfirm = true;
  }


  onRefuseBookingHotel(booking: any) {
    this.item = booking;
    this.isVisibleRefuse = true;
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
    this.isVisibleConfirm = false;
    this.isVisibleRefuse = false;
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
    const worksheet = workbook.addWorksheet('Thông kê dữ liệu');

    const from = this.dateFormatPipe.transformFull(new Date(), Constant.DATE_FMT_STR);
    const dateStr = from;
    const fileName = `Thong_ke_du_lieu_${dateStr}`;
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
      headerRowTitle.getCell(1).value = 'BẢNG KÊ CHI TIẾT VÉ MÁY BAY';
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
      headerClientNameValue.getCell(3).value = 'CÔNG TY TNHH Y TẾ VIỆT TIẾN';
      headerClientNameValue.getCell(3).font = { name: 'Times New Roman', size: 11, bold: true };
      headerClientNameValue.getCell(3).alignment = { horizontal: 'left', }

      // Địa chỉ khách hàng
      const headerClientAdressTitle = worksheet.getRow(10);
      headerClientAdressTitle.getCell(2).value = 'Địa chỉ:';
      headerClientAdressTitle.getCell(2).font = { name: 'Times New Roman', size: 11 };
      headerClientAdressTitle.getCell(2).alignment = { horizontal: 'left' }

      const headerClientAdressValue = worksheet.getRow(10);
      headerClientAdressValue.getCell(3).value = '6/1 Đường số 6, Phường 15, Quận Gò Vấp, TP.HCM';
      headerClientAdressValue.getCell(3).font = { name: 'Times New Roman', size: 11 };
      headerClientAdressValue.getCell(3).alignment = { horizontal: 'left', }

      // Mã số thuế khách hàng
      const headerClientMSTTitle = worksheet.getRow(11);
      headerClientMSTTitle.getCell(2).value = 'MST:';
      headerClientMSTTitle.getCell(2).font = { name: 'Times New Roman', size: 11 };
      headerClientMSTTitle.getCell(2).alignment = { horizontal: 'left' }

      const headerClientMSTValue = worksheet.getRow(11);
      headerClientMSTValue.getCell(3).value = '0 3 0 1 4 4 5 7 3 2';
      headerClientMSTValue.getCell(3).font = { name: 'Times New Roman', size: 11, bold: true };
      headerClientMSTValue.getCell(3).alignment = { horizontal: 'left', }

      // footer
      const footerRowIndex = cellRange.to.row + 2;
      const footerRow = worksheet.getRow(footerRowIndex);
      worksheet.mergeCells(footerRowIndex, 1, footerRowIndex, 8);

      footerRow.getCell(1).value = 'www.wikipedia.org';
      footerRow.getCell(1).font = { color: { argb: 'BFBFBF' }, italic: true };
      footerRow.getCell(1).alignment = { horizontal: 'right' };
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
    this.isConfirmLoading = true;
    this.generalService
      .confirmBooking({ id: this.item.id, note: this.textValueNoteConfirm })
      .subscribe({
        next: (res) => {
          if (res.isValid) {
            this.notificationService.showNotification(Constant.SUCCESS, 'Xác nhận đặt phòng thành công');
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, 'Xác nhận đặt phòng thật bại');
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Xác nhận đặt phòng thật bại');
            }
          }
        },
      })
      .add(() => {
        this.isConfirmLoading = false;
        this.isVisibleConfirm = false;
        this.getListData();

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
        this.isVisibleRefuse = false;
        this.getListData();
      });
  }
}
