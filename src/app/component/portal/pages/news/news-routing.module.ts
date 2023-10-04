import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { NewsComponent } from './news.component';
import { EditNewsComponent } from './edit-news/edit-news.component';
const routes: Routes = [
  {
    path: '', component: NewsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'edit-news', component: EditNewsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule {
}
