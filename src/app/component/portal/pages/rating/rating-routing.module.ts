import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import {RatingListComponent} from './rating-list/rating-list.component';
import {RatingReportComponent} from './rating-report/rating-report.component';
const routes: Routes = [
  {
    path: 'rating-mngt', component: RatingListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'report', component: RatingReportComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RatingRoutingModule {
}
