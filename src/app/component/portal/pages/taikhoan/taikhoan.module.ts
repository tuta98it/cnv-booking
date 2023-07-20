import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaikhoanListComponent } from './taikhoan-list/taikhoan-list.component';
import { TaikhoanRoutingModule } from './taikhoan-routing.module';
import { TaikhoanRolesComponent } from './taikhoan-roles/taikhoan-roles.component';
import { GeneralService } from 'src/app/service/general-service';
import { SharedModule } from 'src/app/shared/shared.module';
import {NhomtaikhoanModule} from '../nhomtaikhoan/nhomtaikhoan.module';
import {DxDataGridModule} from 'devextreme-angular';



@NgModule({
  declarations: [TaikhoanListComponent, TaikhoanRolesComponent],
  imports: [
    SharedModule,
    TaikhoanRoutingModule,
    NhomtaikhoanModule,
    DxDataGridModule,
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TaikhoanModule { }
