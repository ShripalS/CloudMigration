import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationDetailsComponent } from './application-details/application-details.component';
import { SourceCodeUploadComponent } from './source-code-upload/source-code-upload.component';
import { HostingComponent } from './hosting/hosting.component';
import { AksAppDetailsComponent } from './aks-app-details/aks-app-details.component';
import { AksServiceDetailsComponent } from './aks-service-details/aks-service-details.component';
import { JenkinsDetailsComponent } from './jenkins-details/jenkins-details.component';
import { AksIngressDetailsComponent } from './aks-ingress-details/aks-ingress-details.component';
import { LoginComponent } from './login/login.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { AuthenticationGuard  } from 'microsoft-adal-angular6';

const routes: Routes = [ 
  { path: 'aks-ingress-details', component: AksIngressDetailsComponent, canActivate: [AuthenticationGuard]  },
  { path: 'jenkins-service-details', component: JenkinsDetailsComponent , canActivate: [AuthenticationGuard] },
  { path: 'aks-service-details', component: AksServiceDetailsComponent , canActivate: [AuthenticationGuard] },
  { path: 'aks-app-details', component: AksAppDetailsComponent, canActivate: [AuthenticationGuard]  },
  { path: 'hosting', component: HostingComponent , canActivate: [AuthenticationGuard] },
  { path: 'source-code', component: SourceCodeUploadComponent, canActivate: [AuthenticationGuard]  },
  { path: 'app-details', component: ApplicationDetailsComponent, canActivate: [AuthenticationGuard]  },
  { path: 'authenticate', component: AuthenticateComponent, canActivate: [AuthenticationGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
