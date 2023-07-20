import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {AppConfigService} from 'src/app-config.service';

@Directive({
  selector: 'button[appDownloadFile]'
})
export class DownloadFileDirective {

  @Input('appDownloadFile') url : string;
  baseImageUrl: string;

  @Input() fileName?: string;

  constructor(
    private configService: AppConfigService,
    private el: ElementRef) {
    this.baseImageUrl = this.configService.getConfig().api.baseUrl;
  }

  @HostListener('click', ['$event.target']) onClick(el) {
    saveAs(this.baseImageUrl + this.url, this.fileName);
  }

}
