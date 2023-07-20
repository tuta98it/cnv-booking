import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {  NhansuListComponent } from './nhansu-list/nhansu-list.component';
import {NhansuRoutingModule} from './nhansu-routing.module';
import {GeneralService} from '../../service/general-service';
import { NhansuGroupsComponent } from './nhansu-groups/nhansu-groups.component';

@NgModule({
  declarations: [
    NhansuListComponent,
    NhansuGroupsComponent
  ],
  imports: [
    SharedModule,
    NhansuRoutingModule
  ],
  providers: [GeneralService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class NhansuModule {

}
