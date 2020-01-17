import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service'
import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(request)
    if (request.url !== "https://api.github.com/" && request.url !== "http://localhost:56054/CloudMigration/") {
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

    else if (request.url === "http://localhost:56054/CloudMigration/") {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }
    return next.handle(request);
  }
}
