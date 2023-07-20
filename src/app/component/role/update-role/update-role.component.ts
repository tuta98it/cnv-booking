import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Role} from '../../../model/role.class';
import * as actionRole from '../redux/role.action';
import {ActionsSubject, select, Store} from '@ngrx/store';
import {Constant} from '../../../shared/constants/constant.class';
import {NotificationService} from '../../../service/notification.service';
import * as fromRole from '../redux/role.reducer';
import {filter} from 'rxjs/operators';
import {RoleAction} from '../redux/role.action';
import {Action} from '../../../model/action.model';
import {ActionService} from '../../../service/action.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.scss']
})
export class UpdateRoleComponent implements OnInit , OnChanges , OnDestroy {
  @Input()isVisibleUpdate: boolean;
  @Input()role: Role;
  @Output() submitUpdate: EventEmitter<any> = new EventEmitter();
  formUpdate: FormGroup;
  submitted = false;
  actions: Action[] = [];
  actionId: number[] = [];
  actionResponses: Action[] = [];
  sub: Subscription;
  constructor(
    private fb: FormBuilder ,
    public store: Store<fromRole.AppState>,
    private notificationService: NotificationService,
    private actionsSubject$: ActionsSubject,
    private actionService: ActionService
  ) {
    this.formUpdate = fb.group({
      id: null,
      roleName : [null, [ Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      actionId : [null]
    });
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.sub = this.actionsSubject$.pipe(filter((action: any) => action.type === RoleAction.EditRoleSuccess)).subscribe(action => {
      this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
    });
    this.actionService.getAction().subscribe(res => {
      this.actions = res;
    });
  }
  ngOnChanges(): void {
    this.actionId = [];
    if (this.role.actionResponses.length > 0) {
      this.role.actionResponses.forEach(item => {
        this.actionId.push(item.actionId);
      });
    }
    this.formUpdate.patchValue({
      id: this.role.id,
      roleName: this.role.roleName,
      actionId: this.actionId
    });
  }

  handleCancel() {
    this.submitted = false;
    this.isVisibleUpdate = false;
    this.submitUpdate.emit(this.isVisibleUpdate);
    this.formUpdate.reset();
  }
  get f() { return this.formUpdate.controls; }
  handleOk() {
    this.submitted = true;
    this.actionResponses = [];
    if (this.formUpdate.valid) {
      this.formUpdate.get('actionId').value.filter(id => {
        this.actions.filter(item => {
           if (item.actionId === id) {
             this.actionResponses.push(item);
           }
        });
      });
      const role: Role = {
        id: this.role.id,
        roleId: null,
        roleName: this.formUpdate.get('roleName').value,
        createdDate: this.role.createdDate,
        actionResponses: this.actionResponses,
        actionId: this.formUpdate.get('actionId').value
      };
      this.store.dispatch(new actionRole.EditRole(role));
      this.isVisibleUpdate = false;
      this.submitUpdate.emit(this.isVisibleUpdate);
      this.submitted = false;
      this.formUpdate.reset();
    }
  }

}
