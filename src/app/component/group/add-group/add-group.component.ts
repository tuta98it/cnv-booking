import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Role} from '../../../model/role.class';
import {Group} from "../../../model/group.class";

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {
  @Input()isVisibleAdd: boolean;
  @Output() submitAdd: EventEmitter<any> = new EventEmitter();
  @Output() data: EventEmitter<any> = new EventEmitter();
  @Input() roleAdd: Role [] = [];
  roleResponses: Role [] = [];
  formAdd: FormGroup;
  submitted = false;
  constructor(private fb: FormBuilder) {
    this.formAdd = fb.group({
      groupName : [null, [ Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      createdDate : new Date(),
      description : [null, [Validators.maxLength(100)]],
      roleIds : [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
  }
  handleCancel() {
    this.submitted = false;
    this.isVisibleAdd = false;
    this.submitAdd.emit(this.isVisibleAdd);
    this.formAdd.reset();
  }
  get f() { return this.formAdd.controls; }
  handleOk() {
    this.submitted = true;
    if (this.formAdd.valid) {
      this.roleResponses = [];
      this.roleAdd.filter(item => {
        this.formAdd.get('roleIds').value.forEach(id => {
          if (item.id === id) {
            this.roleResponses.push(item);
          }
        });
      });
      const group: Group = {
        id: null,
        groupId: null,
        groupName: this.formAdd.get('groupName').value,
        description: this.formAdd.get('description').value,
        createdDate: new Date(),
        roleResponses: this.roleResponses,
        roleIds: this.formAdd.get('roleIds').value
      };
      this.submitted = false;
      this.data.emit(group);
      this.formAdd.reset();
    }
  }
}
