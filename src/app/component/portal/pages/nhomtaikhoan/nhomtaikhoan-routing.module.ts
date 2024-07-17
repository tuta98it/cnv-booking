import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { NhomtaikhoanListComponent } from './nhomtaikhoan-list/nhomtaikhoan-list.component';
import {NhomtaikhoanRolesComponent} from './nhomtaikhoan-roles/nhomtaikhoan-roles.component';

const routes: Routes = [
  { path: '', component: NhomtaikhoanListComponent , canActivate: [AuthGuard]},
  { path: 'account-group-list', component: NhomtaikhoanListComponent , canActivate: [AuthGuard], data: {
      pagename: 'Nhóm tài khoản',
      breadcrumb: 'Danh sách nhóm tài khoản'
    }
  },
  { path: 'account-group-permissions', component: NhomtaikhoanRolesComponent , canActivate: [AuthGuard], data: {
    pagename: 'Nhóm tài khoản',
    breadcrumb: 'Phân quyền nhóm tài khoản'
  }
}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NhomtaikhoanRoutingModule {}
