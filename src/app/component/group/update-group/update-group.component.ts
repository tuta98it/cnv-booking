import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import * as groupAction from '../redux/group.action';
import {Constant} from '../../../shared/constants/constant.class';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActionsSubject, Store} from '@ngrx/store';
import {NotificationService} from '../../../service/notification.service';
import {Group} from '../../../model/group.class';
import * as fromGroup from '../redux/group.reducer';
import {filter} from 'rxjs/operators';
import {GroupAction} from '../redux/group.action';
import {Role} from '../../../model/role.class';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-update-group',
  templateUrl: './update-group.component.html',
  styleUrls: ['./update-group.component.scss']
})
export class UpdateGroupComponent implements OnInit, OnChanges , OnDestroy {
  @Input()isVisibleUpdate: boolean;
  @Input() group: Group;
  @Input() roleUpdate: Role [] = [];
  @Output() submitUpdate: EventEmitter<any> = new EventEmitter();
  formUpdate: FormGroup;
  submitted = false;
  roleResponses: Role [] = [];
  roleIds: string [] = [];
  sub: Subscription;
  constructor(
    private fb: FormBuilder ,
    public store: Store<fromGroup.AppState>,
    private notificationService: NotificationService,
    private actionsSubject$: ActionsSubject
  ) {
    this.formUpdate = fb.group({
      id: null,
      groupName : [null, [ Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      description : [null, [ Validators.maxLength(100)]],
      roleIds : [null , [Validators.required]]
    });
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.sub = this.actionsSubject$.pipe(filter((action: any) => action.type === GroupAction.UpdateGroupSuccess)).subscribe(action => {
      this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
    });
  }
  ngOnChanges(): void {
    this.roleIds = [];
    if (this.group.roleResponses.length > 0) {
       this.group.roleResponses.forEach(item => {
         this.roleIds.push(item.roleId);
       });
    }
    this.formUpdate.patchValue({
      id: this.group.id,
      groupName: this.group.groupName,
      description: this.group.description,
      roleIds: this.roleIds
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
    if (this.formUpdate.valid) {
      this.roleResponses = [];
      this.roleUpdate.filter(item => {
        this.formUpdate.get('roleIds').value.forEach(id => {
          if (item.roleId ===  id) {
            this.roleResponses.push(item);
          }
        });
      });
      const group: Group = {
        id: this.group.id,
        groupId: null,
        groupName: this.formUpdate.get('groupName').value,
        description: this.formUpdate.get('description').value,
        createdDate: new Date(),
        roleResponses: this.roleResponses,
        roleIds: this.formUpdate.get('roleIds').value
      };
      this.store.dispatch(new groupAction.UpdateGroup(group));
      this.isVisibleUpdate = false;
      this.submitUpdate.emit(this.isVisibleUpdate);
      this.submitted = false;
      this.formUpdate.reset();
    }
  }
}
