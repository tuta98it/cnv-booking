import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidator} from '../../../shared/custom-validator/noWhitespace.class';
import {Role} from '../../../model/role.class';
import {Group} from '../../../model/group.class';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  @Input()isVisibleAdd: boolean;
  @Input()rolesAdd: Role[] = [];
  @Input()groupsAdd: Group [] = [];
  @Output() dataAdd: EventEmitter<any> = new EventEmitter();
  @Output() submitAdd: EventEmitter<any> = new EventEmitter();
  formAdd: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder) {
    this.formAdd  =  this.formBuilder.group({
      email: [[null], [Validators.required, CustomValidator.cannotContainSpace,
        Validators.minLength(6), Validators.email, Validators.maxLength(100)]],
      phone: [[null], [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      name: [[null], [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      groupIds: [null],
      roleIds: [null],
      status: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      userName: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
  }

  get f() { return this.formAdd.controls; }
  handleOk(): void {
    this.submitted = true;
    if (this.formAdd.valid) {
      this.isVisibleAdd = false;
      this.dataAdd.emit(this.formAdd.value);
      this.submitted = false;
      this.formAdd.reset();
    }
  }
  handleCancel(): void {
    this.submitAdd.emit(false);
    this.submitted = false;
    this.formAdd.reset();
  }
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
