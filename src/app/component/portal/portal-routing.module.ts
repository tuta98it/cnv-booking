import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MasterPageComponent} from './master-page/master-page.component';
import {RoleComponent} from './pages/role/role.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import { PartnerComponent } from './pages/partner/partner.component';

const routes: Routes = [
  {
    path: '', component: MasterPageComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {
          pagename: 'Dashboard Management',
          breadcrumb: 'Dashboard Management'
        }
      },
      {
        path: 'role',
        component: RoleComponent,
        data: {
          pagename: 'Role Management',
          breadcrumb: 'Role Management'
        }
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          pagename: 'Dashboard Management',
          breadcrumb: 'Dashboard Management'
        }
      },
      {
        path: 'tai-khoan',
        loadChildren: () =>
          import('./pages/taikhoan/taikhoan.module').then(
            (m) => m.TaikhoanModule
          ),
        data: {
          pagename: 'Tài khoản',
          breadcrumb: 'Tài khoản',
        },
      },
      {
        path: 'nhom-tai-khoan',
        loadChildren: () =>
          import('./pages/nhomtaikhoan/nhomtaikhoan.module').then(
            (m) => m.NhomtaikhoanModule
          ),
        data: {
          pagename: 'Tài khoản',
          breadcrumb: 'Tài khoản',
        },
      },
      {
        path: 'system',
        loadChildren: () =>
          import('./pages/system/system.module').then(
            (m) => m.SystemModule
          ),
        data: {
          pagename: 'Hệ thống',
          breadcrumb: 'Hệ thống',
        },
      },
      {
        path: 'doi-tac',
        component: PartnerComponent,
        data: {
          pagename: 'Đối tác',
          breadcrumb: 'Đối tác'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule {
}
