import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { HotelComponent } from './hotel.component';
import { EditHotelComponent } from './edit-hotel/edit-hotel.component';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { HotelEditComponent } from './hotel-edit/hotel-edit.component';
import { RoomEditComponent } from './room-edit/room-edit.component';
import { ActionTypePageVHL } from 'src/app/enums/action-type-page-vhl.enum';
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
  {
    path: 'list', component: HotelListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'edit-hotel', component: HotelEditComponent, canActivate: [AuthGuard] },
  { path: 'edit-hotel-old', component: EditHotelComponent, canActivate: [AuthGuard] },
  { path: 'edit-hotel/:id', component: HotelEditComponent, canActivate: [AuthGuard], data: { type: ActionTypePageVHL.Update } },
  { path: 'view-hotel/:id', component: HotelEditComponent, canActivate: [AuthGuard], data: { type: ActionTypePageVHL.View } },
  { path: 'edit-room/:hotelId', component: RoomEditComponent, canActivate: [AuthGuard] },
  { path: 'edit-room/:hotelId/:id', component: RoomEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelRoutingModule {
}
