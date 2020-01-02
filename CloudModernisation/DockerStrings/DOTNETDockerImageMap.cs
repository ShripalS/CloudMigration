using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CloudModernisation
{
    public class DOTNETDockerImageMap
    {
        private static readonly Dictionary<string,string> DOTNETBaseIMGMap = new Dictionary<string, string>(){{".Net 3.5", "mcr.microsoft.com/dotnet/framework/sdk:3.5" }
                                                                                                                     ,{".Net 4.6.2", "mcr.microsoft.com/dotnet/framework/sdk:4.6.2" }
                                                                                                                     ,{".Net 4.7.1", "mcr.microsoft.com/dotnet/framework/sdk:4.7.1" }
                                                                                                                     ,{".Net 4.7.2", "mcr.microsoft.com/dotnet/framework/sdk:4.7.2" }
                                                                                                                     ,{".Net 4.7", "mcr.microsoft.com/dotnet/framework/sdk:4.7" }
                                                                                                                     ,{".Net 4.8", "mcr.microsoft.com/dotnet/framework/sdk:4.8" } };

        private static readonly Dictionary<string, string> DOTNETRunTimeIMGMap = new Dictionary<string, string>() { {".Net 3.5", "mcr.microsoft.com/dotnet/framework/aspnet:3.5" }
                                                                                                                     ,{".Net 4.6.2", "mcr.microsoft.com/dotnet/framework/aspnet:4.6.2" }
                                                                                                                     ,{".Net 4.7.1", "mcr.microsoft.com/dotnet/framework/aspnet:4.7.1" }
                                                                                                                     ,{".Net 4.7.2", "mcr.microsoft.com/dotnet/framework/aspnet:4.7.2" }
                                                                                                                     ,{".Net 4.7", "mcr.microsoft.com/dotnet/framework/aspnet:4.7" }
                                                                                                                     ,{".Net 4.8", "mcr.microsoft.com/dotnet/framework/aspnet:4.8" } };

       public static string GetBaseImage(string DOTNETVersion)
        {
            return DOTNETBaseIMGMap[DOTNETVersion];
        }

        public static string GetrunTimeImage(string DOTNETVersion)
        {
            return DOTNETRunTimeIMGMap[DOTNETVersion];
        }
    }
}
