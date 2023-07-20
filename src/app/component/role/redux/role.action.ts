import {Action} from '@ngrx/store';
import {Role} from '../../../model/role.class';
import {Update} from '@ngrx/entity';


export enum RoleAction {
  GetRoleLoad = '[Role] Get Role',
  GetRoleSuccess= '[Role] Get Role Success',
  GetRoleFail= '[Role] Get Role Fail',
  DeleteRole = '[Role] Delete Role',
  DeleteRoleSuccess = '[Role] Delete Role Success',
  DeleteRoleFail = '[Role] Delete Role Fail',
  AddRole = '[Role] Add Role',
  AddRoleSuccess = '[Role] Add Role Success',
  AddRoleFail = '[Role] Add Role Fail',
  EditRole = '[Role] Edit Role',
  EditRoleSuccess = '[Role] Edit Role Success',
  EditRoleFail = '[Role] Edit Role Fail'
}
export class GetRoleLoad implements Action {
  public readonly type = RoleAction.GetRoleLoad;
}
export class GetRoleSuccess implements Action {
  public readonly  type = RoleAction.GetRoleSuccess;
  constructor(public role: Role []) {}
}
export class GetRoleFail implements Action {
  public readonly  type = RoleAction.GetRoleFail;
  constructor(public err: string) {}
}
export class DeleteRole implements Action {
  public readonly  type = RoleAction.DeleteRole;
  constructor(public payload: number) {}
}
export class DeleteRoleSuccess implements Action {
  public readonly  type = RoleAction.DeleteRoleSuccess;
  constructor(public payload: number) {}
}
export class DeleteRoleFail implements Action {
  public readonly  type = RoleAction.DeleteRoleFail;
  constructor(public err: string) {}
}
export class AddRole implements Action {
  public readonly type = RoleAction.AddRole;
  constructor(public payload: Role) {}
}
export class AddRoleSuccess implements Action {
  public readonly type = RoleAction.AddRoleSuccess;
  constructor(public payload: Role) {}
}
export class AddRoleFail implements Action {
  public readonly  type = RoleAction.AddRoleFail;
  constructor(public err: string) {}
}
export class EditRole implements Action {
  public readonly type = RoleAction.EditRole;
  constructor(public payload: Role) {}
}
export class EditRoleSuccess implements Action {
  public readonly type = RoleAction.EditRoleSuccess;
  constructor(public payload: Update<Role>) {}
}
export class EditRoleFail implements Action {
  public readonly  type = RoleAction.EditRoleFail;
  constructor(public err: string) {}
}
export type RoleActions =
  GetRoleLoad |
  GetRoleSuccess|
  GetRoleFail |
  DeleteRole |
  DeleteRoleSuccess |
  DeleteRoleFail |
  AddRole |
  AddRoleSuccess |
  AddRoleFail |
  EditRole |
  EditRoleSuccess |
  EditRoleFail
  ;
