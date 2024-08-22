import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { PartnerComponent } from './partner.component';
import { ActionPartnerComponent as ActionPartnerComponent } from './action-company/action-partner.component';
import { ActionTypePageVHL } from 'src/app/enums/action-type-page-vhl.enum';

const routes: Routes = [
  { path: '', component: PartnerComponent, canActivate: [AuthGuard] },
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
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRoutingModule { }
