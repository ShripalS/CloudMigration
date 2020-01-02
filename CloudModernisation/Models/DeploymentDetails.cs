using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CloudModernisation.Models
{
    public class DeploymentDetails
    {
        public string Deployment_Name { get; set; }
        public string Application_Name { get; set; }
        public string Replicas { get; set; }
        public string Container_Port { get; set; }
        public string Node_Selector { get; set; }
        public string Container_Name { get; set; }
        public string Container_Image { get; set; }
        public string CPU_Requests { get; set; }
        public string CPU_Requests_Memory { get; set; }
        public string CPU_Limits { get; set; }
        public string CPU_Limits_Memory { get; set; }
        public string Image_Pull_Secrets { get; set; }
    }
}
