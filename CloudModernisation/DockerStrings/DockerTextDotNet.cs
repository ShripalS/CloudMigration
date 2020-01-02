using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudModernisation.DockerStrings
{
    public class DockerTextDotNet
    {
        private static readonly string WebAppStrBase = "FROM {0} AS build" + Environment.NewLine +
                                                   "WORKDIR /app" + Environment.NewLine + Environment.NewLine;

        private static readonly string webAppStrSln = "# copy csproj and restore as distinct layers" + Environment.NewLine +
                                                  "COPY *.sln ." + Environment.NewLine;

        private static readonly string webAppStrCopycsproj = "COPY {0}/*.csproj ./{0}/" + Environment.NewLine;

        private static readonly string webAppStrCopyConfig = "COPY {0}/*.config ./{0}/" + Environment.NewLine;



        private static readonly string webAppStrRestore = "RUN nuget restore" + Environment.NewLine + Environment.NewLine;

        private static readonly string webAppStrCpyAll = "# copy everything else and build app" + Environment.NewLine +
                                                  "COPY {0}/. ./{0}/" + Environment.NewLine +
                                                  "WORKDIR /app/{0}" + Environment.NewLine;

        private static readonly string webAppStrBuild = "RUN msbuild /p:Configuration=Release" + Environment.NewLine + Environment.NewLine;


        private static readonly string webAppCreateImage = "FROM {0} AS runtime" + Environment.NewLine +
                                                  "WORKDIR /inetpub/wwwroot" + Environment.NewLine +
                                                  "COPY --from=build /app/{1}/. ./";

        private static string[] getWebDockerString()
        {
            string[] finalStr =new string[]{ WebAppStrBase, webAppStrSln, webAppStrCopycsproj, webAppStrCopyConfig,webAppStrRestore, webAppStrCpyAll, webAppStrBuild, webAppCreateImage}; 
            return finalStr;
        }

        public string GetDockerStringWeb(string DOTNETFramework, string applicationName, string FolderName, string localpath)
        {
            string BaseImage;
            string RunTimeImage;
            List<string> csprojDirectory = new List<string>();
            List<string> configDirectory = new List<string>();
            string[] dockerStr = DockerTextDotNet.getWebDockerString();
            StringBuilder DockerStrFinal = new StringBuilder();
            Tuple<List<string>, List<string>> dockerCsprojNConfigList;

            BaseImage = DOTNETDockerImageMap.GetBaseImage(DOTNETFramework);
            RunTimeImage = DOTNETDockerImageMap.GetrunTimeImage(DOTNETFramework);

            dockerCsprojNConfigList = GetListOfDirectoryWeb(localpath);

            csprojDirectory = dockerCsprojNConfigList.Item1;
            configDirectory = dockerCsprojNConfigList.Item2;


            DockerStrFinal.Append(string.Format(dockerStr[0].ToString(), BaseImage));
            DockerStrFinal.Append(dockerStr[1].ToString());

            foreach (string directoryName in csprojDirectory)
            {
                DockerStrFinal.Append(string.Format(dockerStr[2], directoryName));
            }

            foreach (string directoryName in configDirectory)
            {
                DockerStrFinal.Append(string.Format(dockerStr[3], directoryName));
            }

            DockerStrFinal.Append(dockerStr[4].ToString());

            foreach (string directoryName in csprojDirectory)
            {
                DockerStrFinal.Append(string.Format(dockerStr[5], directoryName));
                DockerStrFinal.Append(dockerStr[6].ToString());
            }

            DockerStrFinal.Append(string.Format(dockerStr[7].ToString(), RunTimeImage, applicationName));

            return DockerStrFinal.ToString();

        }

        private Tuple<List<string>, List<string>> GetListOfDirectoryWeb(string localPath)
        {
            string[] subDirectory = Directory.GetDirectories(localPath);
            List<string> csprojDirectory = new List<string>();
            List<string> configDirectory = new List<string>();


            foreach (var directory in subDirectory)
            {
                string[] csprojFile = Directory.GetFiles(directory, "*.csproj", SearchOption.TopDirectoryOnly);
                if (csprojFile.Length != 0)
                {
                    string dirName = new DirectoryInfo(directory).Name;
                    csprojDirectory.Add(dirName);
                }

                string[] configFile = Directory.GetFiles(directory, "*.config", SearchOption.TopDirectoryOnly);
                if (configFile.Length != 0)
                {
                    string dirName = new DirectoryInfo(directory).Name;
                    configDirectory.Add(dirName);
                }

            }
            return new Tuple<List<string>, List<string>>(csprojDirectory, configDirectory);

        }
    }
}
