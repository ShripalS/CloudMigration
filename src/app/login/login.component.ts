import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment'
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { browserRefresh } from '../../app/app.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private data:DataService, private router: Router, private adalSvc: MsAdalAngular6Service) { }

  public browserRefresh: boolean;
  

  ngOnInit() {

    this.browserRefresh = browserRefresh;
    console.log(this.browserRefresh);
    // if(!browserRefresh){
      this.adalSvc.login();
    //}
    // else{
    //   this.adalSvc.logout();
    // }
    // let redirectLogin= environment.loginUrl + environment.tenant+ '/oauth2/v2.0/authorize?'
    // +'client_id='+environment.client_id
    // +'&response_type=code'
    // +'&redirect_uri='+environment.redirect_uri
    // +'&response_mode=query'
    // +'&scope='+environment.code_scope
    // +'&state='+environment.state
    // console.log(redirectLogin)
    // window.location.href = redirectLogin

    // this.data.redirectToLogin().subscribe(data => {
    //   console.log(data);
    // });

  }

}
