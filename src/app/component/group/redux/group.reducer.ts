import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Group} from '../../../model/group.class';
import * as fromRoot from '../../app-state/app-state';
import * as groupAction from './group.action';
import {createFeatureSelector, createSelector} from '@ngrx/store';
interface GroupState extends EntityState<Group> {
  selectedGroupId: number | null;
  loading: boolean;
  error: string;
}
export interface AppState extends fromRoot.AppState {
  groups: GroupState;
}
export function sortById(a: Group, b: Group): number {
  return (b.id > a.id) ? 1 : -1;
}
export const groupAdapter: EntityAdapter<Group> = createEntityAdapter<Group>({
  sortComparer : sortById
});
export const defaultGroup: GroupState = {
  ids: [],
  entities: {},
  selectedGroupId: null,
  loading: false,
  error: ''
};
export const initialState = groupAdapter.getInitialState(defaultGroup);
export function groupReducer(
  state = initialState,
  action: groupAction.GroupActions
): GroupState {
  switch (action.type) {
    case groupAction.GroupAction.GetGroupSuccess: {
      return groupAdapter.setAll(action.group, {
        ...state,
        loading: false,
        loaded: true
      });
    }
    case groupAction.GroupAction.GetGroupFail: {
      return {
        ...state,
        entities: {},
        loading: false,
        error: action.type
      };
    }
    case groupAction.GroupAction.UpdateGroupSuccess: {
      return groupAdapter.updateOne(action.group, state);
    }
    case groupAction.GroupAction.UpdateGroupFail: {
      return {
        ...state,
        error: action.err
      };
    }
    case groupAction.GroupAction.AddGroupSuccess: {
      return groupAdapter.addOne(action.group, state);
    }
    case groupAction.GroupAction.AddGroupFail: {
      return {
        ...state,
        error: action.err
      };
    }
    case groupAction.GroupAction.DeleteGroupSuccess: {
      return groupAdapter.removeOne(action.id, state);
    }
    case groupAction.GroupAction.DeleteGroupFail: {
      return {
        ...state,
        error: action.err
      };
    }
    default: {
      return state;
    }
  }
}
const getGroupFeatureState = createFeatureSelector<GroupState>(
  'groups'
);
export const getGroup = createSelector(
  getGroupFeatureState,
  groupAdapter.getSelectors().selectAll
);

export const getGroupsLoading = createSelector(
  getGroupFeatureState,
  (state: GroupState) => state.loading
);

export const getError = createSelector(
  getGroupFeatureState,
  (state: GroupState) => state.error
);
