import { Injectable } from '@angular/core';
import { BaseService } from '../shared/base-service/base-service.service';
import { Observable } from 'rxjs';
import { Group } from '../model/group.class';
import {UrlConstant} from '../shared/constants/url.class';

@Injectable()
export class UploadService extends BaseService {
  uploadOrderTicketPdfFile(param: any): Observable<any> {
    return this.post(UrlConstant.UPLOAD + '/UploadOrderTicketPdfFile', param);
  }
  removeOrderTicketPdfFile(id: number): Observable<any> {
    return this.delete(UrlConstant.UPLOAD + '/RemoveOrderTicketPdfFile/' + id, null);
  }
  getFile(path: string): string{
    return this.configService.getConfig().api.baseUrl + '/' + path;
  }
}
