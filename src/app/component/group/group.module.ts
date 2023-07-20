import { FilterPipe } from './../../shared/pipe/custom-filter.pipe';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {GroupRoutingModule} from './group-routing.module';
import {GroupService} from '../../service/group-service';
import {StoreModule} from '@ngrx/store';
import { AddGroupComponent } from './add-group/add-group.component';
import { UpdateGroupComponent } from './update-group/update-group.component';
import {SharedModule} from '../../shared/shared.module';
import {groupReducer} from './redux/group.reducer';
import {EffectsModule} from '@ngrx/effects';
import {GroupEffects} from './redux/group.effects';
@NgModule({
  declarations: [
  AddGroupComponent,
  UpdateGroupComponent, FilterPipe],
  imports: [GroupRoutingModule,
    SharedModule,
    StoreModule.forFeature(
      'groups', groupReducer
    ), EffectsModule.forFeature([GroupEffects])],

  providers: [GroupService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class GroupModule {

}
