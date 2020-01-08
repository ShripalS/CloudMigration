import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, NavigationStart } from '@angular/router';
import { DataService } from '../data.service';
import { AppDetails } from '../modals/appDetails';
import { browserRefresh } from '../../app/app.component'
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';


@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {

  
  applicationDetailsForm = this.fb.group({
    subscription_id : [''],
    technology : [''],
    version : [''],
    tag_name : [''],
  })

  public appDetailsData;
  public navLinks;
  public subscriptionList = [];
  public browserRefresh: boolean;


  technologyList = [{tech : ".Net", versions: ['3.5','4.6.2','4.7.1','4.7.2','4.7','4.8'] },
  {tech : "JAVA", versions: ['3.6.3-jdk-11-openj9','3.6-jdk-11-openj9','3-jdk-11-openj9','3.6.3-jdk-11-slim',
  '3.6.3-jdk-11','3.6.3-slim']}]
  versionList = [];



  constructor(private fb: FormBuilder, private router: Router, private data:DataService, 
    private adalSvc: MsAdalAngular6Service) { 

    let azureSubscriptionDetails = JSON.parse(sessionStorage.getItem('azureSubscriptionDetails'));
    for(let sub of azureSubscriptionDetails.value)
    {
      this.subscriptionList.push(sub.displayName + '(' + sub.subscriptionId + ')');
    }

  }

  
  ngOnInit() {

    this.browserRefresh = browserRefresh;
    // if(!browserRefresh){

      this.data.currentNavLinkData.subscribe(data =>{
        this.navLinks = data;
      })

      this.data.currentApplicationDetailsData.subscribe(data => {this.appDetailsData = data
        if(this.appDetailsData !== null){
          this.updateFormData();
          this.changeTechnology();
        }
      })
    //}
    // else{
    //   localStorage.clear();
    //   sessionStorage.clear();
    //   this.adalSvc.logout();
    // }
  }


  // Getter method to access formcontrols
  get technology() {
    return this.applicationDetailsForm.get('technology');
  }

  get version() {
    return this.applicationDetailsForm.get('version');
  }

  get subscription_id() {
    return this.applicationDetailsForm.get('subscription_id');
  }

  changeTechnology(){
    // this.technology.setValue(e.target.value, {
    //  onlySelf: true
    // })
    console.log(this.technology.value);
    this.versionList = [];
    let fetchedVersionList = this.technologyList.find(x=>x.tech === this.technology.value).versions;
    console.log(fetchedVersionList);
    for(let item of fetchedVersionList){
      this.versionList.push(item);
    }
  }

  updateFormData(){
    let subscription = (JSON.parse(sessionStorage.getItem('azureSubscriptionDetails'))).value;
    let subscript_name = subscription.find(x=>x.subscriptionId = this.appDetailsData.Subscription_ID).displayName
    this.applicationDetailsForm.patchValue({
      subscription_id:subscript_name+'('+this.appDetailsData.Subscription_ID+')',
      technology : this.appDetailsData.Technology,
      version : this.appDetailsData.Version,
      tag_name :this.appDetailsData.Tag_Name,
     });
  }

  onNext(values){
    sessionStorage.setItem('subscriptionId', ((values.subscription_id.split(': ')[0]).split('(')[1]).split(')')[0])
    console.log(sessionStorage.getItem('subscriptionId'))
    this.appDetailsData = new AppDetails();
    this.appDetailsData.Subscription_ID = ((values.subscription_id.split(': ')[0]).split('(')[1]).split(')')[0];
    this.appDetailsData.Technology = (values.technology).split(': ')[0];
    this.appDetailsData.Version = values.version.split(': ')[0];
    this.appDetailsData.Tag_Name = values.tag_name;
    console.log(this.appDetailsData);
    this.data.changeAppDetailsData(this.appDetailsData);
    this.navLinks[2].disable = false;
    this.data.changeNavLinkData(this.navLinks);
    this.router.navigate(['/hosting']);
  }

  onPrev(){
    this.router.navigate(['/source-code'])
  }

}
