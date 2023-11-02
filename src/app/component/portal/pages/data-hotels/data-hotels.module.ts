
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DataHotelsRoutingModule } from './data-hotels-routing.module';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { GeneralService } from 'src/app/service/general-service';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [],
  imports: [
    DataHotelsRoutingModule,
    SharedModule,
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DataHotelsModule {

}
