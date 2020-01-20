import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { HostingDetails } from '../modals/hostingDetails';
import { AuthService } from '../auth.service';
import { browserRefresh } from '../../app/app.component'
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { AzureService } from '../azure.service';
import { MatIconRegistry } from '@angular/material';
import { concat } from 'rxjs';

@Component({
  selector: 'app-hosting',
  templateUrl: './hosting.component.html',
  styleUrls: ['./hosting.component.css']
})
export class HostingComponent implements OnInit {

  hostingDetailsForm = this.fb.group({
    subscription_id: ['', Validators.required],
    host: ['AKS', Validators.required],
    cluster_created: ['No', Validators.required],
    acr_name: ['', Validators.required],
    resource_group: ['', Validators.required],
    cluster: this.fb.group({
      cluster_name: ['', Validators.required],
      region: ['', Validators.required],
      version: ['1.14.8', Validators.required],
      dns_name_prefix: ['', Validators.required],
      node_count: ['', Validators.required],
      node_size: ['', Validators.required],
      service_principle_client_id: ['', Validators.required],
      service_principle_client_secret: ['', Validators.required]
      // pod_count : [''],
      // application_count : ['']
    })
  })


  hostList = ['AKS']
  clusterCreatedList = ['Yes', 'No']

  isClusterCreated: boolean = true;

  dialogRef: MatDialogRef<DialogDataExampleDialog>;
  registryDialogRef: MatDialogRef<DialogDataRegistryDialog>;

  public hostingData = null;
  public navLinks;
  public resourceGroupList = [];
  public subscriptionId;
  public acrList = [];
  public clusterList = [];
  public browserRefresh: boolean;
  public resourceGroupCreation = 'none';
  public regionList = [];
  public nodeSizeList = [];
  public subscriptionList = [];

  public acrFullDetails;

  public kubernetsVersionList = ['1.14.8', '1.15.5', '1.15.4', '1.14.7', '1.13.12', '1.13.11']


  constructor(private fb: FormBuilder, private router: Router, private data: DataService,
    private azureService: AzureService,
    private adalSvc: MsAdalAngular6Service, public dialog: MatDialog) {

    let azureSubscriptionDetails = JSON.parse(sessionStorage.getItem('azureSubscriptionDetails'));
    for (let sub of azureSubscriptionDetails.value) {
      this.subscriptionList.push(sub.displayName + '(' + sub.subscriptionId + ')');
    }
  }


  ngOnInit() {

    this.azureService.getSessionStatusDetails();


    this.data.currentNavLinkData.subscribe(data => {
      this.navLinks = data;
    })

    this.data.currenthostingDetailsData.subscribe(data => this.hostingData = data)
    if (this.hostingData !== null) {
      this.getResourceGroupList();
      this.getLocationDetails();
      this.azureService.getACRList(this.hostingData.Resource_Group).subscribe(acrList => {
        for (let acr of acrList.value) {
          this.acrList.push(acr.name);
        }
        if (this.hostingData.Cluster_Created === '2: No'
          || this.hostingData.Cluster_Created === 'No'
          || this.hostingData.Cluster_Created === '2') {
          this.isClusterCreated = true;
          this.updateFormData();
        }
        else {
          this.isClusterCreated = false;
          this.azureService.getClusterList(this.hostingData.Resource_Group).subscribe(clusterList => {
            for (let cluster of clusterList.value) {
              this.clusterList.push(cluster.name);
            }
            this.updateFormData();
          })
        }
        this.changeRegion()
      })
    }
  }


  // Getter method to access formcontrols
  get host() {
    return this.hostingDetailsForm.get('host');
  }

  get cluster_created() {
    return this.hostingDetailsForm.get('cluster_created');
  }

  get acr_name() {
    return this.hostingDetailsForm.get('acr_name');
  }

  get resource_group() {
    return this.hostingDetailsForm.get('resource_group');
  }

  get node_size() {
    return this.hostingDetailsForm.get('node_size');
  }

  get region() {
    return this.hostingDetailsForm.get('cluster.region');
  }

  chooseSubscription(values) {
    sessionStorage.setItem('subscriptionId', ((values.subscription_id.split(': ')[0]).split('(')[1]).split(')')[0])
    console.log(sessionStorage.getItem('subscriptionId'))

    this.getResourceGroupList();

    this.getLocationDetails();

  }

  getResourceGroupList() {
    this.azureService.getResourceGroupDetails().subscribe(resourceGroups => {
      for (let resource of resourceGroups.value) {
        this.resourceGroupList.push(resource.name);
      }
    })
  }

  getLocationDetails() {
    this.azureService.getLocationForSubscription().subscribe(regions => {
      for (let region of regions.value) {
        this.regionList.push({ regionName: region.name, regionDisplayName: region.displayName });
      }
    })
  }

