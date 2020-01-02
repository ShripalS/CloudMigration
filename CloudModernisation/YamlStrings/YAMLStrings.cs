using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication.ExtendedProtection;
using System.Text;
using System.Threading.Tasks;

namespace CloudModernisation.YamlStrings
{
    public class YAMLStrings
    {
        private readonly string YAMLDeployment = @"apiVersion: apps/v1
kind: Deployment
metadata:
  name: <deplymentName>
spec:
  replicas: <replicas>
  selector:
    matchLabels:
      app: <applicationName>
  template:
    metadata:
      labels:
        app: <applicationName>
    spec:
      containers:
      - name: backend
        image: <ContainerImage>
        ports:
        - containerPort: <containerPort>
        resources:
          requests:
            memory: ""<CPUReqMemory>""
            cpu: ""<CPURequests>""
          limits:
            memory: ""<LimitMemory>""
            cpu: ""<LimitRequests>""         
      imagePullSecrets:
      - name: <imagePullSecret>";

        private readonly string YAMLService = @"apiVersion: v1
kind: Service
metadata:
  name: <serviceName>
spec:
  type: ClusterIP
  ports:
  - port: <port>
    targetPort: <targetPort>
  selector:
    app: <selector>";

        private readonly string YAMLIngress = @"apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: <ingressName>
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/ssl-redirect: ""false""
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  rules:
  - http:
      paths:
      - backend:
          serviceName: <serviceName>
          servicePort: <servicePort>
        path: <path>";

        public string GetDeploymentYaml(string deplymentName, string replicas, string applicationName, string containerImage, string containerPort, string CPUReqMem, string CPUReq, string limMem, string limReq, string imagePullSecret)
        {
            StringBuilder sb = new StringBuilder(YAMLDeployment);
            sb.Replace("<deplymentName>", deplymentName.ToLower());
            sb.Replace("<replicas>", replicas);
            sb.Replace("<applicationName>", applicationName);
            sb.Replace("<ContainerImage>", containerImage);
            sb.Replace("<containerPort>", containerPort);
            sb.Replace("<CPUReqMemory>", CPUReqMem);
            sb.Replace("<LimitMemory>", limMem);
            sb.Replace("<CPURequests>", CPUReq);
            sb.Replace("<LimitRequests>", limReq);
            sb.Replace("<imagePullSecret>", imagePullSecret);
            return sb.ToString();
        }

        public string GetServiceDetailsYaml(string serviceName, string port, string targetPort, string selector)
        {
            StringBuilder sb = new StringBuilder(YAMLService);
            sb.Replace("<serviceName>", serviceName);
            sb.Replace("<port>", port);
            sb.Replace("<targetPort>", targetPort);
            sb.Replace("<selector>", selector);

            return sb.ToString();
        }

        public string GetIngressDetailsYaml(string ingressName,string serviceName, string servicePort, string path)
        {
            StringBuilder sb = new StringBuilder(YAMLIngress);
            sb.Replace("<ingressName>", ingressName);
            sb.Replace("<serviceName>", serviceName);
            sb.Replace("<servicePort>", servicePort);
            sb.Replace("<path>", path);

            return sb.ToString();

        }
    }
}
