import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidator} from '../../../shared/custom-validator/noWhitespace.class';
import {User} from '../../../model/user.class';
import {DatePipe} from '@angular/common';
import {Constant} from '../../../shared/constants/constant.class';
import {Role} from '../../../model/role.class';
import {Group} from '../../../model/group.class';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit , OnChanges {
  @Input() isVisible: boolean;
  @Input() user: User;
  @Input()roles: Role[] = [];
  @Input()groups: Group [] = [];
  @Output() data: EventEmitter<any> = new EventEmitter();
  @Output() submitUpdate: EventEmitter<any> = new EventEmitter();
  formUpdate: FormGroup;
  submitted = false;
  createdDate: string ;
  groupIds: string [] = [];
  roleIds: string [] = [];
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe) {
    this.formUpdate  =  this.formBuilder.group({
      email: [[null], [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      phone: [[null], [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      name: [[null], [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      groupIds: [null],
      roleIds: [null],
      status: [null, Validators.required],
      userName: [null],
      userId: [null],
      createdDate: [null],
      updatedDate: [null]
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.groupIds = [];
    this.roleIds = [];
    if (this.user != null) {
      if (this.user.groups !== null) {
        this.user.groups.forEach(group => {
          this.groupIds.push(group.groupId);
        });
      }
      if (this.user.roles !== null){
        this.user.roles.forEach(role => {
          this.roleIds.push(role.id + '');
        });
      }
      this.pathValue();
    }
  }

  pathValue() {
    this.formUpdate.patchValue({
      userId: this.user.userId,
      email: this.user.email,
      name: this.user.name,
      userName: this.user.userName,
      phone: this.user.phone,
      groupIds: this.groupIds,
      status: this.user.status + '',
      createdDate: this.user.createdDate,
      updatedDate: this.user.updatedDate,
      roleIds: this.roleIds
    });
  }
  get f() { return this.formUpdate.controls; }
   handleOk(): void {
    this.submitted = true;
    if (this.formUpdate.valid) {
       this.isVisible = false;
       this.data.emit(this.formUpdate.value);
    }
  }

  handleCancel(): void {
    this.submitUpdate.emit(false);
    this.submitted = false;
    this.formUpdate.reset();
  }
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
