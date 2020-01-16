import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { SourceCodeDetails } from '../modals/sourceCodeDetails';
import { browserRefresh } from '../../app/app.component'
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-source-code-upload',
  templateUrl: './source-code-upload.component.html',
  styleUrls: ['./source-code-upload.component.css']
})
export class SourceCodeUploadComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private data: DataService,
    private adalSvc: MsAdalAngular6Service, private authService: AuthService) { }



  sourceCodeUploadForm = this.fb.group({
    source_code_repository: ['', Validators.required],
    application_name: ['', Validators.required],
    application_type: ['', Validators.required],
    url: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  public sourceCodeData;
  public navLinks;
  public browserRefresh: boolean;

  srcRepo = ['Git']

  ngOnInit() {
    this.browserRefresh = browserRefresh;
    // if(!browserRefresh){
    this.data.currentNavLinkData.subscribe(data => {
      this.navLinks = data;
    })

    this.data.currentSourceCodeDetailsData.subscribe(data => this.sourceCodeData = data)
    if (this.sourceCodeData !== null) {
      this.updateFormData();
    }
    // }
    // else{
    //   localStorage.clear();
    //   sessionStorage.clear();
    //   this.adalSvc.logout();
    // }
  }

  // Getter method to access formcontrols
  get username() {
    return this.sourceCodeUploadForm.get('username');
  }

  get password() {
    return this.sourceCodeUploadForm.get('password');
  }


  gitAuthenticate() {
    localStorage.setItem("gitUsername", this.username.value)
    localStorage.setItem("gitPassword", this.password.value)
    this.authService.authenticateGit().subscribe(result => {
      console.log(result)
    }, error => console.log(error))
  }


  updateFormData() {
    this.sourceCodeUploadForm.patchValue({
      source_code_repository: this.sourceCodeData.Source_Code_Repository,
      application_name: this.sourceCodeData.Application_Name,
      application_type: this.sourceCodeData.Application_Type,
      url: this.sourceCodeData.URL,
      username: this.sourceCodeData.Username,
      password: this.sourceCodeData.Password
    });
  }


  onNext(values) {
    this.sourceCodeData = new SourceCodeDetails();
    this.sourceCodeData.Source_Code_Repository = values.source_code_repository.split(': ')[0];
    this.sourceCodeData.Application_Name = values.application_name;
    this.sourceCodeData.Application_Type = values.application_type;
    this.sourceCodeData.URL = values.url;
    this.sourceCodeData.Username = values.username;
    this.sourceCodeData.Password = values.password;
    this.data.changeSourceCodeDetails(this.sourceCodeData);
    this.navLinks[1].disable = false;
    this.data.changeNavLinkData(this.navLinks);
    this.router.navigate(['/app-details']);
  }

  // onPrev(){
  //   this.router.navigate(['/app-details'])
  // }

}
