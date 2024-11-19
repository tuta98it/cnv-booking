import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { PartnerComponent } from './partner.component';
import { ActionPartnerComponent as ActionPartnerComponent } from './action-company/action-partner.component';
import { ActionTypePageVHL } from 'src/app/enums/action-type-page-vhl.enum';
import { PartnerConfig } from 'src/app/shared/constants/constant.class';

const routes: Routes = [
  {
    path: '', component: PartnerComponent, canActivate: [AuthGuard]
  },
  {
    path: 'create', component: ActionPartnerComponent, canActivate: [AuthGuard], data: {
      pagename: 'Danh sách doanh nghiệp',
      breadcrumb: 'Thêm mới',
      type: ActionTypePageVHL.Create
    }
  },
  {
    path: 'update', component: ActionPartnerComponent, canActivate: [AuthGuard], data: {
      pagename: 'Danh sách doanh nghiệp',
      breadcrumb: 'Cập nhật',
      type: ActionTypePageVHL.Update
    }
  },
  {
    path: "update-account-info", component: ActionPartnerComponent, canActivate: [AuthGuard], data: {
      pagename: 'Danh sách doanh nghiệp',
      breadcrumb: 'Cập nhật',
      type: ActionTypePageVHL.Update
    }
  },
  {
    path: "update-request-deposit-account", component: ActionPartnerComponent, canActivate: [AuthGuard], data: {
      pagename: 'Danh sách doanh nghiệp',
      breadcrumb: 'Cập nhật',
      type: ActionTypePageVHL.Update
    }
  },
  {
    path: 'employee-action',
    loadChildren: () =>
      import('../upgraed-employee/upgrade-employee.module').then(
        (m) => m.UpgradeEmployeeModule
      ),
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class PartnerRoutingModule { }
