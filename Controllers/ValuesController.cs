using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.IO;
using System.Net;

namespace SmartChain.Web.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller 
    {

       


        bool dev = false;

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
                var request = (HttpWebRequest)WebRequest.Create(Endpoints.api_endpoint + Request.Path);
                var response = (HttpWebResponse)request.GetResponse();
                var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                return Content(responseString);
            }


            return View();
        }

       






    }
}