import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { IngressDetails } from '../modals/ingressAKSDetails';
import { browserRefresh } from '../../app/app.component'
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

@Component({
  selector: 'app-aks-ingress-details',
  templateUrl: './aks-ingress-details.component.html',
  styleUrls: ['./aks-ingress-details.component.css']
})
export class AksIngressDetailsComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private data:DataService, private adalSvc: MsAdalAngular6Service) { }

  public serviceData;
  public ingressData;
  public navLinks;
  public browserRefresh: boolean;

  
  AKSIngressDetailsForm = this.fb.group({
    //namespace_name : ['default'],
    // ingress_controller_name : [''],
    ingress_name : [''],
    // replica_count :  [''],
    path : [''],
    service_name : [''],
    service_port : ['']
  })


  ngOnInit() {
    // this.browserRefresh = browserRefresh;
    // if(!browserRefresh){
      this.data.currentNavLinkData.subscribe(data =>{
        this.navLinks = data;
      })

      this.data.currentServiceAKSDetailsData.subscribe(data => {
        this.serviceData = data
        this.data.currentIngressAKSDetailsData.subscribe(data => {
          this.ingressData = data
          this.AKSIngressDetailsForm.patchValue({
            service_name : this.serviceData.Service_Name,
            service_port : this.serviceData.Port,
          })
          if(this.ingressData !== null){
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
    this.AKSIngressDetailsForm.patchValue({
      ingress_name :  this.ingressData.Ingress_Name,
      // namespace_name :  this.ingressData.Namespace_Name,
      //ingress_controller_name :  this.ingressData.Ingress_Controller_Name,
      //replica_count :  this.ingressData.Replica_Count,
      path :  this.ingressData.Path,
      service_name : this.ingressData.Service_Name,
      service_port : this.ingressData.Service_Port,
     });
  }
  
  onNext(values){
    this.ingressData = new IngressDetails();
    this.ingressData.Ingress_Name = values.ingress_name;
    // this.ingressData.Namespace_Name = values.namespace_name;
    // this.ingressData.Ingress_Controller_Name = values.ingress_controller_name;
    // this.ingressData.Replica_Count = values.replica_count;
    this.ingressData.Path = values.path;
    this.ingressData.Service_Name = values.service_name;
    this.ingressData.Service_Port = values.service_port;
    this.data.changeIngressAKSDetails(this.ingressData);
    this.navLinks[6].disable = false;
    this.data.changeNavLinkData(this.navLinks);
    this.router.navigate(['/jenkins-service-details']);
  }
  
    onPrev(){
      this.router.navigate(['/aks-service-details'])
    }

}
