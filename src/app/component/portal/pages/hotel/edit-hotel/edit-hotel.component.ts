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
  selector: 'app-edit-hotel',
  templateUrl: './edit-hotel.component.html',
  styleUrls: ['./edit-hotel.component.scss']
})
export class EditHotelComponent implements OnInit {
  formAddHotel: FormGroup;
  submitted = false;
  isUpdate: boolean;
  titleFormHotel = '';
  fileList: NzUploadFile[] = [];
  listURLFiles: any[] = [];
  uploadUrl = '';
  listUtilityHotel = [];
  uploadHeader: any;
  configDescriptionHotel: AngularEditorConfig = {
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
    this.uploadHeader = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    };

    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload`;
  }

  ngOnInit(): void {
    this.getListUtilityHotels();
    this.receivedData = this.dataService.getData();
    if (this.receivedData != null && Object.keys(this.receivedData).length > 0) {
      this.isUpdate = this.receivedData.isUpdateHotel;
      // console.log('item: ',item);
      if (!this.isUpdate) {
        this.showModalAddHotel();
      } else {
        let item = this.receivedData.item;
        this.showModalUpdateHotel(item);
      }
    }
  }

  getListUtilityHotels() {
    this.generalService.getListUtilityHotel().subscribe((res: any) => {
      this.listUtilityHotel = res.data;
    });
  }

  get formControlHotel() {
    return this.formAddHotel.controls;
  }


  showModalAddHotel() {
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


  showModalUpdateHotel(item: any) {
    this.submitted = false;
    // this.item = data;
    this.titleFormHotel = 'Sửa thông tin khách sạn';
    this.isUpdate = true;

    this.formAddHotel.patchValue({
      id: item.id,
      name: item.name,
      code: item.code,
      phoneNo: item.phoneNo,
      contactEmail: item.contactEmail,
      address: item.address,
      description: item.description,
      websiteUrl: item.websiteUrl,
      utilitieIds: this.getIDUtilityHotels(item.utilityHotels),
      ratingStar: item.ratingStar,
      numRooms: item.numRooms,
      hotelFile: item.hotelFile,
      hotelFileIds: []
    });

    this.fileList = [];
    for (const hotel of item.hotelFile) {
      const objHotel = {
        uid: hotel.id.toString(),
        name: hotel.fileName,
        url: `${this.configService.getConfig().api.baseUrl}/${hotel.filePath}`,
      }
      this.fileList.push(objHotel)
    }
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadHotelImage?hotelId=${item.id}`;
  }

  getIDUtilityHotels(utilityHotel: any) {
    const s = [];
    for (var i = 0; i < utilityHotel.length; i++) {
      s[i] = utilityHotel[i].id;
    }
    return s;
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
          // this.getListData();
          this.router.navigate(['hotel']);
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
          // this.getListData();
          this.router.navigate(['hotel']);
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
        }
      }, error => {

      })
    }
  }

  validateEmail(mail: any) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) || !mail) {
      return (true);
    }
    alert('Chưa đúng định dạng email!');
    return (false);
  }

  handleCancel() {
    this.isUpdate = false;
    this.formAddHotel.reset();
    this.router.navigate(['hotel']);
  }

  handleChangeImages({ file, fileList }: NzUploadChangeParam, form: any): void {
    const status = file.status;
    if (status === 'done') {
      this.msg.success(`file ${file.name} tải lên thành công.`);
      console.log(file, fileList);
      this.fileList = fileList;
      console.log('this.fileList', this.fileList);
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
        console.log('this.listURLFiles: ', this.listURLFiles);
        this.formAddHotel.controls['hotelFileIds'].setValue(this.listURLFiles);
      } else if (form === 'room') {
        // setTimeout(() => {
        //   if (this.fileList.length > 0) {
        //     this.fileList[this.fileList.length - 1].uid = file.response.roomFileId.toString();
        //     this.fileList[this.fileList.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${file.response.path}`;
        //   }
        // }, 200);
        // this.listURLFiles.push(file.response.roomFileId);
        // console.log('this.listURLFiles: ', this.listURLFiles);
        // this.formAddRoom.controls['roomFileIds'].setValue(this.listURLFiles);
      }
    } else if (status === 'error') {
      this.msg.error(`file ${file.name} tải lên không thành công.`);
    }
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

    )
  }
}
