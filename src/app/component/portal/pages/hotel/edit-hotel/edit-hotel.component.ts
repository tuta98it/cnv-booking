import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
// @ts-ignore
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
    height: '23rem',
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
  provinces: any[];
  districts: any[];
  receivedData: any;
  valueRatingStar: number = 0;
  tooltipRatingStars = ['terrible', 'bad', 'normal', 'good', 'wonderful'];


  valueNumberPhone = '';
  @ViewChild('inputElementNumberPhone', { static: false }) inputElementNumberPhone?: ElementRef;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private configService: AppConfigService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private dateFormatPipe: DateFormatPipe,
    private nzImageService: NzImageService,
    private msg: NzMessageService,
    private dataService: DataService) {
    this.formAddHotel = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      code: [null],
      phoneNo: [null, [Validators.required]],
      contactEmail: [null, [Validators.required]],
      address: [null, [Validators.required]],
      provinceId: [null, [Validators.required]],
      districtId: [null, [Validators.required]],
      description: [null],
      shortDescription: [null],
      websiteUrl: [null, [Validators.required]],
      utilitieIds: [null],
      // facebook: [null, [Validators.required]],
      ratingStar: [null, [Validators.required]],
      isActive: [true],
      numRooms: [null],
      hotelFile: [[]],
      hotelFileIds: [[]],
    });
    this.uploadHeader = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    };

    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadHotelImage?hotelId=0`;
  }

  ngOnInit(): void {
    this.getListUtilityHotels();
    this.getProvinces();
    this.receivedData = this.dataService.getData();
    if (this.receivedData != null && Object.keys(this.receivedData).length > 0) {
      this.isUpdate = this.receivedData.isUpdateHotel;
      if (!this.isUpdate) {
        this.showModalAddHotel();
      } else {
        let item = this.receivedData.item;
        this.showModalUpdateHotel(item);
      }
    }
  }
  onChangeNumberPhone(value: string): void {
    this.updateValueNumberPhone(value);
  }

  updateValueNumberPhone(value: string): void {
    const reg = /^[0-9 | + | * | ( | ) | #]*$/;
    if (reg.test(value) || value === '') {
      this.valueNumberPhone = value;
    }
    this.inputElementNumberPhone!.nativeElement.value = this.valueNumberPhone;
    // this.updateTitle();
  }

  getListUtilityHotels() {
    this.generalService.getListUtilityHotel().subscribe((res: any) => {
      this.listUtilityHotel = res.data;
    });
  }
  getProvinces() {
    this.generalService.getProvinces().subscribe((res: any) => {
      this.provinces = res;
    });
  }

  getDistrictsById(idProvince: number) {
    this.formAddHotel.controls['districtId'].setValue(null);
    return new Promise<any>((resolve, reject) => {
      this.districts = [];
      if (idProvince && idProvince > 0) {
        this.generalService.getDistricsByProvinces(idProvince).subscribe(
          (res: any) => {
            this.districts = res;
            resolve(true);
          }
        );
      }
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
      shortDescription: '',
      websiteUrl: '',
      utilitieIds: [],
      // facebook: '',
      ratingStar: null,
      numRooms: '',
      hotelFile: [],
      hotelFileIds: [],
      provinceId: null,
      districtId: null,
      isActive: true
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
      shortDescription: item.shortDescription,
      websiteUrl: item.websiteUrl,
      utilitieIds: this.getIDUtilityHotels(item.utilityHotels),
      ratingStar: item.ratingStar,
      numRooms: item.numRooms,
      hotelFile: item.hotelFile,
      hotelFileIds: [],
      provinceId: item.province?.id,
      districtId: item.district?.id,
      isActive: item.isActive
    });
    this.getDistrictsById(item.province?.id).then((r) => this.formAddHotel.controls['districtId'].setValue(item.district?.id));
    this.fileList = [];
    for (const hotel of item.hotelFile) {
      const objHotel = {
        uid: hotel.id.toString(),
        name: hotel.fileName,
        url: `${this.configService.getConfig().api.baseUrl}/${hotel.filePath}`,
      };
      this.fileList.push(objHotel);
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

    if (formValue.id === 0 || formValue.id === undefined || formValue.id === null) {
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

      });
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
    console.log('file.response: ', file);

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
        // setTimeout(() => {
        //   if (this.fileList.length > 0) {
        //     this.fileList[this.fileList.length - 1].uid = file.response.roomFileId.toString();
        //     this.fileList[this.fileList.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${file.response.path}`;
        //   }
        // }, 200);
        // this.listURLFiles.push(file.response.roomFileId);
        // this.formAddRoom.controls['roomFileIds'].setValue(this.listURLFiles);
      }
    } else if (status === 'error') {
      this.msg.error(`file ${file.name} tải lên không thành công. ${file.error.error.text}`);
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
    );
  };
}
