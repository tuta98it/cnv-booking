import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import {RatingListComponent} from './rating-list/rating-list.component';
const routes: Routes = [
  {
    path: 'rating-mngt', component: RatingListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RatingRoutingModule {
}
