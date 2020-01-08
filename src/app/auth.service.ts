import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
//import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

  public getToken(): string {
    console.log(localStorage.getItem('token'))
    return localStorage.getItem('token');
  }

  public authenticateGit():Observable<any>{
    return this.http.get("https://api.github.com/");
  }
}
