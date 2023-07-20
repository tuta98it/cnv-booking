import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import * as groupAction from './group.action';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {Action} from '@ngrx/store';
import {GroupService} from '../../../service/group-service';
import {Group} from '../../../model/group.class';
@Injectable()
export class GroupEffects {
  constructor(
    private actions$: Actions,
    private groupService: GroupService,
  ) {
  }

  @Effect()
  loadGroups$: Observable<Action> = this.actions$.pipe(
    ofType<groupAction.GetGroupLoad>(
      groupAction.GroupAction.GetGroupLoad
    ),
    mergeMap((action: groupAction.GetGroupLoad) =>
      this.groupService.getGroup().pipe(
        map(
          (data: Group[]) =>
            new groupAction.GetGroupSuccess(data)
        ),
        catchError(err => of(new groupAction.GetGroupFail(err)))
      )
    )
  );
  @Effect()
  deleteGroup$: Observable<Action> = this.actions$.pipe(
    ofType<groupAction.DeleteGroup>(
      groupAction.GroupAction.DeleteGroup
    ),
    map((action: groupAction.DeleteGroup) => action.id),
    mergeMap((id: number) =>
      this.groupService.deleteGroup(id).pipe(
        map(() => new groupAction.DeleteGroupSuccess(id))
        ,
        catchError(err => of(new groupAction.DeleteGroupFail(err)))
      ),
    )
  );
  @Effect()
  addGroup$: Observable<Action> = this.actions$.pipe(
    ofType<groupAction.AddGroup>(groupAction.GroupAction.AddGroup),
    map((action: groupAction.AddGroup) => action.group),
    mergeMap((group: Group) =>
      this.groupService.addGroup(group).pipe(map((groupNew: Group) => new groupAction.AddGroupSuccess(groupNew)),
        catchError(err => of(new groupAction.AddGroupFail(err)))
      ),
    )
  );
  @Effect()
  editGroup$: Observable<Action> = this.actions$.pipe(
    ofType<groupAction.UpdateGroup>(groupAction.GroupAction.UpdateGroup),
    map((action: groupAction.UpdateGroup) => action.group),
    mergeMap((group: Group) =>
      this.groupService.updateGroup(group).pipe(map(() =>
        new groupAction.UpdateGroupSuccess({id : group.id, changes: group})),
      catchError(err => of(new groupAction.DeleteGroupFail(err)))
    ),
)
  );
}