  changeResourceGroup() {
    console.log(this.resource_group.value);
    this.acrList = [];
    this.azureService.getACRList(this.resource_group.value).subscribe(acrList => {
      this.acrFullDetails = [];
      this.acrFullDetails = acrList.value;
      for (let acr of acrList.value) {
        this.acrList.push(acr.name);
      }
    })
  }


  setAcrServer(values) {
    let AcrLoginServer = (this.acrFullDetails.find(x => x.name = values.acr_name)).properties.loginServer
    sessionStorage.setItem('acrLoginServer', AcrLoginServer);
  }


  changeClusterCreated(e) {
    // this.cluster_created.setValue(e.target.value, {
    //   onlySelf: true
    // })
    if (this.hostingDetailsForm.controls.cluster_created.value === '2: No'
      || this.hostingDetailsForm.controls.cluster_created.value === 'No'
      || this.hostingDetailsForm.controls.cluster_created.value === '2')
    {
      this.isClusterCreated = true;
      this.clusterList = [];
      this.hostingDetailsForm.patchValue({
        cluster: {
          cluster_name: ''
        }
      })
      this.hostingDetailsForm.get('cluster.region').setValidators(Validators.required);
      this.hostingDetailsForm.get('cluster.version').setValidators(Validators.required);
      this.hostingDetailsForm.get('cluster.dns_name_prefix').setValidators(Validators.required);
      this.hostingDetailsForm.get('cluster.node_count').setValidators(Validators.required);
      this.hostingDetailsForm.get('cluster.node_size').setValidators(Validators.required);
      this.hostingDetailsForm.get('cluster.service_principle_client_id').setValidators(Validators.required);
      this.hostingDetailsForm.get('cluster.service_principle_client_secret').setValidators(Validators.required);
    }
    else {
      this.isClusterCreated = false;
      this.clusterList = [];
      this.hostingDetailsForm.get('cluster.region').setErrors(null);
      this.hostingDetailsForm.get('cluster.version').setErrors(null);
      this.hostingDetailsForm.get('cluster.dns_name_prefix').setErrors(null);
      this.hostingDetailsForm.get('cluster.node_count').setErrors(null);
      this.hostingDetailsForm.get('cluster.node_size').setErrors(null);
      this.hostingDetailsForm.get('cluster.service_principle_client_id').setErrors(null);
      this.hostingDetailsForm.get('cluster.service_principle_client_secret').setErrors(null);
      this.azureService.getClusterList(this.resource_group.value).subscribe(clusterList => {
        for (let cluster of clusterList.value) {
          this.clusterList.push(cluster.name);
        }
      })
    }
  }

  changeRegion() {
    this.nodeSizeList = [];
    this.azureService.getVMSizes().subscribe(vmsize => {
      let vm = ((vmsize.value).filter(x => x.resourceType === 'virtualMachines'))
      let regionValue = this.region.value;
      if (regionValue !== null && regionValue !== "" && typeof regionValue !== typeof undefined && this.regionList.length > 0)
      {
        let region = (this.regionList.find(x => x.regionDisplayName === regionValue)).regionName
        let vmLocation = (vm.filter(x => x.locations.includes(region)));
        for (let i of vmLocation) {
          if (i.restrictions.reasonCode !== 'NotAvailableForSubscription') {
            this.nodeSizeList.push({ name: i.name, size: i.size, tier: i.tier })
          }
        }
      }
      if (this.hostingData !== null) {
        this.updateFormData();
      }
      console.log(this.nodeSizeList)
    })
  }



  updateFormData() {
    let subscription = (JSON.parse(sessionStorage.getItem('azureSubscriptionDetails'))).value;
    let subscript_name = subscription.find(x => x.subscriptionId = this.hostingData.Subscription_ID).displayName
    console.log(this.hostingData);
    this.hostingDetailsForm.patchValue({
      subscription_id: subscript_name + '(' + this.hostingData.Subscription_ID + ')',
      host: this.hostingData.Host,
      cluster_created: this.hostingData.Cluster_Created,
      acr_name: this.hostingData.ACR_Name,
      resource_group: this.hostingData.Resource_Group,
      cluster: {
        cluster_name: this.hostingData.Cluster_Name,
        region: this.hostingData.Region,
        version: this.hostingData.Version,
        dns_name_prefix: this.hostingData.DNS_Name_Prefix,
        node_count: this.hostingData.Node_Count,
        node_size: this.hostingData.Node_Size,
        service_principle_client_id: this.hostingData.Service_Principle_Client_ID,
        service_principle_client_secret: this.hostingData.Service_Principle_Client_Secret
      }
    });
    console.log(this.hostingDetailsForm.value);
  }

  getResourceGroupDetails() {
    this.dialogRef = this.dialog.open(DialogDataExampleDialog, {
      disableClose: true, backdropClass: 'backdropBackground',
      hasBackdrop: true
    });
    this.dialogRef.afterClosed().subscribe(result => {
      this.azureService.createResourceGroup(result.resource_group_name, result.location).subscribe(dataReturned => {
        this.resourceGroupList.push(dataReturned.name);
        this.hostingDetailsForm.patchValue({
          resource_group: dataReturned.name
        })
        this.changeResourceGroup();
      })
    });
  }

  getACRDetails() {
    this.registryDialogRef = this.dialog.open(DialogDataRegistryDialog, {
      disableClose: true, backdropClass: 'backdropBackground',
      hasBackdrop: true
    });
    this.registryDialogRef.afterClosed().subscribe(result => {
      this.azureService.createContainerRegistry(this.resource_group.value, result).subscribe(resultData => {
        this.acrList.push(resultData.name);
        this.hostingDetailsForm.patchValue({
          acr_name: resultData.name
        })
      })
    });
  }

  onNext(values) {
    console.log(values)
    this.hostingData = new HostingDetails();
    this.hostingData.Subscription_ID = ((values.subscription_id.split(': ')[0]).split('(')[1]).split(')')[0];
    this.hostingData.Host = values.host;
    this.hostingData.Cluster_Created = values.cluster_created;
    this.hostingData.ACR_Name = values.acr_name;
    this.hostingData.Resource_Group = values.resource_group;
    this.hostingData.Cluster_Name = values.cluster.cluster_name
    this.hostingData.Region = values.cluster.region;
    this.hostingData.Version = values.cluster.version;
    this.hostingData.DNS_Name_Prefix = values.cluster.dns_name_prefix;
    this.hostingData.Node_Count = values.cluster.node_count
    this.hostingData.Node_Size = values.cluster.node_size.name;
    this.hostingData.Service_Principle_Client_ID = values.cluster.service_principle_client_id
    this.hostingData.Service_Principle_Client_Secret = values.cluster.service_principle_client_secret;
    console.log(this.hostingData)
    this.data.changeHostingDetails(this.hostingData);
    this.navLinks[3].disable = false;
    this.data.changeNavLinkData(this.navLinks);
    this.router.navigate(['/aks-app-details']);
  }

  onPrev() {
    this.router.navigate(['/app-details'])
  }

}

@Component({
  // selector: 'resource-group-dialog',
  templateUrl: '../../app/resource-group-dialog.html',
})
export class DialogDataExampleDialog {
  //constructor(@Inject(MAT_DIALOG_DATA) public dialogdata) {}
  resourceGroupForm: FormGroup;
  locationList = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogDataExampleDialog>,
    private azureService: AzureService,
    public data: DataService
  ) {
    this.azureService.getLocationForSubscription().subscribe(locations => {
      for (let location of locations.value) {
        this.locationList.push({ locationName: location.name, locationDisplayName: location.displayName });
      }
    })
  }

  ngOnInit() {
    this.resourceGroupForm = this.formBuilder.group({
      resource_group_name: '',
      location: ''
    })
  }

  onCreateResourceGroup(form) {
    this.dialogRef.close(form.value);
  }
}

@Component({
  // selector: 'resource-group-dialog',
  templateUrl: '../../app/container-registry-dialog.html',
})
export class DialogDataRegistryDialog {
  registryForm: FormGroup;
  skuList = ['Basic', 'Standard', 'Premium']
  locationList = [];
  nameExists = false;
  errorMessage = '';
  //admin_user_options = ['Enable', 'Disable']

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogDataRegistryDialog>,
    private azureService: AzureService,
    public data: DataService
  ) {
    this.azureService.getLocationForSubscription().subscribe(locations => {
      for (let location of locations.value) {
        this.locationList.push({ locationName: location.name, locationDisplayName: location.displayName });
      }
    })
  }

  ngOnInit() {
    this.registryForm = this.formBuilder.group({
      registry_name: '',
      location: '',
      sku: '',
      admin_user: [false, Validators.requiredTrue],
    })
  }

  onCreateContainerRegistry(form) {
    let registryName = form.value.registry_name
    if (registryName !== null && registryName !== '' && typeof registryName !== typeof undefined) {
      this.azureService.checkContainerNameExistence(registryName).subscribe(result => {
        console.log(result);
        if (result.nameAvailable) {
          this.dialogRef.close(form.value);
        }
        else {
          this.errorMessage = result.message;
          this.nameExists = true;
        }
      })
    }
  }
}
