using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CloudModernisation.Models
{
    public class CMSData
    {
        public ApplicationDetails ApplicationDetails { get; set; }
        public SourceCodeDetails SourceCodeDetails { get; set; }
        public HostingDetails HostingDetails { get; set; }
        public DeploymentDetails DeploymentDetails { get; set; }
        public ServiceDetails ServiceDetails { get; set; }
        public IngressDetails IngressDetails { get; set; }
        public JenkinsDetails JenkinsDetails { get; set; }
    }
}
