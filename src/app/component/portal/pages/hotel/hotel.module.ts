import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HotelRoutingModule } from './hotel-routing.module';
import { EditHotelComponent } from './edit-hotel/edit-hotel.component';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { GeneralService } from 'src/app/service/general-service';
import { SharedModule } from 'src/app/shared/shared.module';
import { HotelListComponent } from './hotel-list/hotel-list.component';
// @ts-ignore
import {DevExtremeModule} from 'devextreme-angular';
import { HotelEditComponent } from './hotel-edit/hotel-edit.component';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import { RoomEditComponent } from './room-edit/room-edit.component';
@NgModule({
  declarations: [EditHotelComponent, HotelListComponent, HotelEditComponent, RoomEditComponent],
  imports: [
    HotelRoutingModule,
    SharedModule,
    DevExtremeModule,
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HotelModule {

}
