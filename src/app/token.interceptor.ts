import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service'
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(request)
    if (request.url !== "https://api.github.com/" && request.url !== environment.cmsapiendpoint + "CloudMigration/" && request.url !== environment.cmsapiendpoint + "CloudMigration/GetStatus") {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${this.auth.getToken()}`,
          'Content-Type': 'application/json'
        }
      });
    }
    else if (request.url === "https://api.github.com/") {
      let username = localStorage.getItem("gitUsername");
      let password = localStorage.getItem("gitPassword");
      request = request.clone({
        setHeaders: {
          'Authorization': 'Basic ' + btoa(username + ':' + password),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    }

    else if (request.url === environment.cmsapiendpoint + "CloudMigration/") {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }
    return next.handle(request);
  }
}
