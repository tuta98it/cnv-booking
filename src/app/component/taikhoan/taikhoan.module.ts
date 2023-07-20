import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaikhoanListComponent } from './taikhoan-list/taikhoan-list.component';
import { SharedModule } from '../../shared/shared.module';
import { GeneralService } from '../../service/general-service';
import { TaikhoanRoutingModule } from './taikhoan-routing.module';
import { TaikhoanRolesComponent } from './taikhoan-roles/taikhoan-roles.component';
import { TaikhoanGroupsComponent } from './taikhoan-groups/taikhoan-groups.component';

@NgModule({
  declarations: [TaikhoanListComponent, TaikhoanRolesComponent, TaikhoanGroupsComponent],
  imports: [
    SharedModule,
    TaikhoanRoutingModule
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TaikhoanModule { }
