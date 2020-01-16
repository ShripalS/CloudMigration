import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { DeploymentDetailsAKS } from '../modals/deploymentDetailsAKS';
import { browserRefresh } from '../../app/app.component'
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

@Component({
  selector: 'app-aks-app-details',
  templateUrl: './aks-app-details.component.html',
  styleUrls: ['./aks-app-details.component.css']
})
export class AksAppDetailsComponent implements OnInit {

  public acrLoginServer;

  constructor(private fb: FormBuilder, private router: Router, private data: DataService,
    private adalSvc: MsAdalAngular6Service) {
    this.acrLoginServer = sessionStorage.getItem('acrLoginServer')
  }

  AKSAppDetailsForm = this.fb.group({
    deployment_name: ['', Validators.required],
    application_name: ['', Validators.required],
    replicas: ['', Validators.required],
    container_port: ['', Validators.required],
    node_selector: ['Linux', Validators.required],
    container_name: ['', Validators.required],
    container_image: [sessionStorage.getItem('acrLoginServer') + '/', Validators.required],
    cpu_requests: ['250m', Validators.required],
    cpu_requests_memory: ['', Validators.required],
    cpu_limits: ['500m', Validators.required],
    cpu_limits_memory: ['', Validators.required],
    image_pull_secrets: ['', Validators.required],
  })

  nodeSelectorList = ['Linux', 'Windows']

  public deploymentData;
  public navLinks;
  public browserRefresh: boolean;

  ngOnInit() {
    // this.browserRefresh = browserRefresh;
    // if(!browserRefresh){
    this.data.currentNavLinkData.subscribe(data => {
      this.navLinks = data;
    })

    this.data.currentdeploymentAKSDetailsData.subscribe(data => this.deploymentData = data)
    if (this.deploymentData !== null) {
      this.updateFormData();
    }
    //}
    // else{
    //   localStorage.clear();
    //   sessionStorage.clear();
    //   this.adalSvc.logout();
    // }
  }

  get container_name() {
    return this.AKSAppDetailsForm.get('container_name');
  }

  changeContainerImage() {
    this.AKSAppDetailsForm.patchValue({
      container_image: this.acrLoginServer + '/' + this.container_name.value
    });
  }


  updateFormData() {
    this.AKSAppDetailsForm.patchValue({
      deployment_name: this.deploymentData.Deployment_Name,
      application_name: this.deploymentData.Application_Name,
      replicas: this.deploymentData.Replicas,
      container_port: this.deploymentData.Container_Port,
      node_selector: this.deploymentData.Node_Selector,
      container_name: this.deploymentData.Container_Name,
      container_image: this.deploymentData.Container_Image,
      cpu_requests: this.deploymentData.CPU_Requests,
      cpu_requests_memory: this.deploymentData.CPU_Requests_Memory,
      cpu_limits: this.deploymentData.CPU_Limits,
      cpu_limits_memory: this.deploymentData.CPU_Limits_Memory,
      image_pull_secrets: this.deploymentData.Image_Pull_Secrets,
    });
  }

  onNext(values) {
    this.deploymentData = new DeploymentDetailsAKS();
    this.deploymentData.Deployment_Name = values.deployment_name;
    this.deploymentData.Application_Name = values.application_name;
    this.deploymentData.Replicas = values.replicas;
    this.deploymentData.Container_Port = values.container_port;
    this.deploymentData.Node_Selector = values.node_selector;
    this.deploymentData.Container_Name = values.container_name;
    this.deploymentData.Container_Image = values.container_image;
    this.deploymentData.CPU_Requests = values.cpu_requests
    this.deploymentData.CPU_Requests_Memory = values.cpu_requests_memory
    this.deploymentData.CPU_Limits = values.cpu_limits;
    this.deploymentData.CPU_Limits_Memory = values.cpu_limits_memory;
    this.deploymentData.Image_Pull_Secrets = values.image_pull_secrets;
    this.data.changeDeploymentAKSDetails(this.deploymentData);
    this.navLinks[4].disable = false;
    this.data.changeNavLinkData(this.navLinks);
    this.router.navigate(['/aks-service-details']);
  }

  onPrev() {
    this.router.navigate(['/hosting'])
  }


}