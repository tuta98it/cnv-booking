import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhomtaikhoanListComponent } from './nhomtaikhoan-list/nhomtaikhoan-list.component';
import { NhomtaikhoanRoutingModule } from './nhomtaikhoan-routing.module';
import { NhomtaikhoanUsersComponent } from './nhomtaikhoan-users/nhomtaikhoan-users.component';
import { NhomtaikhoanRolesComponent } from './nhomtaikhoan-roles/nhomtaikhoan-roles.component';
import {SharedModule} from '../../../../shared/shared.module';
import {GeneralService} from '../../../../service/general-service';



@NgModule({
  declarations: [
    NhomtaikhoanListComponent,
    NhomtaikhoanUsersComponent,
    NhomtaikhoanRolesComponent,
  ],
  imports: [
    SharedModule,
    NhomtaikhoanRoutingModule,
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NhomtaikhoanModule { }
