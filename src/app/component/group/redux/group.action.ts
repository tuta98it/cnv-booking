import {Action} from '@ngrx/store';
import {Group} from '../../../model/group.class';
import {Update} from '@ngrx/entity';
export enum GroupAction {
  GetGroupLoad = '[Group] Get Group',
  GetGroupSuccess= '[Group] Get Group Success',
  GetGroupFail= '[Group] Get Group Fail',
  DeleteGroup = '[Group] Delete Group',
  DeleteGroupSuccess = '[Group] Delete Group Success',
  DeleteGroupFail = '[Group] Delete Group Fail',
  UpdateGroup = '[Group] Update Group',
  UpdateGroupSuccess = '[Group] Update Group Success',
  UpdateGroupFail = '[Group] Update Group Fail',
  AddGroup = '[Group] Add Group',
  AddGroupSuccess = '[Group] Add Group Success',
  AddGroupFail = '[Group] Add Group Fail'
}
export class GetGroupLoad implements Action {
  public readonly type = GroupAction.GetGroupLoad;
}
export class GetGroupSuccess implements Action {
  public readonly  type = GroupAction.GetGroupSuccess;
  constructor(public group: Group []) {}
}
export class GetGroupFail implements Action {
  public readonly type = GroupAction.GetGroupFail;
  constructor(public err: string) {}
}
export class DeleteGroup implements Action {
  public readonly type = GroupAction.DeleteGroup;
  constructor(public id: number) {}
}
export class DeleteGroupSuccess implements Action {
  public readonly type = GroupAction.DeleteGroupSuccess;
  constructor(public id: number) {}
}
export class DeleteGroupFail implements Action {
  public readonly type = GroupAction.DeleteGroupFail;
  constructor(public err: string) {}
}
export class UpdateGroup implements Action {
  public readonly type = GroupAction.UpdateGroup;
  constructor(public group: Group) {}
}
export class UpdateGroupSuccess implements Action {
  public readonly type = GroupAction.UpdateGroupSuccess;
  constructor(public group: Update<Group>) {}
}
export class UpdateGroupFail implements Action {
  public readonly type = GroupAction.UpdateGroupFail;
  constructor(public err: string) {}
}
export class AddGroup implements Action {
  public readonly type = GroupAction.AddGroup;
  constructor(public group: Group) {}
}
export class AddGroupSuccess implements Action {
  public readonly type = GroupAction.AddGroupSuccess;
  constructor(public group: Group) {}
}
export class AddGroupFail implements Action {
  public readonly type = GroupAction.AddGroupFail;
  constructor(public err: string) {}
}
export type GroupActions =
  GetGroupLoad |
  GetGroupSuccess |
  GetGroupFail |
  DeleteGroup |
  DeleteGroupSuccess |
  DeleteGroupFail |
  UpdateGroup |
  UpdateGroupSuccess |
  UpdateGroupFail |
  AddGroup |
  AddGroupSuccess |
  AddGroupFail
  ;
