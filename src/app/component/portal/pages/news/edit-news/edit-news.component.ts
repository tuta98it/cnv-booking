import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/service/general-service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { AppConfigService } from 'src/app-config.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Constant } from 'src/app/shared/constants/constant.class';
import { NotificationService } from 'src/app/service/notification.service';
import { NzImageService } from 'ng-zorro-antd/image';
import { DateFormatPipe } from 'src/app/shared/pipe/format-date.pipe';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { StringUtils } from 'src/app/shared/utils/string-utils.class';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.scss']
})
export class EditNewsComponent implements OnInit {
  formAddNews: FormGroup;
  // item: any;
  // isVisibleAddNews: boolean = true;
  submitted = false;
  isUpdate: boolean;
  titleFormNews = '';
  fileList: NzUploadFile[] = [];
  uploadUrl = '';
  uploadHeader: any;
  configDescriptionNews: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '22rem',
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
    toolbarHiddenButtons: [],
  };
  receivedData: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private configService: AppConfigService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private dateFormatPipe: DateFormatPipe,
    private nzImageService: NzImageService,
    private msg: NzMessageService,
    private dataService: DataService,) {
    this.formAddNews = this.fb.group({
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
    this.receivedData = this.dataService.getData();
    if (this.receivedData != null && Object.keys(this.receivedData).length > 0) {
      this.isUpdate = this.receivedData.isUpdateNews;
      if (!this.isUpdate) {
        this.showModalAddNews();
      } else {
        let item = this.receivedData.item;
        this.showModalUpdateNews(item);
      }
    }
  }
  get formControlNews() {
    return this.formAddNews.controls;
  }
  showModalAddNews() {
    this.submitted = false;
    this.titleFormNews = 'Thêm mới bài đăng';
    this.formAddNews.reset();
    this.formAddNews.patchValue({
      id: 0,
      title: '',
      imageUrl: '',
      content: '',
      datePosted: new Date(),
      summary: '',
    });
    this.fileList = [];
  }
  showModalUpdateNews(item: any) {
    this.submitted = false;
    // this.item = data;
    this.titleFormNews = 'Sửa thông tin bài đăng';
    this.isUpdate = true;

    this.formAddNews.patchValue({
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl,
      content: item.content,
      datePosted: item.datePosted,
      summary: item.summary,
    });

    this.fileList = [
      {
        uid: '1',
        name: StringUtils.getFileNameFromImageURL(item.imageUrl),
        status: 'done',
        url: item.imageUrl,
      },
    ];
  }
  saveNews() {
    this.submitted = true;
    let formValue = this.formAddNews.value;
    if (this.formAddNews.invalid) {
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
          // this.getListData();
          this.router.navigate(['news']);
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
        }
      }, (error: any) => {

      });
    } else {
      // / update
      delete formValue.newsFile;
      delete formValue.newsFileIds;
      this.generalService.updateNewsByID(formValue.id, formValue).subscribe((res: any) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          // this.getListData();
          this.router.navigate(['news']);
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
        }
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'Đã có lỗi xảy ra!');
      })
    }
  }
  handleCancel() {
    this.isUpdate = false;
    this.formAddNews.reset();
    this.router.navigate(['news']);
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
      this.formAddNews.controls['imageUrl'].setValue(`${this.configService.getConfig().api.baseUrl}/${info.file.response.path}`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

}
