import { NgModule} from '@angular/core';
import {PageDefaultComponent} from './page-default.component';
import {PageDefaultRoutingModule} from './page-defualt-routing.module';
import { NzResultModule } from 'ng-zorro-antd/result';

@NgModule({
  declarations: [
   PageDefaultComponent
  ],
  imports: [
    PageDefaultRoutingModule,
    NzResultModule
  ],
  providers: []

})
export class PageDefaultModule {

}
