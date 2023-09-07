import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterPageComponent } from './master-page/master-page.component';
import { RoleComponent } from './pages/role/role.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PartnerComponent } from './pages/partner/partner.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { AdminTicketComponent } from './pages/admin-ticket/admin-ticket.component';
import { AdminVoidTicketComponent } from './pages/admin-void-ticket/admin-void-ticket.component';
import { AdminHistoryHoldingTicketComponent } from './pages/admin-history-holding-ticket/admin-history-holding-ticket.component';
import { HotelComponent } from './pages/hotel/hotel.component';
import { NewsComponent } from './pages/news/news.component';

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
      {
        path: 'admin-history-holding-ticket',
        component: AdminHistoryHoldingTicketComponent,
        data: {
          pagename: 'Quản lý giữ vé',
          breadcrumb: 'Quản lý giữ vé'
        }
      },


      {
        path: 'admin-ticket',
        component: AdminTicketComponent,
        data: {
          pagename: 'Xuất vé',
          breadcrumb: 'Xuất vé'
        }
      },
      {
        path: 'user-register',
        component: UserRegisterComponent,
        data: {
          pagename: 'Tài khoản đăng kí',
          breadcrumb: 'Tài khoản đăng kí'

        }
      },
      {
        path: 'admin-void-ticket',
        component: AdminVoidTicketComponent,
        data: {
          pagename: 'Huỷ vé',
          breadcrumb: 'Huỷ vé'
        }
      },
      {
        path: 'hotel',
        component: HotelComponent,
        data: {
          pagename: 'Đặt phòng',
          breadcrumb: 'Đặt phòng'
        }
      },
      {
        path: 'news',
        component: NewsComponent,
        data: {
          pagename: 'Tin tức',
          breadcrumb: 'Tin tức'
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
