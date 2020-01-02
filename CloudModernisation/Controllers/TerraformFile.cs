using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudModernisation.Controllers
{
    public class TerraformFile
    {
        public string ClusterName { get; set; }
        public string ResourceGroup { get; set; }
        public string Region { get; set; }
        public string DNSPrefix { get; set; }
        public string NodeCount { get; set; }
        public string NodeSize { get; set; }
        public string ClientID { get; set; }
        public string ClientSecret { get; set; }
       

        public TerraformFile(string clusterName, string resourceGroup, string region, string dNSPrefix, string nodeCount, string nodeSize, string clientID, string clientSecret)
        {
            ClusterName = clusterName;
            ResourceGroup = resourceGroup;
            Region = region;
            DNSPrefix = dNSPrefix;
            NodeCount = nodeCount;
            NodeSize = nodeSize;
            ClientID = clientID;
            ClientSecret = clientSecret;
        }

        public string GetTerraformString()
        {
            StringBuilder sb = new StringBuilder();

            sb.Append("resource \"azurerm_resource_group\" \"" + ClusterName + "\" {");
            sb.Append(Environment.NewLine);
            sb.Append("name     = \"" + ResourceGroup + "\"");
            sb.Append(Environment.NewLine);
            sb.Append("location = \"" + Region + "\"");
            sb.Append(Environment.NewLine);
            sb.Append("}");
            sb.Append(Environment.NewLine);
            sb.Append(Environment.NewLine);
            sb.Append("resource \"azurerm_kubernetes_cluster\" \"" + ClusterName + "\" {");
            sb.Append(Environment.NewLine);
            sb.Append("name = \"" + ClusterName + "\"");
            sb.Append(Environment.NewLine);
            sb.Append("location = azurerm_resource_group."+ ClusterName + ".location");
            sb.Append(Environment.NewLine);
            sb.Append("resource_group_name = azurerm_resource_group." + ClusterName + ".name");
            sb.Append(Environment.NewLine);
            sb.Append("dns_prefix = \"" + DNSPrefix + "\"");
            sb.Append(Environment.NewLine);
            sb.Append(Environment.NewLine);
            sb.Append("default_node_pool {");
            sb.Append(Environment.NewLine);
            sb.Append("name = \"default\"");
            sb.Append(Environment.NewLine);
            sb.Append("node_count = " + NodeCount);
            sb.Append(Environment.NewLine);
            sb.Append("vm_size = \"" + NodeSize + "\"");
            sb.Append(Environment.NewLine);
            sb.Append("}");
            sb.Append(Environment.NewLine);
            sb.Append(Environment.NewLine);
            sb.Append("service_principal {");
            sb.Append(Environment.NewLine);
            sb.Append("client_id = \"" + ClientID + "\"");
            sb.Append(Environment.NewLine);
            sb.Append("client_secret = \"" + ClientSecret + "\"");
            sb.Append(Environment.NewLine);
            sb.Append("}");
            sb.Append(Environment.NewLine);
            sb.Append("}");
            sb.Append(Environment.NewLine);
            sb.Append(Environment.NewLine);
            sb.Append("output \"client_certificate\" {");
            sb.Append(Environment.NewLine);
            sb.Append("value = azurerm_kubernetes_cluster." + ClusterName + ".kube_config.0.client_certificate");
            sb.Append(Environment.NewLine);
            sb.Append("}");
            sb.Append(Environment.NewLine);
            sb.Append(Environment.NewLine);
            sb.Append("output \"kube_config\" {");
            sb.Append(Environment.NewLine);
            sb.Append("value = azurerm_kubernetes_cluster."+ClusterName+".kube_config_raw");
            sb.Append(Environment.NewLine);
            sb.Append("}");

            return sb.ToString();
        }

        
    }
}
