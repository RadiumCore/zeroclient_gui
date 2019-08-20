using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Diagnostics;

namespace SmartChain.Web.Controllers
{
    public class HomeController : Controller
    {
        public static ConfigFileReader config = new ConfigFileReader();
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
        [HttpGet]
        [Route("api_servers")]
        public JArray api_servers(string id)
        {
            return JArray.Parse(config.lookup("api_servers"));
        }
    }
}