import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AzureService {

public subscriptionId

  constructor(private http : HttpClient, private data:DataService) {
    console.log(sessionStorage.getItem('subscriptionId'))
        this.subscriptionId = sessionStorage.getItem('subscriptionId');
  }

  getSubscriptionDetails():Observable<any>{
    return this.http.get('https://management.azure.com/subscriptions?api-version=2019-06-01')
  }

  getResourceGroupDetails():Observable<any>{
    return this.http.get('https://management.azure.com/subscriptions/'+this.subscriptionId+'/resourcegroups?api-version=2019-08-01')
  }

  getACRList(resourceGroup):Observable<any>{
    return this.http.get('https://management.azure.com/subscriptions/'+this.subscriptionId+'/resourceGroups/'+resourceGroup+'/providers/Microsoft.ContainerRegistry/registries?api-version=2019-05-01')
  }

  getClusterList(resourceGroup):Observable<any>{
    return this.http.get('https://management.azure.com/subscriptions/'+this.subscriptionId+'/resourceGroups/'+resourceGroup+'/providers/Microsoft.ContainerService/managedClusters?api-version=2019-08-01')
  }

  getLocationForSubscription():Observable<any>{
    return this.http.get('https://management.azure.com/subscriptions/'+this.subscriptionId+'/locations?api-version=2019-06-01')
  }

  createResourceGroup(resourceGroupName, location):Observable<any>{
    console.log(location)
    return this.http.put('https://management.azure.com/subscriptions/'+this.subscriptionId+'/resourcegroups/'+resourceGroupName+'?api-version=2019-08-01',
    {
      "location": location
      })
  }

  checkContainerNameExistence(registryName):Observable<any>{
    return this.http.post('https://management.azure.com/subscriptions/'+this.subscriptionId+'/providers/Microsoft.ContainerRegistry/checkNameAvailability?api-version=2019-05-01',
    {
      "name": registryName,
      "type": "Microsoft.ContainerRegistry/registries"
    })
  }

  createContainerRegistry(resourceGroupName, registryData):Observable<any>{
    console.log(resourceGroupName, registryData);
    return this.http.put('https://management.azure.com/subscriptions/'+this.subscriptionId+'/resourceGroups/'+resourceGroupName+'/providers/Microsoft.ContainerRegistry/registries/'+registryData.registry_name+'?api-version=2019-05-01',
    {
      "location": registryData.location,
      "tags": {
      },
      "sku": {
        "name": registryData.sku
      },
      "properties": {
        "adminUserEnabled": registryData.admin_user
      }
    })
  }

  getVMSizes():Observable<any>{
    return this.http.get('https://management.azure.com/subscriptions/'+this.subscriptionId+'/providers/Microsoft.Compute/skus?api-version=2017-09-01')
  }

}
