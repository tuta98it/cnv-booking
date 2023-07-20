import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RoleRoutingModule} from './role-routing.module';
import {RoleComponent} from './role-view/role.component';
import {RoleService} from '../../service/role-service';
import {SharedModule} from '../../shared/shared.module';
import { AddRoleComponent } from './add-role/add-role.component';
import { UpdateRoleComponent } from './update-role/update-role.component';
import {StoreModule} from '@ngrx/store';
import {roleReducer} from './redux/role.reducer';
import {EffectsModule} from '@ngrx/effects';
import {RoleEffects} from './redux/role.effects';
import {ActionService} from '../../service/action.service';
@NgModule({
  declarations: [
    RoleComponent,
    AddRoleComponent,
    UpdateRoleComponent
  ],
  imports: [
    RoleRoutingModule,
    SharedModule,
    StoreModule.forFeature(
      'roles', roleReducer
    ),
    EffectsModule.forFeature([RoleEffects])
  ],
  providers: [RoleRoutingModule, RoleService, ActionService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class RoleModule {

}
