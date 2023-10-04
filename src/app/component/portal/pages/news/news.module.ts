
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NewsRoutingModule } from './news-routing.module';
import { EditNewsComponent } from './edit-news/edit-news.component';
import { GeneralService } from 'src/app/service/general-service';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [EditNewsComponent],
  imports: [
    NewsRoutingModule,
    SharedModule,
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NewsModule {

}
