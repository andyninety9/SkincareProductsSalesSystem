using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.ElasticSearch
{
    public class ElasticSearchConfig
    {
        public string ElasticSearchHost { get; set; }
        public string ElasticSearchPort { get; set; }
        public string ElasticSearchScheme { get; set; }
        public string ElasticSearchUri => $"{ElasticSearchScheme}://{ElasticSearchHost}:{ElasticSearchPort}";

        public ElasticSearchConfig()
        {
            ElasticSearchHost = Environment.GetEnvironmentVariable("ELASTICSEARCH_HOST") ?? "localhost";
            ElasticSearchPort = Environment.GetEnvironmentVariable("ELASTICSEARCH_PORT") ?? "9200";
            ElasticSearchScheme = Environment.GetEnvironmentVariable("ELASTICSEARCH_SCHEME") ?? "http";
        }

        public string GetElasticSearchUri()
        {
            return ElasticSearchUri;
        }

    }
}