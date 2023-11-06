import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { UtilitHotelComponent } from './utility-hotel.component';
const routes: Routes = [
  {
    path: '', component: UtilitHotelComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilityHotelRoutingModule {
}
