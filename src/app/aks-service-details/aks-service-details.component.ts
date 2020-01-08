import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ServiceDetailsAKS } from '../modals/serviceDetailsAKS';
import { browserRefresh } from '../../app/app.component'
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

@Component({
  selector: 'app-aks-service-details',
  templateUrl: './aks-service-details.component.html',
  styleUrls: ['./aks-service-details.component.css']
})
export class AksServiceDetailsComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private data:DataService, private adalSvc: MsAdalAngular6Service) { }

  AKSServiceDetailsForm = this.fb.group({
    service_name : [''],
    port : [''],
    target_port : [''],
    app_selector :  [''],
  })

  public deploymentData
  public serviceData;
  public navLinks;
  public browserRefresh: boolean;

  ngOnInit() {
    // this.browserRefresh = browserRefresh;
    // if(!browserRefresh){
      this.data.currentNavLinkData.subscribe(data =>{
        this.navLinks = data;
      })

      this.data.currentdeploymentAKSDetailsData.subscribe(data => {
        this.deploymentData = data
      this.data.currentServiceAKSDetailsData.subscribe(data => {
        this.serviceData = data
        this.AKSServiceDetailsForm.patchValue({
          app_selector : this.deploymentData.Application_Name
        })
        if(this.serviceData !== null){
          this.updateFormData();
        }
      })
    })
  // }
  // else{
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   this.adalSvc.logout();
  // }
}

  updateFormData(){
    this.AKSServiceDetailsForm.patchValue({
      service_name : this.serviceData.Service_Name,
      port : this.serviceData.Port,
      target_port : this.serviceData.Target_Port,
      app_selector :  this.serviceData.App_Selector,
     });
  }
  
  onNext(values){
    this.serviceData = new ServiceDetailsAKS();
    this.serviceData.Service_Name = values.service_name;
    this.serviceData.Port = values.port;
    this.serviceData.Target_Port = values.target_port;
    this.serviceData.App_Selector = values.app_selector;
    this.data.changeServiceAKSDetails(this.serviceData);
    this.navLinks[5].disable = false;
    this.data.changeNavLinkData(this.navLinks);
    this.router.navigate(['/aks-ingress-details']);
  }
  
    onPrev(){
      this.router.navigate(['/aks-app-details'])
    }
  

}
