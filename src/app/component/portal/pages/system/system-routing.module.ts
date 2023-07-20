import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../../../shared/guards/guards.class';
import {LogComponent} from './log/log.component';

const routes: Routes = [
  { path: 'log', component: LogComponent , canActivate: [AuthGuard]},
  /*{ path: 'roles', component: NhomtaikhoanRolesComponent , canActivate: [AuthGuard], data: {
      pagename: 'Phân quyền nhóm tài khoản',
      breadcrumb: 'Phân quyền'
    }
  }*/
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}
