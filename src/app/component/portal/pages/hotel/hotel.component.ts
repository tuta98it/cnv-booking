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
@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})
export class HotelComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  @ViewChild("ListHotels") dataGridDetail: DxDataGridComponent;
  datas: any[] = [];
  data: any;
  passwordVisible: boolean;
  repeatpasswordVisible: boolean;
  isVisibleAdd: boolean;
  isVisibleUpdate: boolean;
  isVisiblePassword: boolean;
  item: any;
  loading: boolean;
  checkDelete = true;
  checkAdd = true;
  checkUpdate = true;
  submitted = false;
  updated: boolean;
  formAdd: FormGroup;
  filteredDatas: any[] = [];
  searchText = '';
  userInfor: any;
  titleFormUser = '';
  isVisibleDetailUtility: boolean = false;
  listDetailUtility: any[];
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
    this.formAdd = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      phoneNo: [null, [Validators.required]],
      contactEmail: [null, [Validators.required]],
      address: [null, [Validators.required]],
      description: [null],
      websiteUrl: [null, [Validators.required]],
      // facebook: [null, [Validators.required]],
      ratingStar: [null, [Validators.required]],
      numRooms: [null, [Validators.required]],
      imageUrl: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getUserInfo();
    this.getListData();
  }

  ngOnDestroy(): void {

  }

  getUserInfo() {
    this.userInfor = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    console.log('this.userInfor: ', this.userInfor);
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

  validateEmail(mail: any) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) || !mail) {
      return (true);
    }
    alert('Chưa đúng định dạng email!');
    return (false);
  }

  get f() {
    return this.formAdd.controls;
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

  showModalAdd() {
    this.isVisibleAdd = true;
    this.submitted = false;
    this.titleFormUser = 'Thêm mới khách sạn';
    this.formAdd.reset();
    this.formAdd.patchValue({
      name: '',
      code: '',
      phoneNo: '',
      contactEmail: '',
      address: '',
      description: '',
      websiteUrl: '',
      // facebook: '',
      ratingStar: '',
      numRooms: '',
      imageUrl: ''
    });
  }

  showModalUpdate(data: any) {
    this.isVisibleAdd = true;
    this.submitted = false;
    this.item = data;
    this.titleFormUser = 'Sủa thông tin khách sạn';
    this.updated = true;

    this.formAdd.patchValue({
      id: this.item.id,
      name: this.item.name,
      code: this.item.code,
      phoneNo: this.item.phoneNo,
      contactEmail: this.item.contactEmail,
      address: this.item.address,
      description: this.item.description,
      websiteUrl: this.item.websiteUrl,
      // facebook: this.item.facebook,
      ratingStar: this.item.ratingStar,
      numRooms: this.item.numRooms,
      imageUrl: this.item.imageUrl,
    });
  }


  handleCancel() {
    this.isVisibleAdd = false;
    this.updated = false;
    this.isVisibleDetailUtility = false;
    this.formAdd.reset();
  }

  handleOk() {
    this.submitted = true;
    let formValue = this.formAdd.value;
    const checkEmail = this.validateEmail(formValue.contactEmail);
    if (!checkEmail) {
      this.notificationService.showNotification(Constant.ERROR, 'Email không đúng định dạng!');
      return;
    }
    if (this.formAdd.invalid) {
      this.notificationService.showNotification(Constant.ERROR, 'Tồn tại thông tin khách sạn chưa điền!');
      return;
    }

    if (formValue.id === 0) {
      delete formValue.id;
      /// add
      this.generalService.addHotel(formValue).subscribe((res: any) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.getListData();
          this.isVisibleAdd = false;
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
          this.isVisibleAdd = false;
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


  private isEmpty(value: any): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === 'string' && value.trim() === '') {
      return true;
    }

    if (Array.isArray(value) && value.length === 0) {
      return true;
    }

    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }

    return false;
  }

  previewImagesHotel(image: any) {
    console.log('image: ', image);
    let arrImage: any[] = [];
    if (typeof image === 'string') {
      let objCurrent = {
        src : image,
        width : '50%',
        height : '50%',
        alt : 'Ảnh trực quan'
      }
      arrImage.push(objCurrent);
    }
    this.nzImageService.preview(arrImage, { nzZoom: 1.5, nzRotate: 0 });
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
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
}
