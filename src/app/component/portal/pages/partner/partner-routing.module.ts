import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { PartnerComponent } from './partner.component';
import { CreatePartnerComponent } from './create-company/create-partner.component';

const routes: Routes = [
  { path: '', component: PartnerComponent, canActivate: [AuthGuard] },
  {
    path: 'create', component: CreatePartnerComponent, canActivate: [AuthGuard], data: {
      pagename: 'Danh sách doanh nghiệp',
      breadcrumb: 'Thêm mới'
    }
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRoutingModule { }
