using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace src.config
{
    public class ConfigOcelot
    {
        public string BaseUrl { get; set; }
        public string ServiceName { get; set; } 
        public string ServiceId_1 { get; set; }
        public string ServiceHost_1 { get; set; }
        public string ServicePort_1 { get; set; }
        public string ServiceId_2 { get; set; }
        public string ServiceHost_2 { get; set; }
        public string ServicePort_2 { get; set; }

        public ConfigOcelot()
        {
            BaseUrl = Environment.GetEnvironmentVariable("BaseUrl") ?? "http://localhost:8080";
            ServiceName = "ApiGateway";
            ServiceId_1 = Environment.GetEnvironmentVariable("ServiceId_1") ?? "1";
            ServiceHost_1 = Environment.GetEnvironmentVariable("ServiceHost_1") ?? "http://localhost";
            ServicePort_1 = Environment.GetEnvironmentVariable("ServicePort_1") ?? "5001";
            ServiceId_2 = Environment.GetEnvironmentVariable("ServiceId_2") ?? "2";
            ServiceHost_2 = Environment.GetEnvironmentVariable("ServiceHost_2") ?? "http://localhost";
            ServicePort_2 = Environment.GetEnvironmentVariable("ServicePort_2") ?? "5002";
        }

        
    }
}