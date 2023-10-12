import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { DataAirlineTicketsComponent } from './data-airline-tickets.component';
const routes: Routes = [
  {
    path: '', component: DataAirlineTicketsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataAirlineTicketsRoutingModule {
}
