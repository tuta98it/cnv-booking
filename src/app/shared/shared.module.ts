import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DateFormatPipe } from './pipe/format-date.pipe';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NotificationService } from '../service/notification.service';
import { I18nModule } from '../i18n/i18n.module';
import { SelectLanguageComponent } from './component/select-language/select-language.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CurrencyFormatPipe } from './pipe/currency-format.pipe';
import { ImageFormatPipe } from './pipe/image-format.pipe';
import { QRCodeModule } from 'angularx-qrcode';
import { OrderStatusFormatPipe } from './pipe/order-status-format.pipe';
import { FullNameFormatPipe } from './pipe/fullname-format.pipe';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { IsEmptyPipe } from './pipe/is-empty.pipe';
import { MViewPdfComponent } from './component/m-view-pdf/m-view-pdf.component';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BookingHotelStatusPipe } from './pipe/booking-hotel-status.pipe';
import { DxDateBoxModule } from 'devextreme-angular';
import { PassengerTypesPipe } from './pipe/passenger-type.pipe';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { TypeTicketPipe } from './pipe/type-ticket.pipe';
import { AirlinePipe } from './pipe/airline.pipe';
import { AirportPipe } from './pipe/airport.pipe';
import { GenderPipe } from './pipe/gender.pipe';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UserTypePipe } from './pipe/user-type.pipe';
import { PartnerStatusPipe } from './pipe/partner-status.pipe';
import { EmployeePipe } from './pipe/employeePipe.pipe';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import { HotelBookingPipe } from './pipe/hotel-booking.pipe';
import { FileNamePipe } from './pipe/file-name.pipe';
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
    NzAlertModule,
    NzImageModule,
    NzMessageModule,
    NzSwitchModule,
    NzRateModule,
    NzCheckboxModule,
    NzToolTipModule,
    NzProgressModule,
    DxDateBoxModule,
    AngularEditorModule,
    NzRadioModule,
    NzTabsModule
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
    NzLayoutModule,
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
    IsEmptyPipe,
    NzInputNumberModule,
    QRCodeModule,
    NzUploadModule,
    NzCheckboxModule,
    NzToolTipModule,
    NzProgressModule,
    NzAlertModule,
    MViewPdfComponent,
    NzImageModule,
    NzMessageModule,
    NzSwitchModule,
    NzRateModule,
    AngularEditorModule,
    DxDateBoxModule,
    BookingHotelStatusPipe,
    PassengerTypesPipe,
    TypeTicketPipe,
    AirlinePipe,
    AirportPipe,
    GenderPipe,
    UserTypePipe,
    PartnerStatusPipe,
    EmployeePipe,
    NzRadioModule,

    NzRadioModule,
    HotelBookingPipe,
    FileNamePipe
  ],
  declarations: [
    DateFormatPipe,
    SelectLanguageComponent,
    CurrencyFormatPipe,
    ImageFormatPipe,
    FullNameFormatPipe,
    OrderStatusFormatPipe,
    IsEmptyPipe,
    BookingHotelStatusPipe,
    PassengerTypesPipe,
    TypeTicketPipe,
    AirlinePipe,
    AirportPipe,
    GenderPipe,
    UserTypePipe,
    PartnerStatusPipe,
    EmployeePipe,
    MViewPdfComponent,
    HotelBookingPipe,
    FileNamePipe
  ],
  providers: [NotificationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
}
