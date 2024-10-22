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
        path: 'employee-management',
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
        path: 'group-management',
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
        path: 'companies',
        loadChildren: () =>
          import('./pages/partner/partner.module').then(
            (m) => m.PartnerModule
          ),
        data: {
          pagename: 'Quản lý khách hàng',
          breadcrumb: 'Danh sách doanh nghiệp',
        },
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
        path: 'booking-service',
        loadChildren: () =>
          import('./pages/booking-service/booking-service.module').then(
            (m) => m.BookingServiceModule
          ),
        data: {
          pagename: 'Danh sách book vé',
          breadcrumb: 'Danh sách book vé',
        },
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
        loadChildren: () =>
          import('./pages/hotel/hotel.module').then(m => m.HotelModule),
        data: {
          pagename: 'DS khách sạn',
          breadcrumb: 'DS khách sạn'
        }
      },
      {
        path: 'booking-hotel',
        loadChildren: () =>
          import('./pages/booking-hotel/booking-hotel.module').then(m => m.BookingHotelModule),
        data: {
          pagename: 'QL khách sạn',
          breadcrumb: 'QL khách sạn'
        }
      },
      {
        path: 'news',
        loadChildren: () => import('./pages/news/news.module').then(m => m.NewsModule),
        data: {
          pagename: 'Tin tức',
          breadcrumb: 'Tin tức'
        }
      },
      {
        path: 'data-statistics',
        loadChildren: () => import('./pages/data-statistics/data-statistics.module').then(m => m.DataStatisticsModule),
        data: {
          pagename: 'Thông kê dữ liệu',
          breadcrumb: 'Thông kê dữ liệu'
        }
      },
      {
        path: 'data-statistics/airline-ticket-booking',
        loadChildren: () => import('./pages/data-airline-tickets/data-airline-tickets.module').then(m => m.DataAirlineTicketsModule),
        data: {
          pagename: 'Bảng kê chi tiết',
          breadcrumb: 'Bảng kê chi tiết vé máy bay'
        }
      },
      {
        path: 'data-statistics/accommodation-booking',
        loadChildren: () => import('./pages/data-hotels/data-hotels.module').then(m => m.DataHotelsModule),
        data: {
          pagename: 'Bảng kê chi tiết',
          breadcrumb: 'Bảng kê chi tiết khách sạn'
        }
      },
      {
        path: 'utility-hotel',
        loadChildren: () => import('./pages/utility/utility-hotel/utility-hotel.module').then(m => m.UtilityHotelModule),
        data: {
          pagename: 'Tiện ích',
          breadcrumb: 'Tiện ích khách sạn'
        }
      },
      {
        path: 'utility-room',
        loadChildren: () => import('./pages/utility/utility-room/utility-room.module').then(m => m.UtilityRoomModule),
        data: {
          pagename: 'Tiện ích',
          breadcrumb: 'Tiện ích phòng'
        }
      },
      {
        path: 'notifications',
        loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsModule),
        data: {
          pagename: 'Trang chủ',
          breadcrumb: 'Danh sách thông báo'
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
