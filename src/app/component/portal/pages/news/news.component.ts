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
import { NzUploadFile } from 'ng-zorro-antd/upload';
import {
  DxDataGridComponent,
  DxTemplateDirective,
  DxTooltipComponent,
  DxTooltipModule,
} from "devextreme-angular";
import { filter } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { StringUtils } from 'src/app/shared/utils/string-utils.class';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  @ViewChild("ListNews") dataGridDetail: DxDataGridComponent;
  datas: any[] = [];
  isVisibleAdd: boolean;
  isVisibleUpdate: boolean;
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
  titleFormUser = '';
  isVisibleDetailUtility: boolean = false;
  listDetailUtility: any[];
  uploadHeader: any;
  baseImageurl = '';
  uploadUrl = '';
  fileList: NzUploadFile[] = [];
  constructor(
    private router: Router,
    public translate: TranslateService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private fb: FormBuilder,
    private dateFormatPipe: DateFormatPipe,
    private nzImageService: NzImageService,
    private msg: NzMessageService,
    private configService: AppConfigService,
    private dataService: DataService,
  ) {
    super('id');
    this.formAdd = this.fb.group({
      id: [null],
      title: [null, [Validators.required]],
      imageUrl: [null, [Validators.required]],
      content: [null, [Validators.required]],
      datePosted: [null, [Validators.required]],
      summary: [null, [Validators.required]],
    });


    this.uploadHeader = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    };

    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload`;
  }

  ngOnInit(): void {
    this.getListData();
  }

  ngOnDestroy(): void {
  }

  getListData() {
    this.loading = true;
    this.generalService.getNews().subscribe((res: any) => {
      this.datas = res;
      let stt = 0;
      this.datas.forEach((en: any) => {
        en.stt = ++stt;
      });
      this.filteredDatas = this.datas;
    });
  }

  get f() {
    return this.formAdd.controls;
  }

  showDeleteConfirm(id: any): void {
    this.modalService.confirm({
      nzTitle: 'Bạn có chắc muốn xóa bài đăng này?',
      nzContent: '<b style="color: red;">bài đăng sẽ không thể hoàn tác sau khi xoá. Ấn đồng ý để xoá</b>',
      nzOkDanger: true,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOnOk: () => this.deleteItem(id)
    });
  }

  deleteItem(id: any) {
    // Delete workspace here
    this.generalService.deleteNewsByID(id).subscribe((res: any) => {
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
    this.titleFormUser = 'Thêm mới tin tức';
    this.formAdd.reset();
    this.formAdd.patchValue({
      id: 0,
      title: '',
      imageUrl: '',
      content: '',
      datePosted: new Date(),
      summary: '',
    });
    this.fileList = [];
  }

  routingPageNewsAdd() {
    const data = {
      isUpdateNews: false,
      item: {}
    };
    this.dataService.setData(data);
    this.router.navigate(['news/edit-news']);
  }


  showModalUpdate(data: any) {
    this.isVisibleAdd = true;
    this.submitted = false;
    this.item = data;
    this.titleFormUser = 'sửa thông tin bài đăng';
    this.updated = true;

    this.formAdd.patchValue({
      id: this.item.id,
      title: this.item.title,
      imageUrl: this.item.imageUrl,
      content: this.item.content,
      datePosted: this.item.datePosted,
      summary: this.item.summary,
    });

    this.fileList = [
      {
        uid: '1',
        name: StringUtils.getFileNameFromImageURL(this.item.imageUrl),
        status: 'done',
        url: this.item.imageUrl,
      },
    ];
  }

  routingPageNewsUpdate(item: any) {
    const data = {
      isUpdateNews: true,
      item: item,
    };
    this.dataService.setData(data);
    this.router.navigate(['news/edit-news']);
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

    if (this.formAdd.invalid) {
      this.notificationService.showNotification(Constant.ERROR, 'Tồn tại mục tin tức chưa nhập!');
      return;
    }

    if (formValue.id === 0) {
      delete formValue.id;
      /// add
      this.generalService.addNews(formValue).subscribe((res: any) => {
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
      this.generalService.updateNewsByID(formValue.id, formValue).subscribe((res: any) => {
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


  exportData() {
    this.dataGridDetail.instance.exportToExcel(false);
  }


  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const from = this.dateFormatPipe.transformFull(new Date(), Constant.DATE_FMT_STR);
    const dateStr = from;
    const fileName = `DS_Tin_tuc_${dateStr}`;
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
      removeAccents(en.title?.toString().trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.content?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.datePosted?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.summary?.trim()).toLowerCase().includes(keyword)
    );
  }
  previewImagesNews(image: any) {
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
  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
      this.fileList = [{
        uid: '1',
        name: info.file.name,
        status: 'done',
        url: `${this.configService.getConfig().api.baseUrl}/${info.file.response.path}`,
      },];
      this.formAdd.controls['imageUrl'].setValue(`${this.configService.getConfig().api.baseUrl}/${info.file.response.path}`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }
  previewDetailUtilityNews(utilityNews: any) {
    this.isVisibleDetailUtility = true;
    this.listDetailUtility = utilityNews;
    let stt = 0;
    this.listDetailUtility.forEach(en => {
      en.stt = ++stt;
    });
  }
}
