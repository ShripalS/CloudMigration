using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CloudModernisation.Models
{
    public class ServiceDetails
    {
        public string Service_Name { get; set; }
        public string Port { get; set; }
        public string Target_Port { get; set; }
        public string App_Selector { get; set; }
    }
}
