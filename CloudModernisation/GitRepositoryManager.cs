using CloudModernisation.Controllers;
using CloudModernisation.DockerStrings;
using CloudModernisation.YamlStrings;
using LibGit2Sharp;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Text;
using System.Threading.Tasks;

namespace CloudModernisation
{
    public class GitRepositoryManager
    {
        private readonly string _repoSource;
        private readonly UsernamePasswordCredentials _credentials;
        private readonly DirectoryInfo _localFolder;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="localPath"></param>
        /// <param name="URL"></param>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public int CloneRepo(string localPath,string URL, string userName, string password) 
        {
            try
            {
                CloneOptions co = new CloneOptions
                {
                    CredentialsProvider = (_url, _user, _cred) => new UsernamePasswordCredentials { Username = userName, Password = password }
                };
                Repository.Clone(URL, localPath, co);
                //Repository.Clone(URL, localPath);
                return 0;
            }
            catch (Exception ex)
            {

                return 1;
            }
            
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="GitRepositoryManager" /> class.
        /// </summary>
        /// <param name="username">The Git credentials username.</param>
        /// <param name="password">The Git credentials password.</param>
        /// <param name="gitRepoUrl">The Git repo URL.</param>
        /// <param name="localFolder">The full path to local folder.</param>
        
        public GitRepositoryManager()
        {

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="gitRepoUrl"></param>
        /// <param name="localFolder"></param>
        public GitRepositoryManager(string username, string password, string gitRepoUrl, string localFolder)
        {
            var folder = new DirectoryInfo(localFolder);

            if (!folder.Exists)
            {
                throw new Exception(string.Format("Source folder '{0}' does not exist.", _localFolder));
            }

            _localFolder = folder;

            _credentials = new UsernamePasswordCredentials
            {
                Username = username,
                Password = password
            };

            _repoSource = gitRepoUrl;
        }

        /// <summary>
        /// Commits all changes.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <exception cref="System.Exception"></exception>
        public void CommitAllChanges(string message)
        {
            using (var repo = new Repository(_localFolder.FullName))
            {
                var files = _localFolder.GetFiles("*", SearchOption.AllDirectories).Select(f => f.FullName);

                Commands.Stage(repo, files);
                repo.Commit("updating files..", new Signature(_credentials.Username, "Shripalsmss@gmail.com", DateTimeOffset.Now),
                new Signature(_credentials.Username, "Shripalsmss@gmail.com", DateTimeOffset.Now));

            }
        }

        /// <summary>
        /// Pushes all commits.
        /// </summary>
        /// <param name="remoteName">Name of the remote server.</param>
        /// <param name="branchName">Name of the remote branch.</param>
        /// <exception cref="System.Exception"></exception>
        public void PushCommits(string remoteName, string branchName)
        {
            using (var repo = new Repository(_localFolder.FullName))
            {
                var remote = repo.Network.Remotes.FirstOrDefault(r => r.Name == remoteName);
                if (remote == null)
                {
                    repo.Network.Remotes.Add(remoteName, _repoSource);
                    remote = repo.Network.Remotes.FirstOrDefault(r => r.Name == remoteName);
                }

                var options = new PushOptions
                {
                    CredentialsProvider = (url, usernameFromUrl, types) => _credentials
                };

                repo.Network.Push(remote, "refs/heads/master", options);
            }
        }

        
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DOTNETFramework"></param>
        /// <param name="applicationName"></param>
        /// <param name="FolderName"></param>
        /// <param name="localpath"></param>
        /// <returns></returns>
        public int AddDockerFileToProjDOTNET(string DOTNETFramework, string applicationName, string FolderName, string localpath)
        {
            try
            {
                string dockerStr;
                DockerTextDotNet dockr = new DockerTextDotNet();

                dockerStr = dockr.GetDockerStringWeb(DOTNETFramework, applicationName, FolderName, localpath);

                //using StreamWriter outputFile = new StreamWriter(Path.Combine(localpath, "dockerfile"));
                //outputFile.WriteLine(dockerStr);
                WriteToFile(localpath,dockerStr, "dockerfile");

                return 0;
            }
            catch (Exception)
            {

                return 1;
            }
            
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="version"></param>
        /// <param name="applicationName"></param>
        /// <param name="FolderName"></param>
        /// <param name="localPath"></param>
        /// <returns></returns>
        public int AddDockerFileToProjJava(string version, string applicationName, string FolderName, string localPath)
        {
            try
            {
                string dockerStr;
                DockerTextJAVA javaStr = new DockerTextJAVA();

                dockerStr = javaStr.GetJAVASourceDockerText(version, applicationName);

                WriteToFile(localPath, dockerStr,"dockerfile");

                return 0;
            }
            catch (Exception)
            {

                return 1;
            }
           
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="localpath"></param>
        /// <param name="fileContent"></param>
        /// <param name="fileName"></param>
        public void WriteToFile(string localpath, string fileContent, string fileName)
        {
            using StreamWriter outputFile = new StreamWriter(Path.Combine(localpath, fileName));
            outputFile.WriteLine(fileContent);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public int CreateUtilsFolder(string path)
        {
            if (Directory.Exists(path))
            {
                Console.WriteLine("The path exists already.");
                return 1;
            }

            // Try to create the directory.
            Directory.CreateDirectory(path);

            return 0;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="clusterName"></param>
        /// <param name="resourceGroup"></param>
        /// <param name="region"></param>
        /// <param name="dNSPrefix"></param>
        /// <param name="nodeCount"></param>
        /// <param name="nodeSize"></param>
        /// <param name="clientID"></param>
        /// <param name="clientSecret"></param>
        /// <param name="path"></param>
        /// <returns></returns>
        public int CreateTerraformFile(string clusterName, string resourceGroup, string region, string dNSPrefix, string nodeCount, string nodeSize, string clientID, string clientSecret,string path)
        {
            try
            {
                TerraformFile terFile = new TerraformFile(clusterName, resourceGroup, region, dNSPrefix, nodeCount, nodeSize, clientID, clientSecret);
                String terraStr = terFile.GetTerraformString();

                WriteToFile(path, terraStr, "main.tf");

                return 0;
            }
            catch (Exception)
            {

                return 1;
            }
            

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="YAMLPath"></param>
        /// <param name="deploymentName"></param>
        /// <param name="replicas"></param>
        /// <param name="applicationName"></param>
        /// <param name="containerImage"></param>
        /// <param name="containerPort"></param>
        /// <param name="CPUReqMem"></param>
        /// <param name="CPUReq"></param>
        /// <param name="limMem"></param>
        /// <param name="limReq"></param>
        /// <param name="imagePullSecret"></param>
        /// <returns></returns>
        public int CreateDeploymentYamlFile(string YAMLPath, string deploymentName, string replicas, string applicationName, string containerImage, string containerPort, string CPUReqMem, string CPUReq, string limMem, string limReq, string imagePullSecret)
        {
            try
            {
                YAMLStrings yaml = new YAMLStrings();
                string deploymentStr = yaml.GetDeploymentYaml(deploymentName, replicas, applicationName, containerImage, containerPort, CPUReqMem, CPUReq, limMem, limReq, imagePullSecret);
                string filePath = Path.Combine(YAMLPath, "deployment.yaml");

                if (File.Exists(filePath))
                {
                    File.WriteAllText(filePath, String.Empty);
                    File.WriteAllText(filePath, deploymentStr);
                }
                else
                {
                    WriteToFile(YAMLPath, deploymentStr, "deployment.yaml");
                }

                return 0;
            }
            catch (Exception)
            {

                throw;
            }
            
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="YAMLPath"></param>
        /// <param name="serviceName"></param>
        /// <param name="port"></param>
        /// <param name="targetPort"></param>
        /// <param name="selector"></param>
        /// <returns></returns>
        public int CreateServiceYamlFile(string YAMLPath, string serviceName, string port, string targetPort, string selector)
        {
            try
            {
                YAMLStrings yaml = new YAMLStrings();
                string serviceStr = yaml.GetServiceDetailsYaml(serviceName, port, targetPort, selector);
                string filePath = Path.Combine(YAMLPath, "service.yaml");

                if (File.Exists(filePath))
                {
                    File.WriteAllText(filePath, String.Empty);
                    File.WriteAllText(filePath, serviceStr);
                }
                else
                {
                    WriteToFile(YAMLPath, serviceStr, "service.yaml");
                }

                return 0;
            }
            catch (Exception)
            {

                return 1;
            }

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="YAMLPath"></param>
        /// <param name="ingressName"></param>
        /// <param name="serviceName"></param>
        /// <param name="servicePort"></param>
        /// <param name="path"></param>
        /// <returns></returns>
        public int CreateIngressYamlFile(string YAMLPath, string ingressName, string serviceName, string servicePort, string path)
        {
            try
            {
                YAMLStrings yaml = new YAMLStrings();
                string ingressStr = yaml.GetIngressDetailsYaml(ingressName, serviceName, servicePort, path);
                string filePath = Path.Combine(YAMLPath, "ingress.yaml");

                if (File.Exists(filePath))
                {
                    File.WriteAllText(filePath, String.Empty);
                    File.WriteAllText(filePath, ingressStr);
                }
                else
                {
                    WriteToFile(YAMLPath, ingressStr, "ingress.yaml");
                }

                return 0;
            }
            catch (Exception)
            {

                return 1;
            }

        }
    }
}
