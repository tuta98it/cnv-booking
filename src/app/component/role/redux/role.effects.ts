import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import * as roleAction from './role.action';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {Action} from '@ngrx/store';
import {RoleService} from '../../../service/role-service';
import {Role} from '../../../model/role.class';
@Injectable()
export class RoleEffects {
  constructor(
    private actions$: Actions,
    private roleService: RoleService,
  ) {
  }

  @Effect()
  loadRoles$: Observable<Action> = this.actions$.pipe(
    ofType<roleAction.GetRoleLoad>(
      roleAction.RoleAction.GetRoleLoad
    ),
    mergeMap((action: roleAction.GetRoleLoad) =>
      this.roleService.getRole().pipe(
        map(
          (data: Role[]) =>
            new roleAction.GetRoleSuccess(data)
        ),
        catchError(err => of(new roleAction.GetRoleFail(err)))
      )
    )
  );

  @Effect()
  deleteRole$: Observable<Action> = this.actions$.pipe(
    ofType<roleAction.DeleteRole>(
      roleAction.RoleAction.DeleteRole
    ),
    map((action: roleAction.DeleteRole) => action.payload),
    mergeMap((id: number) =>
      this.roleService.deleteRole(id).pipe(
        map(() => new roleAction.DeleteRoleSuccess(id)),
        catchError(err => of(new roleAction.DeleteRoleFail(err)))
      ),
    )
  );
  @Effect()
  addRole$: Observable<Action> = this.actions$.pipe(
    ofType<roleAction.AddRole>(roleAction.RoleAction.AddRole),
    map((action: roleAction.AddRole) => action.payload),
    mergeMap((role: Role) =>
      this.roleService.addRole(role).pipe(map((roleNew: Role) => new roleAction.AddRoleSuccess(roleNew)),
        catchError(err => of(new roleAction.AddRoleFail(err)))
      ),
    )
  );

  @Effect()
  editRole$: Observable<Action> = this.actions$.pipe(
    ofType<roleAction.EditRole>(roleAction.RoleAction.EditRole),
    map((action: roleAction.EditRole) => action.payload),
    mergeMap((role: Role) =>
      this.roleService.updateRole(role).pipe(map(() =>
        new roleAction.EditRoleSuccess({id : role.id, changes: role})),
        catchError(err => of(new roleAction.DeleteRoleFail(err)))
        ),
    )
  );
}
