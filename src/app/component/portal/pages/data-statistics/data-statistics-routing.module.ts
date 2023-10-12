import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { DataStatisticsComponent } from './data-statistics.component';
const routes: Routes = [
  {
    path: '', component: DataStatisticsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataStatisticsRoutingModule {
}
