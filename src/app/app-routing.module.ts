import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {LoginComponent} from './component/auth/login/login.component';
import {GeneralService} from './service/general-service';
import {SmsLoginComponent} from './component/auth/sms-login/sms-login.component';
// tslint:disable-next-line:max-line-length
import {ConfirmReserveSeatComponent}
from './component/portal/pages/booking-service/airline-ticket-booking-request/confirm-reserve-seat/confirm-reserve-seat.component';
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./component/portal/portal.module').then(m => m.PortalModule)
  },
  {
    path: 'confirm-reserve-seat',
    component: ConfirmReserveSeatComponent,
  },
  {
    path: 'login',
    component: SmsLoginComponent,
    children: [
      {
        path: 'layout',
        loadChildren: () => import('./component/admin-layout/layout.module').then(m => m.LayoutModule),
      },
      {
        path: 'login',
        loadChildren: () => import('./component/auth/auth.module').then(m => m.AuthModule)
      }
    ],
    data: {
      breadcrumb: 'Home',
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [GeneralService],
})
export class AppRoutingModule { }
