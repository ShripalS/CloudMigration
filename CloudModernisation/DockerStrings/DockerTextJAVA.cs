using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudModernisation.DockerStrings
{
    public class DockerTextJAVA
    {
        public string GetJAVASourceDockerText(string version, string projectName)
        {
            StringBuilder javaStr = new StringBuilder();
            javaStr.Append("# Start with a base image containing Java runtime");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("FROM " + version);
            javaStr.Append(Environment.NewLine);
            javaStr.Append("# Add a volume pointing to /tmp");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("VOLUME /tmp");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("# Make port 8080 available to the world outside this container");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("EXPOSE 8080");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("# The application's jar file");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("ARG JAR_FILE=");
            javaStr.Append("./target/");
            javaStr.Append(projectName + ".jar");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("	# Add the application's jar to the container");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("ADD ${JAR_FILE} ./target/" + projectName + ".jar");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("# Run the jar file ");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("ENTRYPOINT");
            javaStr.Append(" [");
            javaStr.Append("\"java\"");
            javaStr.Append(",");
            javaStr.Append("\"-Djava.security.egd=file:/dev/./urandom\",");
            javaStr.Append("\"-jar\",");
            javaStr.Append("\"/" + projectName + ".jar" + "\"");
            javaStr.Append("]");

            return javaStr.ToString();
        }

        public string GetJAVABinaryDockerText(string version, string projectName)
        {
            StringBuilder javaStr = new StringBuilder();

            javaStr.Append("# Start with a base image containing Java runtime");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("FROM "+ version);
            javaStr.Append(Environment.NewLine);
            javaStr.Append("# Add a volume pointing to /tmp");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("VOLUME /tmp");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("# Make port 8080 available to the world outside this container");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("EXPOSE 8080");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("# The application's jar file");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("ARG JAR_FILE=");
            javaStr.Append(Environment.NewLine);
            javaStr.Append(projectName + ".jar");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("	# Add the application's jar to the container");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("ADD ${JAR_FILE} " + projectName + ".jar");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("# Run the jar file ");
            javaStr.Append(Environment.NewLine);
            javaStr.Append("ENTRYPOINT ");
            javaStr.Append("[");
            javaStr.Append("\"java\"");
            javaStr.Append(",");
            javaStr.Append("\"-Djava.security.egd=file:/dev/./urandom\",");
            javaStr.Append("\"-jar\",");
            javaStr.Append("\"/" + projectName + ".jar" + "\"");
            javaStr.Append("]");

            return javaStr.ToString();
        }


    }
}
