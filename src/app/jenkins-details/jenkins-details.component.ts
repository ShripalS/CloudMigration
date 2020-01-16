import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { JenkinServerDetails } from '../modals/jenkinsServerDetails';
import { browserRefresh } from '../../app/app.component'
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-jenkins-details',
  templateUrl: './jenkins-details.component.html',
  styleUrls: ['./jenkins-details.component.css']
})
export class JenkinsDetailsComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private data: DataService, private adalSvc: MsAdalAngular6Service) { }


  public jenkinData;
  public navLinks;
  public btnDisable = false;
  public browserRefresh: boolean;


  jenkinsDetailsForm = this.fb.group({
    jenkin_server: [''],
  })


  ngOnInit() {
    // this.browserRefresh = browserRefresh;
    // if(!browserRefresh){
    this.data.currentNavLinkData.subscribe(data => {
      this.navLinks = data;
    })

    this.data.currentJenkinsServerDetailsData.subscribe(jenkinsData => {
      this.jenkinData = jenkinsData
      if (this.jenkinData !== null) {
        this.updateFormData();
      }
    })
    // }
    // else{
    //   localStorage.clear();
    //   sessionStorage.clear();
    //   this.adalSvc.logout();
    // }
  }


  updateFormData() {
    this.jenkinsDetailsForm.patchValue({
      jenkin_server: this.jenkinData.Jenkin_Server,
    });
  }

  onSubmit(values) {
    sessionStorage.setItem('currentSessionId', uuid());
    sessionStorage.setItem('currentPartitionId', uuid());
    this.jenkinData = new JenkinServerDetails();
    this.jenkinData.Jenkin_Server = values.jenkin_server;
    this.data.changeJenkinServerDetails(this.jenkinData);
    this.data.OnSubmit();
    this.btnDisable = true;
  }

  onPrev() {
    this.router.navigate(['/aks-ingress-details'])
  }

}
