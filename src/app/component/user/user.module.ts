import { NgModule} from '@angular/core';
import {UserComponent} from './user-view/user.component';
import {UserRoutingModule} from './user-routing.module';
import {UserService} from '../../service/user-service';
import {SharedModule} from '../../shared/shared.module';
import { UpdateUserComponent } from './update-user/update-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import {DatePipe} from '@angular/common';
@NgModule({
  declarations: [
    UserComponent,
    UpdateUserComponent,
    AddUserComponent
  ],
  imports: [
    UserRoutingModule,
    SharedModule,
  ],
  providers: [UserService, DatePipe]

})
export class UserModule {

}
