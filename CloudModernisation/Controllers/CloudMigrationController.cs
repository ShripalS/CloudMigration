using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudModernisation.Models;
using CloudModernisation.YamlStrings;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CloudModernisation.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CloudMigrationController : ControllerBase
    {
        private string url; //= "https://github.com/JonPSmith/SampleMvcWebApp.git";
        private string path; //= @"S:\dotnet-framework-docker\samples\aspnetapp";
        private string userName; //= "ShripalS";
        private string password; //= "9242230050ss";
        private string JenkinsPath;
        private string terraformPath;

        private CMSData cmsData;

        [HttpPost]
        public string Index([FromBody] CMSData cmsData)
        {
            this.cmsData = cmsData;

            this.userName = cmsData.SourceCodeDetails.Username;
            this.password = cmsData.SourceCodeDetails.Password;
            this.url = cmsData.SourceCodeDetails.URL;
            
            this.path = @"C:\ProjectFiles";
            this.JenkinsPath = @"C:\ProjectFiles\K8";
            this.terraformPath= @"C:\ProjectFiles\Terraform";

            return startProcess();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        private string startProcess()
        {
            GitRepositoryManager gitMgr = new GitRepositoryManager();

            //***************Clone the project into local**********************
            int gitProcessStatus = CloneGit();

            if (gitProcessStatus == 1)
            {
                return "Error while cloning repo";
            }

            //**************Add docker file into Repo
            int dockerFileAdd = AddDockerFile();
            if (dockerFileAdd == 2)
            {
                return "Error while adding docker file";
            }
            else if (dockerFileAdd == 3)
            {
                return "Error while pushing changes to Git";
            }

            //*******************88Create Jenkins utils folder in repo**********************************
            if (gitMgr.CreateUtilsFolder(JenkinsPath)!=0)
            {
                return "Error while creating jenkins folder in Repo";
            }


            //*******************create Terraform file in Repo******************************************************
            if (cmsData.HostingDetails.Cluster_Created == "No")
            {
                //*********************8Create Terraform Folder
                if (gitMgr.CreateUtilsFolder(terraformPath)! != 0)
                {
                    return "Error while creating Terraform folder in Repo";
                }

                if (gitMgr.CreateTerraformFile(cmsData.HostingDetails.Cluster_Name, cmsData.HostingDetails.Resource_Group, cmsData.HostingDetails.Region, cmsData.HostingDetails.DNS_Name_Prefix, cmsData.HostingDetails.Node_Count.ToString(), cmsData.HostingDetails.Node_Size, cmsData.HostingDetails.Service_Principle_Client_ID, cmsData.HostingDetails.Service_Principle_Client_Secret, terraformPath) != 0)
                {
                    return "Error while creating Terraform cluster creation file";
                }
            }

            //****************************Create Deployement YAML******************************************************

            int createDepYAML = gitMgr.CreateDeploymentYamlFile(JenkinsPath, cmsData.DeploymentDetails.Deployment_Name, cmsData.DeploymentDetails.Replicas, cmsData.DeploymentDetails.Application_Name, cmsData.DeploymentDetails.Container_Image, cmsData.DeploymentDetails.Container_Port, cmsData.DeploymentDetails.CPU_Requests_Memory, cmsData.DeploymentDetails.CPU_Requests, cmsData.DeploymentDetails.CPU_Limits_Memory, cmsData.DeploymentDetails.CPU_Limits, cmsData.DeploymentDetails.Image_Pull_Secrets);
            
            if (createDepYAML != 0){
                return "Error while creating Deployment YAML file";
            }

            //***********************Create Service YAML*******************************************************************88

            int createServiceYAML = gitMgr.CreateServiceYamlFile(JenkinsPath,cmsData.ServiceDetails.Service_Name,cmsData.ServiceDetails.Port,cmsData.ServiceDetails.Target_Port,cmsData.ServiceDetails.App_Selector);

            if (createServiceYAML != 0)
            {
                return "Error while creating Service YAML file";
            }

            //***********************************Create Ingress YAML**************************************************************

            int createIngressYAML = gitMgr.CreateIngressYamlFile(JenkinsPath, cmsData.IngressDetails.Ingress_Name, cmsData.IngressDetails.Service_Name, cmsData.IngressDetails.Service_Port, cmsData.IngressDetails.Path);

            if(createIngressYAML != 0)
            {
                return "Error while creating Ingress YAML file";
            }

            //***************************Commit and push changes*************************************************************

            if (CommitNPushChanges() != 0)
            {
                return "Error while committing and pushing the changes";
            }

            return "Process completed";
        }

        [HttpGet]
        public string Get()
        {
            //int gitFileAdd = CloneGit();
            //if (gitFileAdd == 1)
            //{
            //    return "Error while cloning repo";
            //}
            //else if (gitFileAdd == 2)
            //{
            //    return "Error while adding docker file";
            //}
            //else if (gitFileAdd == 3)
            //{
            //    return "Error while pushing changes to Git";
            //}

            //YAMLStrings YAMLMod = new YAMLStrings();
            //string str=YAMLMod.GetDeploymentYaml();

            //return "Docker file added successfully";
        }



        private int CloneGit()
        {
            GitRepositoryManager gitMgr = new GitRepositoryManager();
            if (gitMgr.CloneRepo(path, url, userName, password) == 0)
            {
                return 0;
            }
            else
            {
                return 1;
            }
        }

        private int AddDockerFile()
        {
            GitRepositoryManager gitMgr = new GitRepositoryManager();
            if (cmsData.ApplicationDetails.Technology == ".Net")
            {
                if (gitMgr.AddDockerFileToProjDOTNET(cmsData.ApplicationDetails.Version, cmsData.SourceCodeDetails.Application_Name, cmsData.SourceCodeDetails.Application_Name, path) == 0)
                {
                    return 0;
                }
                else
                {
                    return 2;
                }

            }
            else if (cmsData.ApplicationDetails.Technology == "Java")
            {
                if (gitMgr.AddDockerFileToProjJava(cmsData.ApplicationDetails.Version, cmsData.SourceCodeDetails.Application_Name, cmsData.SourceCodeDetails.Application_Name, path) == 0)
                {
                    return 0;
                }
                else
                {
                    return 2;
                }
            }

            return 3;
        }

        private int CommitNPushChanges()
        {
            try
            {
                GitRepositoryManager gitrep = new GitRepositoryManager(userName, password, url, path);
                gitrep.CommitAllChanges("Docker file added");
                gitrep.PushCommits("origin", "master");
                return 0;
            }
            catch (Exception)
            {
                return 1;
            }
        }
            





        }
}