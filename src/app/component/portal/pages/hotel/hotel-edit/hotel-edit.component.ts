import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../../../../../app-config.service';
import { NotificationService } from '../../../../../service/notification.service';
import { GeneralService } from '../../../../../service/general-service';
import { DateFormatPipe } from '../../../../../shared/pipe/format-date.pipe';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../../../../../service/data.service';
import { Constant } from '../../../../../shared/constants/constant.class';
import { forkJoin } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActionTypePageVHL } from 'src/app/enums/action-type-page-vhl.enum';

@Component({
  selector: 'app-hotel-edit',
  templateUrl: './hotel-edit.component.html',
  styleUrls: ['./hotel-edit.component.scss']
})
export class HotelEditComponent implements OnInit {
  editTitle = 'Thêm mới khách sạn';
  formAddHotel: FormGroup;
  formContract: FormGroup;
  uploadHeader: any;
  uploadUrl = '';
  submitted = false;
  submittedContract = false;
  provinces: any[];
  districts: any[];
  listUtilityHotel: any[];
  valueNumberPhone = '';
  utilityGroupOptions: any[];
  isEdit = false;
  transactionItem: any;
  searchRoomName: any;
  tmpRoomHotels: any;
  amenityCheckAll = false;
  @ViewChild('inputElementNumberPhone', { static: false }) inputElementNumberPhone?: ElementRef;
  @ViewChild('myForm') myForm!: NgForm;
  @ViewChild('contractForm') contractForm!: NgForm;

