import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { AuthService } from '../auth.service';
import { AzureService } from '../azure.service';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

  public navLinks;
  public subscriptionDetails;

  constructor(private adalSvc: MsAdalAngular6Service,private router: Router, private data:DataService,
     private azureService : AzureService) {
    
  }

  ngOnInit() {
    //this.adalSvc.logout();
    this.data.currentNavLinkData.subscribe(data =>{
      this.navLinks = data;

    });

    this.adalSvc.acquireToken('management').subscribe(token=> {
      localStorage.setItem('token',token)
      this.azureService.getSubscriptionDetails().subscribe(azureSubscriptions =>{
        sessionStorage.setItem('azureSubscriptionDetails',JSON.stringify(azureSubscriptions));
          this.navLinks[0].disable = false;
          this.data.changeNavLinkData(this.navLinks);
          this.router.navigate(['/source-code']);
      });
    });
  }

}
