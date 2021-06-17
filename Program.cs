using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Threading;

namespace SmartChain.Web
{
    public class Program
    {
        public static string client_version = "1";
        public static ManualResetEvent shutdown_Event = new ManualResetEvent(false);
        public static ConfigFileReader config1 = new ConfigFileReader();
        public static int language { get; set; } = 1;
        private static X509Certificate2 cert;
        private static bool useSSL = bool.Parse(config1.lookup("useSSL"));
        public static JArray listen_urls = new JArray();
        public static int listen_port = 80;

        public static void Main(string[] args)
        {
            IConfigurationRoot config;

            if (useSSL)
            {
                config = new ConfigurationBuilder()
                             .SetBasePath(Directory.GetCurrentDirectory())
                             .AddEnvironmentVariables()
                             .AddJsonFile("certificate.json", optional: true, reloadOnChange: true)
                             .AddJsonFile($"certificate.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", optional: true, reloadOnChange: true)
                             .Build();

                var certificateSettings = config.GetSection("certificateSettings");
                string certificateFileName = certificateSettings.GetValue<string>("filename");
                string certificatePassword = certificateSettings.GetValue<string>("password");

                cert = new X509Certificate2(certificateFileName, certificatePassword);


            }
            else
            {
                config = new ConfigurationBuilder()
                                            .SetBasePath(Directory.GetCurrentDirectory())
                                            .AddEnvironmentVariables()
                                            .Build();
            }






            listen_urls = JArray.Parse(config1.lookup("listens"));
                                       

            // route all unhandled exceptions to the logger
            AppDomain currentDomain = AppDomain.CurrentDomain;

            BuildWebHost(args, config).RunAsync();

            // setup logging

            shutdown_Event.Reset();
            shutdown_Event.WaitOne();
        }

        private static void OpenBrowser(string ip)
        {
            System.Diagnostics.Process.Start("cmd", "/C start " + ip);
        }

        public static IWebHost BuildWebHost(string[] args, IConfiguration config) =>
          WebHost.CreateDefaultBuilder(args)
            // swithc to easy turn off kestral to enable chrome debugging
#if false
            .UseKestrel(
                options =>
                {
                    options.AddServerHeader = false;
                    // if SSL is to be used, make sure we listen on SSL port 443 and use our SSL cert.
                    foreach (JObject listen in listen_urls)
                    {
                        if ((bool)listen["SSL"] && useSSL)
                            options.Listen(IPAddress.Parse(listen["listen_url"].ToString()), (int)listen["listen_port"], listenOptions => { listenOptions.UseHttps(cert); });
                        else
                            options.Listen(IPAddress.Parse(listen["listen_url"].ToString()), (int)listen["listen_port"]);
                    }
                }
            )
#endif
            // set the port non-ssl requests will be forwarded to, if we are using SSL
            .UseSetting("https_port", "443")
            .UseConfiguration(config)
            .UseContentRoot(Directory.GetCurrentDirectory())
                // not used due to kestral setting listen urls/ports

                //.UseElectron(args)
                .UseStartup<Startup>()
                //.UseSetting("https_port", "8080")

                .Build();
    }
}