import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../shared/guards/guards.class';
import {NhansuListComponent} from './nhansu-list/nhansu-list.component';

const routes: Routes = [
  { path: '', component: NhansuListComponent , canActivate: [AuthGuard]}

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NhansuRoutingModule {}
