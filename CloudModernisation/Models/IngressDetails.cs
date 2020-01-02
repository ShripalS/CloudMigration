using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CloudModernisation.Models
{
    public class IngressDetails
    {
        public string Ingress_Name { get; set; }
        public string Path { get; set; }
        public string Service_Name { get; set; }
        public string Service_Port { get; set; }
    }
}
