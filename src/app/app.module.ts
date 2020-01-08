import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsAdalAngular6Module, AuthenticationGuard  } from 'microsoft-adal-angular6';
import { environment } from '../environments/environment';
import { TokenInterceptor } from './token.interceptor'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog'
import {MatIconModule} from '@angular/material';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApplicationDetailsComponent } from './application-details/application-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SourceCodeUploadComponent } from './source-code-upload/source-code-upload.component';
import { HostingComponent, DialogDataExampleDialog, DialogDataRegistryDialog } from './hosting/hosting.component';
import { AksAppDetailsComponent } from './aks-app-details/aks-app-details.component';
import { AksServiceDetailsComponent } from './aks-service-details/aks-service-details.component';
import { JenkinsDetailsComponent } from './jenkins-details/jenkins-details.component';
import { AksIngressDetailsComponent } from './aks-ingress-details/aks-ingress-details.component';
import { LoginComponent } from './login/login.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { AuthService } from './auth.service';


@NgModule({
  declarations: [
    AppComponent,
    ApplicationDetailsComponent,
    SourceCodeUploadComponent,
    HostingComponent,
    AksAppDetailsComponent,
    AksServiceDetailsComponent,
    JenkinsDetailsComponent,
    AksIngressDetailsComponent,
    LoginComponent,
    AuthenticateComponent,
    DialogDataExampleDialog,
    DialogDataRegistryDialog
  ],
  entryComponents: [
    DialogDataExampleDialog,
    DialogDataRegistryDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MsAdalAngular6Module.forRoot({
      tenant: environment.tenant,
      clientId: environment.client_id,
      redirectUri: environment.redirect_uri,
      //authority : 'https://login.micorsoftonline.com/common/oauth2/authorize',
      endpoints: environment.endpoints,
      navigateToLoginRequestUrl: false,
      //extraQueryParameter: environment.extraQueryParameter,
      cacheLocation: 'localStorage',
      //resource: 'https://management.azure.com/'
    })
  ],
  providers: [AuthenticationGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],

  bootstrap: [AppComponent]

})
export class AppModule { }
