import { AppDetails } from './appDetails';
import { SourceCodeDetails } from './sourceCodeDetails';
import { HostingDetails } from './hostingDetails';
import { DeploymentDetailsAKS } from './deploymentDetailsAKS';
import { ServiceDetailsAKS } from './serviceDetailsAKS';
import { IngressDetails } from './ingressAKSDetails';
import { JenkinServerDetails } from './jenkinsServerDetails';


export class CMSData {
  ApplicationDetails: AppDetails;
  SourceCodeDetails: SourceCodeDetails;
  HostingDetails: HostingDetails;
  DeploymentDetails: DeploymentDetailsAKS;
  ServiceDetails: ServiceDetailsAKS;
  IngressDetails: IngressDetails;
  JenkinsDetails: JenkinServerDetails;
  SessionID: string;
  PartitonKey: string;
}
