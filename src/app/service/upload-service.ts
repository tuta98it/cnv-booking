import { Injectable } from '@angular/core';
import { BaseService } from '../shared/base-service/base-service.service';
import { Observable } from 'rxjs';
import { Group } from '../model/group.class';
import {UrlConstant} from '../shared/constants/url.class';

@Injectable()
export class UploadService extends BaseService {
  // hóa đơn vé máy bay
  uploadOrderTicketPdfFile(param: any): Observable<any> {
    return this.post(UrlConstant.UPLOAD + '/UploadOrderTicketPdfFile', param);
  }
  removeOrderTicketPdfFile(id: number): Observable<any> {
    return this.delete(UrlConstant.UPLOAD + '/RemoveOrderTicketPdfFile/' + id, null);
  }
  // hóa đơn đặt khách sạn
  uploadOrderBookingHotelPdfFile(param: any): Observable<any> {
    return this.post(UrlConstant.UPLOAD + '/UploadBookingHotelPdfFile', param);
  }
  removeOrderBookingHotelPdfFile(id: number): Observable<any> {
    return this.delete(UrlConstant.UPLOAD + '/RemoveBookingHotelPdfFile/' + id, null);
  }
  uploadOrderBookingHotelXmlFile(param: any): Observable<any> {
    return this.post(UrlConstant.UPLOAD + '/UploadBookingHotelXmlFile', param);
  }
  removeOrderBookingHotelXmlFile(id: number): Observable<any> {
    return this.delete(UrlConstant.UPLOAD + '/RemoveBookingHotelXmlFile/' + id, null);
  }

  // link đến file theo đường dẫn
  getFile(path: string): string{
    return this.configService.getConfig().api.baseUrl + '/' + path;
  }
}
