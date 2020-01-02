using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CloudModernisation.Models
{
    public class SourceCodeDetails
    {
        public string Source_Code_Repository { get; set; }
        public string Application_Name { get; set; }
        public string Application_Type { get; set; }
        public string URL { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
