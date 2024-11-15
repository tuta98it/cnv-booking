import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RatingRoutingModule} from './rating-routing.module';
import { RatingListComponent } from './rating-list/rating-list.component';
import {SharedModule} from '../../../../shared/shared.module';
import {DevExtremeModule} from 'devextreme-angular';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import { RatingReportComponent } from './rating-report/rating-report.component';
import {NgApexchartsModule} from 'ng-apexcharts';


@NgModule({
  declarations: [RatingListComponent, RatingReportComponent],
  imports: [
    CommonModule,
    RatingRoutingModule,
    SharedModule,
    DevExtremeModule,
    NzTabsModule,
    NzSpinModule,
    NgApexchartsModule,
  ]
})
export class RatingModule { }
