import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppDetails } from './modals/appDetails';
import { SourceCodeDetails } from './modals/sourceCodeDetails';
import { HostingDetails } from './modals/hostingDetails';
import { DeploymentDetailsAKS } from './modals/deploymentDetailsAKS';
import { ServiceDetailsAKS } from './modals/serviceDetailsAKS';
import { IngressDetails } from './modals/ingressAKSDetails';
import { JenkinServerDetails } from './modals/jenkinsServerDetails';
import { CMSData } from './modals/CMSData';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {


  private navLinkSource = new BehaviorSubject([
    {
      label: 'Source Code Upload',
      link: './source-code',
      index: 0,
      disable: true
    },
    {
      label: 'Application Details',
      link: './app-details',
      index: 1,
      disable: true
    },
    {
      label: 'Hosting',
      link: './hosting',
      index: 2,
      disable: true
    },
    {
      label: 'AKS Deployment Details',
      link: './aks-app-details',
      index: 3,
      disable: true
    },
    {
      label: 'AKS Service Details',
      link: './aks-service-details',
      index: 4,
      disable: true
    },
    {
      label: 'AKS Ingress Details',
      link: './aks-ingress-details',
      index: 5,
      disable: true
    },
    {
      label: 'Jenkin Server Details',
      link: './jenkins-service-details',
      index: 6,
      disable: true
    },
  ]);
  currentNavLinkData = this.navLinkSource.asObservable();

  private applicationDetailsSource = new BehaviorSubject(null);
  currentApplicationDetailsData = this.applicationDetailsSource.asObservable();

  private sourceCodeDetails = new BehaviorSubject(null);
  currentSourceCodeDetailsData = this.sourceCodeDetails.asObservable();

  private hostingDetailsSource = new BehaviorSubject(null);
  currenthostingDetailsData = this.hostingDetailsSource.asObservable();

  private deploymentAKSDetailsSource = new BehaviorSubject(null);
  currentdeploymentAKSDetailsData = this.deploymentAKSDetailsSource.asObservable();

  private serviceAKSDetailsSource = new BehaviorSubject(null);
  currentServiceAKSDetailsData = this.serviceAKSDetailsSource.asObservable();

  private ingressAKSDetailsSource = new BehaviorSubject(null);
  currentIngressAKSDetailsData = this.ingressAKSDetailsSource.asObservable();

  private jenkinsServerDetailsSource = new BehaviorSubject(null);
  currentJenkinsServerDetailsData = this.jenkinsServerDetailsSource.asObservable();

  constructor(private http: HttpClient) { }

  changeNavLinkData(data) {
    this.navLinkSource.next(data)
  }

  changeAppDetailsData(data: AppDetails) {
    this.applicationDetailsSource.next(data)
  }

  changeSourceCodeDetails(data: SourceCodeDetails) {
    this.sourceCodeDetails.next(data)
  }

  changeHostingDetails(data: HostingDetails) {
    this.hostingDetailsSource.next(data)
  }

  changeDeploymentAKSDetails(data: DeploymentDetailsAKS) {
    this.deploymentAKSDetailsSource.next(data)
  }

  changeServiceAKSDetails(data: ServiceDetailsAKS) {
    this.serviceAKSDetailsSource.next(data)
  }

  changeIngressAKSDetails(data: IngressDetails) {
    this.ingressAKSDetailsSource.next(data)
  }

  changeJenkinServerDetails(data: JenkinServerDetails) {
    this.jenkinsServerDetailsSource.next(data)
  }

  OnSubmit(): Observable<any> {
    let cmsData = new CMSData()
    cmsData.SessionID = sessionStorage.getItem('currentSessionId');
    cmsData.PartitonKey = sessionStorage.getItem('currentPartitionId');
    this.currentApplicationDetailsData.subscribe(appData => {
      cmsData.ApplicationDetails = appData
      this.currentSourceCodeDetailsData.subscribe(srcData => {
        cmsData.SourceCodeDetails = srcData
        this.currenthostingDetailsData.subscribe(hostData => {
          cmsData.HostingDetails = hostData
          this.currentdeploymentAKSDetailsData.subscribe(deployData => {
            cmsData.DeploymentDetails = deployData
            this.currentServiceAKSDetailsData.subscribe(serviceData => {
              cmsData.ServiceDetails = serviceData
              this.currentIngressAKSDetailsData.subscribe(ingressData => {
                cmsData.IngressDetails = ingressData
                this.currentJenkinsServerDetailsData.subscribe(jenkinsData => {
                  cmsData.JenkinsDetails = jenkinsData
                  console.log(JSON.stringify(cmsData));
                })
              })
            })
          })
        })
      })
    })
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post("http://localhost:56054/CloudMigration/", cmsData);
  }

 

  private handleError(error: HttpErrorResponse) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
      let errMessage = error.error.message;
      return Observable.throw(errMessage);

    }
    return Observable.throw(error || 'Server error');
  }

}