  hotelItem: any;
  hotelId: any;
  hotelFileIds: any[];
  fileList: NzUploadFile[] = [];
  fileContractList: any[] = [];
  uploadContractFileUrl: any;
  isShowPopupPayment: boolean;
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
  roomHotels: any[];
  paymentItem: any;
  userInfo: any;
  now: any;
  loading = true;
  actionPageType: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private configService: AppConfigService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private dateFormatPipe: DateFormatPipe,
    private nzImageService: NzImageService,
    private msg: NzMessageService,
    private modalService: NzModalService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService) {



    this.actionPageType = this.activatedRoute.snapshot.data['type'];
    this.formAddHotel = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      /*phoneNo: [null, [Validators.required]],*/
      contactEmail: [null, [Validators.required]],
      address: [null, [Validators.required]],
      provinceId: [null, [Validators.required]],
      districtId: [null, [Validators.required]],
      description: [null],
      shortDescription: [null],
      websiteUrl: [null, [Validators.required]],
      // facebook: [null, [Validators.required]],
      ratingStar: [null, [Validators.required]],
      isActive: [true],
      numRooms: [null],
      hotelFile: [[]],
      hotelFileIds: [[]],
      linkGoogleMap: [null],
      amenities: [[]],
      amenityCheckAll: [false]
    });
    this.formContract = this.fb.group({
      taxCode: [null],
      businessName: [null],
      businessNameEnglish: [null],
      personInCharge: [null, [Validators.required]],
      positionOfPersonInCharge: [null],
      phoneNumberOfPersonInCharge: [null, [Validators.required]],
      emailOfPersonInCharge: [null, [Validators.required]],
      beginTimeContract: [null],
      endTimeContract: [null],
      businessAccountNumber: [null, [Validators.required]],
      businessAccountOwner: [null, [Validators.required]],
      businessBankBranch: [null, [Validators.required]],
    });
    this.uploadHeader = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    };
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadHotelImage?hotelId=0`;
    this.hotelItem = { isActive: true };
    this.fileList = [];
    this.hotelFileIds = [];
    this.fileContractList = [];
    this.transactionItem = {};
    this.paymentItem = {};
    this.now = new Date();
  }

  ngOnInit(): void {
    forkJoin([
      this.generalService.getListUtilityHotel(),
    ]).subscribe(([resUtility]) => {
      console.log(resUtility.data);
      this.utilityGroupOptions = resUtility.data.map(en => {
        return { label: en.name, value: en.id, checked: false };
      });

      this.hotelId = this.route.snapshot.paramMap.get('id');
      if (this.hotelId) {
        this.isEdit = true;
        this.binHotelDetail();
        this.getHotelTransactionHistory();
      } else {
        this.formAddHotel.patchValue({
          amenities: this.utilityGroupOptions
        });
        this.amenityCheckAll = false;
      }
    });

    this.getProvinces();
    this.getUserInfo();

    this.formAddHotel.get('amenities')?.valueChanges.subscribe(value => {
      this.amenityCheckAll = !this.utilityGroupOptions.map(en => en.checked).includes(false);
      this.formAddHotel.patchValue({
        amenityCheckAll: this.amenityCheckAll
      });
    });
  }

  getUserInfo() {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
  }

  searchRoomByName() {
    if (!this.searchRoomName || this.searchRoomName.trim() === '') {
      return this.roomHotels = this.tmpRoomHotels;
    }
    const searchLower = this.searchRoomName.toLowerCase();
    return this.roomHotels = this.tmpRoomHotels.filter(room =>
      room.name.toLowerCase().includes(searchLower)
    );
  }

  // In ra danh sách các phòng đã lọc vào console
  binHotelDetail() {
    this.generalService.getHotelById(this.hotelId).subscribe(res => {
      this.hotelItem = res;
      let index = 1;
      res.roomHotels.forEach(en => {
        en.stt = index++;
      });
      this.roomHotels = res.roomHotels;
      this.tmpRoomHotels = this.roomHotels;

      this.submitted = false;
      // this.item = data;
      const item = res;
      if (this.actionPageType === ActionTypePageVHL.View) {
        this.editTitle = item.name;
      } else if (this.actionPageType === ActionTypePageVHL.Update) {
        this.editTitle = 'Sửa thông tin khách sạn';
      } else {
        this.editTitle = item.name;
      }
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
        ratingStar: item.ratingStar,
        numRooms: item.numRooms,
        hotelFile: item.hotelFile,
        hotelFileIds: [],
        provinceId: item.province?.id,
        districtId: item.district?.id,
        isActive: item.isActive,
        linkGoogleMap: item.linkGoogleMap
      });

      this.formContract.patchValue({
        hotelId: this.hotelItem.id,
        fileContract1Path: item.fileContract1Path,
        fileContract2Path: item.fileContract2Path,
        fileContract3Path: item.fileContract3Path,
        taxCode: item.taxCode,
        businessName: item.businessName,
        businessNameEnglish: item.businessNameEnglish,
        personInCharge: item.personInCharge,
        positionOfPersonInCharge: item.positionOfPersonInCharge,
        phoneNumberOfPersonInCharge: item.phoneNumberOfPersonInCharge,
        emailOfPersonInCharge: item.emailOfPersonInCharge,
        beginTimeContract: item.beginTimeContract,
        endTimeContract: item.endTimeContract,
        businessAccountNumber: item.businessAccountNumber,
        businessAccountOwner: item.businessAccountOwner,
        businessBankBranch: item.businessBankBranch
      });
      this.fileList = [];
      for (const hotel of item.hotelFile) {
        const objHotel = {
          uid: hotel.id.toString(),
          name: hotel.fileName,
          url: `${this.configService.getConfig().api.baseUrl}/${hotel.filePath}`,
        };
        this.fileList.push(objHotel);
      }
      const utilityHotelIds = item.utilityHotels.map(en => en.id);

      this.amenityCheckAll = true;
      this.utilityGroupOptions.forEach(en => {
        en.checked = utilityHotelIds.includes(en.value);
      });
      this.formAddHotel.patchValue({
        amenities: this.utilityGroupOptions,
      });

      this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadHotelImage?hotelId=${item.id}`;
      this.uploadContractFileUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadHotelContractFile?hotelId=${item.id}`;

      this.fileContractList = [];
      for (let i = 1; i <= 3; i++) {
        const contracFilePath = item[`fileContract${i}Path`];
        if (contracFilePath) {
          const objHotel = {
            fileName: this.getFileName(contracFilePath),
            path: contracFilePath,
            viewPath: `${this.configService.getConfig().api.baseUrl}/${contracFilePath}`,
          };
          this.fileContractList.push(objHotel);
        }
      }
      console.log(this.fileContractList);
    });
    this.loading = false;

  }

  getFileName(path: string) {
    if (path) {
      const parts = path.split('/');
      return parts.pop() || '';
    } else {
      return '';
    }
  }

  get formControlHotel() {
    return this.formAddHotel.controls;
  }

  get formControlContract() {
    return this.formContract.controls;
  }

  validateEmail(mail: any) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) || !mail) {
      return (true);
    }
    return (false);
  }

  updateValueNumberPhone(value: string): void {
    const reg = /^[0-9 | + | * | ( | ) | #]*$/;
    if (reg.test(value) || value === '') {
      this.valueNumberPhone = value;
    }
    this.inputElementNumberPhone!.nativeElement.value = this.valueNumberPhone;
    // this.updateTitle();
  }

  getProvinces() {
    this.generalService.getProvinces().subscribe((res: any) => {
      this.provinces = res;
    });
  }

  getDistrictsById(idProvince: number) {
    this.formAddHotel.controls.districtId.setValue(null);
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

  triggerSubmit() {
    if (this.myForm) {
      this.myForm.ngSubmit.emit();  // Gọi sự kiện submit của form
    }
  }

  saveHotel() {
    this.submitted = true;
    const formValue = this.formAddHotel.value;

    const checkEmail = this.validateEmail(formValue.contactEmail);
    if (!checkEmail) {
      this.notificationService.showNotification(Constant.ERROR, 'Email không đúng định dạng!');
      return;
    }
    if (this.formAddHotel.invalid) {
      this.notificationService.showNotification(Constant.ERROR, 'Tồn tại thông tin khách sạn chưa điền!');
      return;
    }
    const utilitieIds = this.formAddHotel.value.amenities.filter(en => en.checked).map(en => en.value);
    formValue.utilitieIds = utilitieIds;
    formValue.hotelFileIds = this.hotelFileIds;
    formValue.shortDescription = this.hotelItem.shortDescription;
    formValue.description = this.hotelItem.description;

    if (!this.hotelItem.shortDescription) {
      this.notificationService.showNotification(Constant.ERROR, 'Chưa nhập thông tin mô tả!');
      return;
    }
    if (formValue.id === 0 || formValue.id === undefined || formValue.id === null) {
      delete formValue.id;
      delete formValue.hotelFile;
      delete formValue.amenities;
      this.generalService.addHotel(formValue).subscribe((res: any) => {
        if (!res.isValid) {
          this.notificationService.showNotification(Constant.ERROR, res.errors[0].errorMessage);
        } else {
          this.router.navigate(['/hotel/edit-hotel', res.data]);
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
        }
      }, (error: any) => {
        this.notificationService.showNotification(Constant.ERROR, Constant.MESSAGE_SERVICE_ERROR);
      });
    } else {
      this.generalService.updateHotelByID(formValue.id, formValue).subscribe((res: any) => {
        if (!res.isValid) {
          this.notificationService.showNotification(Constant.ERROR, res.errors[0].errorMessage);
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
        }
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, Constant.MESSAGE_SERVICE_ERROR);
      });
    }
  }

  goListHotel() {
    this.router.navigate(['hotel/list']);
  }

  private errorNotifications: { [key: string]: boolean } = {};

  handleChangeImages({ file, fileList }: NzUploadChangeParam, form: any): void {
    const status = file.status;
    const validFormats = ['jpg', 'jpeg', 'png'];
    const validDocumentFormat = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileSizeLimit = 25 * 1024 * 1024;

    if (file.status === 'removed') {
      delete this.errorNotifications[file.name];
      return;
    }
    if (file.size > fileSizeLimit) {
      if (!this.errorNotifications[file.name]) {
        this.msg.error(`File ${file.name} quá kích thước tối đa 25MB.`);
        this.errorNotifications[file.name] = true;
      }
      return;
    }

    if (form !== 'contract' && !validFormats.includes(fileExtension)) {
      if (!this.errorNotifications[file.name]) {
        this.msg.error(`File ${file.name} không hợp lệ. Vui lòng chọn file có định dạng jpg, jpeg hoặc png.`);
        this.errorNotifications[file.name] = true;
      }
      return;
    }
    if (form === 'contract' && !validDocumentFormat.includes(fileExtension)) {
      if (!this.errorNotifications[file.name]) {
        this.msg.error(`File ${file.name} không hợp lệ. Vui lòng chọn tệp là ảnh hoặc tài liệu`);
        this.errorNotifications[file.name] = true;
        setTimeout(() => {
          fileList = fileList.filter(en => en.uid !== file.uid);
          console.log(fileList);
        }, 100);
      }
      return;
    }

    if (status === 'done') {
      this.errorNotifications[file.name] = false;
      this.msg.success(`File ${file.name} tải lên thành công.`);
      if (form === 'hotel') {
        this.fileList = fileList;
        setTimeout(() => {
          if (this.fileList.length > 0) {
            this.fileList[this.fileList.length - 1].uid = file.response.hotelFileId.toString();
            this.fileList[this.fileList.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${file.response.path}`;
          }
        }, 0);
        this.hotelFileIds.push(file.response.hotelFileId);
        this.formAddHotel.controls.hotelFileIds.setValue(this.hotelFileIds);
        console.log(this.fileList);
      } else if (form === 'room') {
      } else if (form === 'contract') {
        this.fileContractList = fileList;
      }
    } else if (status === 'error') {
      this.msg.error(`File ${file.name} tải lên không thành công. ${file.error.error.text}`);
    }
  }

  handleRemoveImageHotel = async (file: NzUploadFile): Promise<void> => {
    const idHotelImage = file.uid;
    if (idHotelImage) {
      this.generalService.deleteHotelImageByID(idHotelImage).subscribe(
        {
          next: (res) => {
            if (res) {
              if (res.ret && res.ret.length > 0) {
                res.ret.forEach((el: any) => {
                  if (el.code === 0) {
                    this.msg.success(`Đã xoá ảnh ${file.name}.`);
                  } else if (res.code === 404) {
                    this.msg.error(`Không tìm thấy ảnh ${file.name}.`);
                  } else {
                    this.msg.error(`Đã có lỗi xảy ra. Không thể xoá ảnh ${file.name}`);
                  }
                });
              }
            } else {
              this.notificationService.showNotification(Constant.ERROR, `Hệ thống gặp lỗi, xoá ảnh ${file.name} thất bại.`);
            }
          },
          error: (error) => {
            this.notificationService.showNotification(Constant.ERROR, `Hệ thống gặp lỗi, xoá ảnh ${file.name} thất bại.`);
          },
          complete: () => {
          },

        }
      );
    }
  };
  handleRemoveContractFile = async (file: NzUploadFile): Promise<void> => {
    const fileId = file.uid;
    if (fileId) {
      console.log('this.fileContractList', fileId, this.fileContractList);
      this.fileContractList = this.fileContractList.filter(en => en.uid !== fileId);
    }
  };

  saveContract() {
    const formValue = this.contractForm.value;

    this.submittedContract = true;
    const checkEmail = this.validateEmail(formValue.emailOfPersonInCharge);
    if (!checkEmail) {
      this.notificationService.showNotification(Constant.ERROR, 'Email không đúng định dạng!');
      return;
    }
    formValue.id = this.hotelItem.id;
    if (this.fileContractList.length) {
      let i = 1;
      for (let j = 1; j <= 3; j++) {
        formValue[`fileContract${i}Path`] = null;
      }
      this.fileContractList.forEach(f => {
        formValue[`fileContract${i}Path`] = f.path;
        i++;
      });
    }
    console.log(this.contractForm.valid);
    if (!this.contractForm.valid) {
      this.notificationService.showNotification(Constant.ERROR, 'Vui lòng nhập đầy đủ các trường bắt buộc');
      return;
    }
    this.generalService.saveHotelContract(formValue).subscribe((res: any) => {
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

  addNewRoom() {
    this.router.navigate(['hotel/edit-room', this.hotelItem.id]);
  }

  clickSwitchIsAvaliable(isAvaliableUpdate: boolean, roomID: any): void {
    this.generalService.SetAvailableRoom({ roomId: roomID, isAvailable: isAvaliableUpdate }).subscribe(
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

  previewImages(images: any) {
    const arrImage: any[] = [];
    if (typeof images === 'string') {
      const objImage = {
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

  showConfirmDeleteRoom(id: any): void {
    this.modalService.confirm({
      nzTitle: 'Bạn có chắc muốn xóa phòng này?',
      nzContent: '<b style="color: red;">Phòng sẽ không thể hoàn tác sau khi xoá. Ấn đồng ý để xoá</b>',
      nzOkDanger: true,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOnOk: () => this.deleteItemRoomByID(id).then(() => this.binHotelDetail()),
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

  routeLinkToEdit(roomId: string) {
    this.router.navigate(['hotel/edit-room', this.hotelItem.id, roomId]);
  }

  setActive(data: any) {
    console.log(data);

    data.isActive = !data.isActive;
    this.generalService.setActiveRoom({ roomId: data.id, isActive: data.isActive }).subscribe(
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

  selectedRooms: any[] = [];

  onCheckboxChange(room: any) {
    if (room.isChecked) {
      this.selectedRooms.push(room);
    } else {
      this.selectedRooms = this.selectedRooms.filter(item => item.id !== room.id);
    }
  }

  lockSelectedRooms() {
    if (this.selectedRooms.length === 0) {
      this.notificationService.showNotification(Constant.ERROR, 'Vui lòng chọn ít nhất một phòng để khóa');
      return;
    }

    this.selectedRooms.forEach(room => {
      room.isActive = false;

      this.generalService.setActiveRoom({ roomId: room.id, isActive: room.isActive }).subscribe({
        next: (res) => {
          if (res.ret && res.ret[0].code !== 0) {
            this.notificationService.showNotification(Constant.ERROR, `Khóa phòng ${room.name} thất bại: ${res.ret[0].message}`);
          } else {
            this.notificationService.showNotification(Constant.SUCCESS, `Khóa phòng ${room.name} thành công`);
            room.isChecked = false;
          }
        },
        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, `Khóa phòng ${room.name} thất bại`);
        }
      });
    });

    this.selectedRooms = [];
  }


  getHotelTransactionHistory() {
    const payload = {
      hotelId: this.hotelId,
      page: 1,
      pageSize: 1000
    };
    this.generalService.getHotelTransactionHistory(payload).subscribe(
      {
        next: (res) => {
          this.transactionItem = res;
          let index = 1;
          this.transactionItem.data.forEach(en => {
            en.stt = index;
            index++;
          });
        },
        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Cập nhật trạng thái phòng thất bại');
        },
        complete: () => {
        }
      }
    );
  }

  showPopupPayment() {
    this.isShowPopupPayment = true;
  }

  handleCancel() {
    this.isShowPopupPayment = false;
  }

  doPayment() {
    const payload = {
      hotelId: this.hotelId,
      amount: this.paymentItem.amount,
      content: this.paymentItem.content
    };

    this.generalService.doPayMoneyForHotel(payload).subscribe(
      {
        next: (res) => {
          if (res.isValid) {
            this.getHotelTransactionHistory();
            this.isShowPopupPayment = false;
            this.notificationService.showNotification(Constant.SUCCESS, 'Cập nhật thành công');
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Cập nhật thất bại');
          }
        },
        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Cập nhật thất bại');
        },
        complete: () => {
        }
      }
    );
  }

  changeShortLength($event: any) {
    if ($event.length >= 500) {
      console.log($event.length);
      setTimeout(() => {
        this.hotelItem.shortDescription = this.hotelItem.shortDescription.substring(0, 500);
        console.log(this.hotelItem.shortDescription);
      }, 100);
      this.notificationService.showNotification(Constant.ERROR, 'Mô tả ngắn đã vượt quá 500 ký tự');
    }
  }

  onUploadStarted(e: any) {

  }

  onFileUploaded(e: any) {
    const response = JSON.parse(e.request.response);
    if (response) {
      const fileItem = {
        path: response.path,
        fileName: response.fileName,
        viewPath: this.configService.getConfig().api.baseUrl + '/' + response.path,
      };
      this.fileContractList.push(fileItem);
    }
  }

  deleteFile(item: any) {
    this.fileContractList = this.fileContractList.filter(en => en.fileName !== item.fileName);
  }

  onUserInteraction($event: Event) {
    this.utilityGroupOptions.filter(en => {
      en.checked = this.formAddHotel.get('amenityCheckAll')?.value;
    });
    this.formAddHotel.patchValue({
      amenities: this.utilityGroupOptions
    });
  }

  onInputCodeChange($event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase(); // Tự động chuyển thành chữ hoa
    this.formAddHotel.get('code')?.setValue(input.value);
  }

  preventSpecialChars(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9]$/; // Chỉ cho phép chữ và số
    const key = event.key;

    if (!regex.test(key)) {
      event.preventDefault(); // Chặn ký tự không hợp lệ
    }
  }

  validateFileType(event: any): void {
    const file = event.value[0];
    if (file && file.type !== 'application/pdf') {
      alert('Chỉ được phép tải lên file PDF.');
      event.component.reset(); // Reset lại file uploader
    }
  }
}
