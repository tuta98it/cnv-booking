import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { TaikhoanListComponent } from './taikhoan-list/taikhoan-list.component';
import { TaikhoanRolesComponent } from './taikhoan-roles/taikhoan-roles.component';

const routes: Routes = [
  { path: '', component: TaikhoanListComponent , canActivate: [AuthGuard]},
  { path: 'roles', component: TaikhoanRolesComponent , canActivate: [AuthGuard], data: {
    pagename: 'User role',
    breadcrumb: 'List role'
  }
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaikhoanRoutingModule {}
