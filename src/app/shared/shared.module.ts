import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {DateFormatPipe} from './pipe/format-date.pipe';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { NzNotificationModule } from 'ng-zorro-antd/notification';
import {NotificationService} from '../service/notification.service';
import {I18nModule} from '../i18n/i18n.module';
import { SelectLanguageComponent } from './component/select-language/select-language.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import {CurrencyFormatPipe} from './pipe/currency-format.pipe';
import {ImageFormatPipe} from './pipe/image-format.pipe';
import {QRCodeModule} from 'angularx-qrcode';
import {OrderStatusFormatPipe} from './pipe/order-status-format.pipe';
import {FullNameFormatPipe} from './pipe/fullname-format.pipe';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzModalModule, NzModalService} from 'ng-zorro-antd/modal';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzAlertModule} from 'ng-zorro-antd/alert';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzTableModule,
    NzPaginationModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzModalModule,
    NzIconModule,
    NzLayoutModule,
    ScrollingModule,
    NzCollapseModule,
    NzNotificationModule,
    I18nModule,
    NzFormModule,
    NzResultModule,
    NzDropDownModule,
    NzDatePickerModule,
    ScrollingModule,
    NzInputNumberModule,
    QRCodeModule,
    NzTagModule,
    NzUploadModule,
    NzCheckboxModule,
    NzAlertModule
  ],
  exports: [
    DateFormatPipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzTableModule,
    NzPaginationModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzTagModule,
    NzModalModule,
    NzIconModule,
    NzCollapseModule,
    NzNotificationModule,
    I18nModule,
    SelectLanguageComponent,
    NzFormModule,
    NzResultModule,
    NzDropDownModule,
    NzDatePickerModule,
    ScrollingModule,
    CurrencyFormatPipe,
    ImageFormatPipe,
    FullNameFormatPipe,
    OrderStatusFormatPipe,
    NzInputNumberModule,
    QRCodeModule,
    NzUploadModule,
    NzCheckboxModule,
    NzAlertModule
  ],
  declarations: [
    DateFormatPipe,
    SelectLanguageComponent,
    CurrencyFormatPipe,
    ImageFormatPipe,
    FullNameFormatPipe,
    OrderStatusFormatPipe,
  ],
  providers: [NotificationService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule {
}
