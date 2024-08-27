import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { ActionTypePageVHL } from 'src/app/enums/action-type-page-vhl.enum';
import { UpgradeEmployeeComponent } from './upgrade-employee.component';

const routes: Routes = [
  {
    path: 'create', component: UpgradeEmployeeComponent, canActivate: [AuthGuard], data: {
      type: ActionTypePageVHL.Create,
      pagename: 'Danh sách nhân viên',
      breadcrumb: 'Thêm mới',
    }
  },
  {
    path: 'update', component: UpgradeEmployeeComponent, canActivate: [AuthGuard], data: {
      type: ActionTypePageVHL.Update,
      pagename: 'Danh sách nhân viên',
      breadcrumb: 'Cập nhật',
    }
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpgradeEmployeeRoutingModule { }
