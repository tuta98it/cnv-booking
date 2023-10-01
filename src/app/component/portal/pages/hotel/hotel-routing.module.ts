import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { HotelComponent } from './hotel.component';
import { EditHotelComponent } from './edit-hotel/edit-hotel.component';
const routes: Routes = [
  {
    path: '', component: HotelComponent,
    canActivate: [AuthGuard],
    // children: [
    //   {
    //     path: 'edit-hotel',
    //     component: EditHotelComponent,
    //     data: {
    //       pagename: 'Edit Hotel',
    //       breadcrumb: 'Edit Hotel'
    //     }
    //   },
    // ]
  },
  { path: 'edit-hotel', component: EditHotelComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelRoutingModule {
}
