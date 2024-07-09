import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { NhomtaikhoanListComponent } from './nhomtaikhoan-list/nhomtaikhoan-list.component';
import {NhomtaikhoanRolesComponent} from './nhomtaikhoan-roles/nhomtaikhoan-roles.component';

const routes: Routes = [
  { path: '', component: NhomtaikhoanListComponent , canActivate: [AuthGuard]},
  { path: 'roles', component: NhomtaikhoanRolesComponent , canActivate: [AuthGuard], data: {
      pagename: 'Group user management',
      breadcrumb: 'Group user management'
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NhomtaikhoanRoutingModule {}
