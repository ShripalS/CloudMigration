import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
    technology: ['', Validators.required],
    version: ['', Validators.required],
    tag_name: ['', Validators.required],
  })

  public appDetailsData;
  public navLinks;
  public browserRefresh: boolean;


  technologyList = [{ tech: ".Net", versions: ['3.5', '4.6.2', '4.7.1', '4.7.2', '4.7', '4.8', 'CORE 3.0', 'CORE 3.1'] },
  {
    tech: "JAVA", versions: ['3.6.3-jdk-11-openj9', '3.6-jdk-11-openj9', '3-jdk-11-openj9', '3.6.3-jdk-11-slim',
      '3.6.3-jdk-11', '3.6.3-slim']
    },
    {
      tech: "PHP", versions: ['7.4-cli', '7.4-fpm', '7.4.1-cli', '7.4.1-fpm', '7.4-buster', '7.4.1-buster', '7.4.1-cli-buster']
    },
    {
      tech: "Node JS", versions: ['13.6.0-stretch', '13.6-stretch', '13.6.0-stretch-slim', '13.6-stretch-slim', '13.6.0-buster', '13.6-buster']
    }
  ]
  versionList = [];



  constructor(private fb: FormBuilder, private router: Router, private data: DataService,
    private adalSvc: MsAdalAngular6Service) {}


  ngOnInit() {

    this.browserRefresh = browserRefresh;
    // if(!browserRefresh){

    this.data.currentNavLinkData.subscribe(data => {
      this.navLinks = data;
    })

    this.data.currentApplicationDetailsData.subscribe(data => {
    this.appDetailsData = data
      if (this.appDetailsData !== null) {
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


  changeTechnology() {
    // this.technology.setValue(e.target.value, {
    //  onlySelf: true
    // })
    console.log(this.technology.value);
    this.versionList = [];
    let fetchedVersionList = this.technologyList.find(x => x.tech === this.technology.value).versions;
    console.log(fetchedVersionList);
    for (let item of fetchedVersionList) {
      this.versionList.push(item);
    }
  }

  updateFormData() {
    this.applicationDetailsForm.patchValue({
      technology: this.appDetailsData.Technology,
      version: this.appDetailsData.Version,
      tag_name: this.appDetailsData.Tag_Name,
    });
  }

  onNext(values) {
    this.appDetailsData = new AppDetails();
    this.appDetailsData.Technology = (values.technology).split(': ')[0];
    this.appDetailsData.Version = values.version.split(': ')[0];
    this.appDetailsData.Tag_Name = values.tag_name;
    console.log(this.appDetailsData);
    this.data.changeAppDetailsData(this.appDetailsData);
    this.navLinks[2].disable = false;
    this.data.changeNavLinkData(this.navLinks);
    this.router.navigate(['/hosting']);
  }

  onPrev() {
    this.router.navigate(['/source-code'])
  }

}
