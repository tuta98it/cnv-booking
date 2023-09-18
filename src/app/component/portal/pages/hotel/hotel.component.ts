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

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})
export class HotelComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  @ViewChild("ListHotels") dataGridDetail: DxDataGridComponent;
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
  isVisibleDetailUtility: boolean = false;
  listDetailUtility: any[];
  uploadHeader: any;
  baseImageurl = '';
  uploadUrl = '';
  fileList: NzUploadFile[] = [];

  constructor(
    public translate: TranslateService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private actionsSubject: ActionsSubject,
    private configService: AppConfigService,
    private fb: FormBuilder,
    private dateFormatPipe: DateFormatPipe,
    private nzImageService: NzImageService,
    private msg: NzMessageService
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
      utilityHotels: [null],
      // facebook: [null, [Validators.required]],
      ratingStar: [null, [Validators.required]],
      numRooms: [null, [Validators.required]],
      imageUrl: [null, [Validators.required]],
    });

    this.formAddRoom = this.fb.group({
      id: [null],
      hotelId: [null],
      name: [null, [Validators.required]],
      description: [null],
      roomNumber: [null, [Validators.required]],
      floorNumber: [null,[Validators.required]],
      price: [null, [Validators.required]],
      imageUrl: [null, [Validators.required]],
      utilityRooms: [null],
    });

    this.uploadHeader = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    };

    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload`;
  }

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
    this.generalService.getHotels().subscribe((res: any) => {
      this.datas = res;
      let stt = 0;
      this.datas.forEach((en: any) => {
        en.stt = ++stt;

        let sttx = 0;
        en.roomHotels.forEach((enx: any) => {
          enx.stt = ++sttx;
        });
      });

      this.filteredDatas = this.datas;
    });
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
      nzContent: '<b style="color: red;">khách sạn sẽ thể hoàn tác sau khi xoá. Ấn đồng ý để xoá</b>',
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
      utilityHotels: [],
      // facebook: '',
      ratingStar: '',
      numRooms: '',
      imageUrl: ''
    });
    this.fileList = [];
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload`;
  }

  showModalUpdateHotel(data: any) {
    this.isVisibleAddHotel = true;
    this.submitted = false;
    this.item = data;
    this.titleFormHotel = 'Sủa thông tin khách sạn';
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
      utilityHotels: this.getIDUtilityHotels(this.item.utilityHotels),
      // utilityHotels: this.getUtilityHotels(this.item.utilityHotels),
      // facebook: this.item.facebook,
      ratingStar: this.item.ratingStar,
      numRooms: this.item.numRooms,
      imageUrl: this.item.imageUrl,
    });
    this.fileList = [];

    this.fileList = [
      {
        uid: '1',
        name: StringUtils.getFileNameFromImageURL(this.item.imageUrl),
        status: 'done',
        url: this.item.imageUrl,
      },
    ];
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadHotelImage?hotelId=${this.item.id}`;
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

  saveNewHotel() {
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

    const idsUtilityHotels = formValue.utilityHotels;
    // Sử dụng phương thức filter để lọc các phần tử có id trong danh sách targetIds
    formValue.utilityHotels = this.listUtilityHotel.filter(utilityHotel => idsUtilityHotels.includes(utilityHotel.id));
    console.log('formValue.id: ', formValue.id);
    if (formValue.id === 0) {
      delete formValue.id;
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

  previewImagesHotel(image: any) {
    console.log('image: ', image);
    let arrImage: any[] = [];
    if (typeof image === 'string') {
      let objCurrent = {
        src: image,
        width: '50%',
        height: '50%',
        alt: 'Ảnh trực quan'
      }
      arrImage.push(objCurrent);
    }
    this.nzImageService.preview(arrImage, { nzZoom: 1.5, nzRotate: 0 });
  }

  handleChangeImages(info: NzUploadChangeParam, form: any): void {
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
      this.fileList = [{
        uid: '1',
        name: info.file.name,
        status: 'done',
        url: `${this.configService.getConfig().api.baseUrl}/${info.file.response.path}`,
      },];
      console.log('formType: ', form);

      if(form === 'hotel'){
        this.formAddHotel.controls['imageUrl'].setValue(`${this.configService.getConfig().api.baseUrl}/${info.file.response.path}`);
      }else if(form === 'room'){
        this.formAddRoom.controls['imageUrl'].setValue(`${this.configService.getConfig().api.baseUrl}/${info.file.response.path}`);
      }
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
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
      imageUrl: '',
      utilityRooms: [],
    });
    this.fileList = [];
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload`;
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
      imageUrl: this.item.imageUrl,
      utilityRooms: this.getIDUtilityRooms(this.item.utilityRooms),
    });
    this.fileList = this.item.imageUrl ? [
      {
        uid: '1',
        name: this.item.imageUrl ? StringUtils.getFileNameFromImageURL(this.item.imageUrl) : '',
        status: 'done',
        url: this.item.imageUrl ? this.item.imageUrl : "",
      },
    ] : [];

    // this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadHotelImage?hotelId=${this.item.id}`;
  }

  saveNewRoom() {
    this.submitted = true;
    let formValue = this.formAddRoom.value;

    if (this.formAddRoom.invalid) {
      this.notificationService.showNotification(Constant.ERROR, 'Tồn tại thông tin khách sạn chưa điền!');
      return;
    }

    const idsUtilityRooms = formValue.utilityRooms;
    // Sử dụng phương thức filter để lọc các phần tử có id trong danh sách idsUtilityRooms
    formValue.utilityRooms = this.listUtilityRoom.filter(utilityRoom => idsUtilityRooms.includes(utilityRoom.id));
    if (formValue.id === 0) {
      delete formValue.id;
      /// add
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

  getIDUtilityRooms(utilityRooms: any) {
    const ids = [];
    for (var i = 0; i < utilityRooms.length; i++) {
      ids[i] = utilityRooms[i].id;
    }
    return ids;
  }
}
