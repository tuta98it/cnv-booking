import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhomtaikhoanListComponent } from './nhomtaikhoan-list/nhomtaikhoan-list.component';
import {NhomtaikhoanRolesComponent} from './nhomtaikhoan-roles/nhomtaikhoan-roles.component';
import {AuthGuard} from '../../../../shared/guards/guards.class';

const routes: Routes = [
  { path: '', component: NhomtaikhoanListComponent , canActivate: [AuthGuard]},
  { path: 'roles', component: NhomtaikhoanRolesComponent , canActivate: [AuthGuard], data: {
      pagename: 'Phân quyền nhóm tài khoản',
      breadcrumb: 'Phân quyền'
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NhomtaikhoanRoutingModule {}
