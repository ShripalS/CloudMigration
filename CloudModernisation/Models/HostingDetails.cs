using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CloudModernisation.Models
{
    public class HostingDetails
    {
        public string Host { get; set; }
        public string Cluster_Created { get; set; }
        public string ACR_Name { get; set; }
        public string Resource_Group { get; set; }
        public string Cluster_Name { get; set; }
        public string Region { get; set; }
        public string Version { get; set; }
        public string DNS_Name_Prefix { get; set; }
        public string Node_Count { get; set; }
        public string Node_Size { get; set; }
        public string Service_Principle_Client_ID { get; set; }
        public string Service_Principle_Client_Secret { get; set; }
    }

}
