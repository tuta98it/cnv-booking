import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActionService} from '../../../service/action.service';
import {Action} from '../../../model/action.model';
import * as fromRole from '../redux/role.reducer';
import  * as actionRole from '../redux/role.action';
import {Store} from '@ngrx/store';
import {Role} from '../../../model/role.class';
@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  @Input()isVisibleAdd: boolean;
  @Output() submitAdd: EventEmitter<any> = new EventEmitter();
  @Output() data: EventEmitter<any> = new EventEmitter();
  formAdd: FormGroup;
  submitted = false;
  actions: Action[] = [];
  actionResponses: Action[] = [];
  constructor(private fb: FormBuilder, private actionService: ActionService , public store: Store<fromRole.AppState> ) {
    this.formAdd = fb.group({
      roleName : [null, [ Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      createdDate : new Date(),
      actionId: [null, [ Validators.required]]
    });
  }

  ngOnInit(): void {
    this.actionService.getAction().subscribe(res => {
      this.actions = res;
    });
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
      this.actionResponses = [];
      this.actions.filter(item => {
        this.formAdd.get('actionId').value.forEach(id => {
          if (item.actionId === id) {
            this.actionResponses.push(item);
          }
        });
      });
      const role: Role = {
        id: null,
        roleId: null,
        roleName: this.formAdd.get('roleName').value,
        createdDate: new Date(),
        actionResponses: this.actionResponses,
        actionId: this.formAdd.get('actionId').value
      };
      this.store.dispatch(new actionRole.AddRole(role));
      this.submitted = false;
      this.isVisibleAdd = false;
      this.submitAdd.emit(this.isVisibleAdd);
      this.formAdd.reset();
    }
  }
}
