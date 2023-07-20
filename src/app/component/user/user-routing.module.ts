import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserComponent} from './user-view/user.component';
import {AuthGuard} from '../../shared/guards/guards.class';



const routes: Routes = [
  { path: '', component: UserComponent, canActivate: [AuthGuard] }

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
