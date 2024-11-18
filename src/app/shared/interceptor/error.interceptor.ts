import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, retry} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Constant} from '../constants/constant.class';
import {LoaderService} from '../../service/loader.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  constructor(private router: Router, private loaderService: LoaderService) {
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const excludedUrl = '/confirm-reserve-seat'; // Định nghĩa route mà bạn muốn bỏ qua xác thực
    const requestUrl = this.router.routerState.snapshot.url;
    if (requestUrl.includes(excludedUrl)) {
      // Bỏ qua kiểm tra xác thực cho route này
      return next.handle(req);
    }
    if (!req.headers.get('skipLoading')) {
      this.totalRequests++;
      this.loaderService.show();
    }
    return next.handle(req).pipe(
      retry(1),

      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem(Constant.TOKEN);
          localStorage.removeItem(Constant.USER_INFO);
          const url = this.router.routerState.snapshot.url;
          this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
          return throwError(error);
        } else if (error.status === 403) {
          this.router.navigate(['/login']);
          return throwError(error);
        } else if (error.status === 404) {
          this.router.navigate(['/page-not-found']);
        }
        return throwError(error);
      }),
       finalize(() => {
        if (!req.headers.get('skipLoading')) {
          this.totalRequests--;
        }
        if (this.totalRequests === 0) {
          this.loaderService.hide();
        }
      })
    );
  }
}
