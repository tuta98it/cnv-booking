import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {ActionsSubject, Store, select} from '@ngrx/store';
import * as fromRole from '../../role/redux/role.reducer';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../service/notification.service';
import {AppConfigService} from '../../../../app-config.service';
import {Constant} from '../../../shared/constants/constant.class';
import {CustomValidator} from '../../../shared/custom-validator/noWhitespace.class';
import {GeneralService} from '../../../service/general-service';
import {TableSelectionAbstract} from '../../../shared/component/table/table-selection.abstract';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UserService } from 'src/app/service/user-service';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-nhansu-list',
  templateUrl: './nhansu-list.component.html',
  styleUrls: ['./nhansu-list.component.scss']
})
export class NhansuListComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  datas: any[] = [];
  roles: any[] = [];
  staffs: any[] = [];
  departments: any[] = [];
  staffWorkRole: any[] = [];
  data: any;
  passwordVisible: boolean;
  isVisibleAdd: boolean;
  isVisibleAddTaiKhoan: boolean;
  isVisibleUpdate: boolean;
  item: any;
  rowId: any;
  staff: any;
  loading: boolean;
  checkDelete = true;
  checkAdd = true;
  checkUpdate = true;
  pageSize: any;
  page: any;
  defaultPage: any;
  formAdd: FormGroup;
  formAddTaiKhoan: FormGroup;
  submitted = false;
  isCollapse = true;
  isVisibleGroup: boolean;
  selectedUser: any;
  workRoles: any[] = [];
  constructor(
    public store: Store<fromRole.AppState>,
    public translate: TranslateService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private userService: UserService,
    private actionsSubject$: ActionsSubject,
    private configService: AppConfigService,
    private fb: FormBuilder
  ) {
    super('id');
    this.formAdd = this.fb.group({
      id: [null],
      firstName : [null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      lastName : [null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      phoneNo: [[null], [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: [[null], [Validators.required, CustomValidator.cannotContainSpace,
        Validators.minLength(6), Validators.email, Validators.maxLength(100)]],
      staffCode: [null],
      cmnd: [null],
      address: [null],
      dob: [null],
      ngayGiaNhap: [null],
      avatar: [null],
      soHopDongLd: [null],
      salary: [null],
      viTri: [null],
      chuyenMon: [null],
      departmentId: [null],
      description : [null],
      userId: [null],
      workRole: []
    });
    this.formAddTaiKhoan = this.fb.group({
      id: [null],
      ho : [null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      ten : [null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      username: [[null], [Validators.required, CustomValidator.cannotContainSpace,
        Validators.minLength(6), Validators.maxLength(100)]],
      roles: [null],
      password: [null],
      repeatPassword: [null]
    });
    this.isVisibleAddTaiKhoan = false;
  }

  ngOnInit(): void {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.getListData();
    this.getListDepartment();
    this.getListWorkRole();
    this.get();
  }
  get f() { return this.formAdd.controls; }
  ngOnDestroy(): void {

  }
  getListData() {
    this.loading = true;
    this.generalService.getStaff().subscribe(res => {
      console.log(res);
      if (res !== null) {
        this.datas = res;
        this.loading = false;
        super.setListOfAllData(this.datas);
      }
    }, error => {

    });
  }
  getListDepartment() {
    this.generalService.getPhong().subscribe(res => {
      if (res !== null) {
        this.departments = res;
      }
    }, error => {

    });
  }
  getListWorkRole() {
    this.generalService.getWorkRole().subscribe(res => {
      if (res !== null) {
        this.workRoles = res;
        console.log(res)
      }
    }, error => {

    });
  }
  checkWorkRole(idRole){
    let item = {
    workRoleId : idRole
    }
    this.staffWorkRole.push(item);
    console.log("staffWorkRole", this.staffWorkRole);
    }
  get() {
    this.translate.use(this.translate.currentLang).subscribe(data => {
      this.data = data;
    });
  }
  showConfirm(id): void {
    this.get();
    this.modalService.confirm({
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muốn xóa hay không?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Bỏ qua',
      nzOnOk: () => this.deleteItem(id)
    });
  }
  deleteItem(id) {
    this.generalService.deleteStaff(id).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_DELETE_SUCCESS);
      this.getListData();
    }, error => {

    });
  }
  showModalAdd() {
    this.isVisibleAdd = true;
    this.formAdd.patchValue({
      id: 0,
      firstName : '',
      lastName : '',
      phoneNo: '',
      email: '',
      staffCode: '',
      cmnd: '',
      address: '',
      dob: '',
      ngayGiaNhap: '',
      avatar: '',
      soHopDongLd: '',
      salary: '',
      viTri: '',
      chuyenMon: '',
      departmentId: '',
      description : ''
    });
  }
  showModalUpdate(data) {
    this.isVisibleAdd = true;
    this.item = data;
    this.staffs = this.item.staff;
    if (this.item){
      this.selectedUser = this.item.user;
    }

    this.formAdd.patchValue({
      id: this.item.id,
      firstName : this.item.firstName,
      lastName : this.item.lastName,
      phoneNo: this.item.phoneNo,
      email: this.item.email,
      staffCode: this.item.staffCode,
      cmnd: this.item.cmnd,
      address: this.item.address,
      dob: this.item.dob,
      ngayGiaNhap: this.item.ngayGiaNhap,
      avatar: this.item.avatar,
      soHopDongLd: this.item.soHopDongLd,
      salary: this.item.salary,
      viTri: this.item.viTri,
      chuyenMon: this.item.chuyenMon,
      departmentId: this.item.departmentId,
      description: this.item.description,
    });
  }
  handleCancel(){
    this.isVisibleAdd = false;
    this.isVisibleAddTaiKhoan = false;
    this.staffWorkRole = [];
    this.formAdd.reset();
  }
  handleOk()
  {
    const formValue = this.formAdd.value;
    formValue.staffWorkRole = this.staffWorkRole;
    console.log(formValue);
    if (formValue.id == 0) {
      delete formValue.id;
      this.generalService.addStaff(formValue).subscribe(res => {
        if (res !== null && res !== undefined && res.ret !== null && res.ret !== undefined && res.ret.code != 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret.message);
          formValue.id = 0;
        }
        else {
          this.getListData();
          this.isVisibleAdd = false;
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
        }
      }, error => {

      });
    }
    else {
      this.generalService.updateStaff(formValue).subscribe(res => {
        if (res !== null && res !== undefined && res.ret !== null && res.ret !== undefined && res.ret.code != 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret.message);
          console.log('update',res);
        }
        else {
          this.getListData();
          this.isVisibleAdd = false;
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
        }
      }, error => {

      });
    }
  }
  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);
  getTenPhong(id) {
    var s='';
    if (this.datas[id].departmentNavigation !== null) {
      s += this.datas[id].departmentNavigation.name;
    }
    return s;
  }
  getUsername(id) {
    var s='';
    if (this.datas[id].user !== null) {
      s += this.datas[id].user.username;
    }
    return s;
  }
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }
  getStatusBtnAddTaiKhoan(id) {
    var status = true;
    if (this.datas[id].user == null) {
      status = false;
    }
    return status;
  }
  showModalAddTaiKhoan(data) {
    this.isVisibleAddTaiKhoan = true;
    this.generalService.getRole().subscribe(res => {
      this.roles = res;
    }, error => {

    });
    this.staff = data;
    console.log(this.staff);
    this.formAddTaiKhoan.patchValue({
      id: this.staff.id,
      ho: this.staff.firstName,
      ten: this.staff.lastName,
      username : this.staff.phoneNo,
      roles : '',
      password: '',
      repeatPassword: ''
    });
  }
  handleAddTaiKhoan() {
    const formValue = this.formAddTaiKhoan.value;
    delete formValue.id;
    this.generalService.addTaikhoan(formValue).subscribe(res => {
      if (res !== null && res !== undefined && res.ret !== null && res.ret !== undefined && res.ret.code != 0) {
        this.notificationService.showNotification(Constant.ERROR, res.ret.message);
      }
      else {
        console.log('id',res.id);
        this.formAdd.patchValue({
          id: this.staff.id,
          firstName : this.staff.firstName,
          lastName : this.staff.lastName,
          phoneNo: this.staff.phoneNo,
          email: this.staff.email,
          staffCode: this.staff.staffCode,
          cmnd: this.staff.cmnd,
          address: this.staff.address,
          dob: this.staff.dob,
          ngayGiaNhap: this.staff.ngayGiaNhap,
          avatar: this.staff.avatar,
          soHopDongLd: this.staff.soHopDongLd,
          salary: this.staff.salary,
          viTri: this.staff.viTri,
          chuyenMon: this.staff.chuyenMon,
          departmentId: this.staff.departmentId,
          description: this.staff.description,
          userId: res.id
        });
        this.generalService.updateStaff(this.formAdd.value).subscribe(res => {
          console.log('loi',res);
          if (res !== null && res !== undefined && res.ret !== null && res.ret !== undefined && res.ret.code != 0) {

            this.notificationService.showNotification(Constant.ERROR, res.ret.message);
          }
          else {
            this.getListData();
          }
        });
        this.isVisibleAddTaiKhoan = false;
        this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS + ' ' + Constant.USER_INFO + ' ' + res.username);
      }
    }, error => {
    });
  }
  showModalGroup(data) {
    console.log(data);
    this.isVisibleGroup = true;
    this.item = data;
    //this.users = this.item.userGroup;
  }
  closeModalGroups() {
    this.isVisibleGroup = false;
  }
}
