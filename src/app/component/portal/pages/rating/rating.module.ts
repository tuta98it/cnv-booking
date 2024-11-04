import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RatingRoutingModule} from './rating-routing.module';
import { RatingListComponent } from './rating-list/rating-list.component';
import {SharedModule} from '../../../../shared/shared.module';
import {DevExtremeModule} from 'devextreme-angular';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzSpinModule} from 'ng-zorro-antd/spin';


@NgModule({
  declarations: [RatingListComponent],
  imports: [
    CommonModule,
    RatingRoutingModule,
    SharedModule,
    DevExtremeModule,
    NzTabsModule,
    NzSpinModule,
  ]
})
export class RatingModule { }
