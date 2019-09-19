using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Text;

namespace SmartChain.Web.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        public static ConfigFileReader config = new ConfigFileReader();
        private static string endpoint = config.lookup("api_backup");        
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }


        [HttpGet("{*url}", Order = int.MaxValue)]
        public IActionResult CatchAllGet()
        {
            if (Request.Method == "GET")
            {
                var request = (HttpWebRequest)WebRequest.Create(endpoint + Request.Path);
                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                return Content(responseString);
            }


            return View();
        }

        [HttpPost("{*url}", Order = int.MaxValue)]
        public IActionResult CatchAllPost()
        {

            if (Request.Method == "POST")
            {
                var request = (HttpWebRequest)WebRequest.Create(endpoint + Request.Path);

                request.Method = "POST";
                request.ContentType = "application/json";



                using (var stream = request.GetRequestStream())
                {
                    Request.Body.CopyTo(stream);
                }

                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                return Content(responseString);
            }

            return View();
        }

    }
}