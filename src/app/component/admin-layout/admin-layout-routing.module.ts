import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminLayoutComponent} from './admin-layout.component';
const routes: Routes = [
  {
    path: 'admin',
    redirectTo: '/admin/welcome',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      /*{
        path: 'user',
        loadChildren: () => import('../user/user.module').then(m => m.UserModule),
        data: {
          pagename: 'users_page_name',
          breadcrumb: 'Users'
        }

      },
      {
        path: 'role',
        loadChildren: () => import('../role/role.module').then(m => m.RoleModule),
        data: {
          pagename: 'roles_page_name',
          breadcrumb: 'Roles'
        }
      },
      {
        path: 'group',
        loadChildren: () => import('../group/group.module').then(m => m.GroupModule),
        data: {
          pagename: 'groups_page_name',
          breadcrumb: 'Groups'
        }
      },
      {
        path: 'menu',
        loadChildren: () => import('../menu/menu.module').then(m => m.MenuModule),
        data: {
          pagename: 'menus_page_name',
          breadcrumb: 'Menus'
        }
      },*/
      {
        path: 'welcome',
        loadChildren: () => import('../../shared/component/page-default/page-default.module').then(s => s.PageDefaultModule),
        data: {
          pagename: 'welcome',
          breadcrumb: 'Welcome'
        },
      },
      {
        path: 'nhansu',
        loadChildren: () => import('../nhansu/nhansu.module').then(m => m.NhansuModule),
        data: {
          pagename: 'Danh sách nhân sự',
          breadcrumb: 'Nhân sự'
        }
      },
      {
        path: 'taikhoan',
        loadChildren: () => import('../taikhoan/taikhoan.module').then(m => m.TaikhoanModule),
        data: {
          pagename: 'Danh sách tài khoản',
          breadcrumb: 'Tài khoản'
        }
      },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule {
}
