using Newtonsoft.Json.Linq;
using SmartChain.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace SmartChain.Web.Controllers
{
    public static class Endpoints
    {
        public static ConfigFileReader config = new ConfigFileReader();

        private static string _api_endpoint = "";
        private static bool Testing_In_Progress = false;

        public static string api_endpoint
        {
            get {
                while (Testing_In_Progress)
                    System.Threading.Thread.Sleep(10);
                if(_api_endpoint == "") 
                    SetAPI();
                return _api_endpoint; }
            set { _api_endpoint = value; }
        }

        private static string _utxo_endpoint = "";

        public static string utxo_endpoint
        {
            get
            {
                if (_utxo_endpoint == "")
                    SetUtxo();
                return _utxo_endpoint;
            }
            set { _utxo_endpoint = value; }
        }



        public static void SetAPI()
        {
            Testing_In_Progress = true;
            JArray apis = config.lookupArray("api_servers");
            var TaskCollection = new List<Task<string>>();
            foreach (string endpoint in apis)
            {
                Task<string> t = new Task<string>(() => TestApi(endpoint, "/api/public/sctop"));
                t.Start();
                TaskCollection.Add(t);
            }

            string first_response = TaskCollection[Task.WaitAny(TaskCollection.ToArray())].Result;
            if (first_response != "")
            {
                api_endpoint = first_response;
                Testing_In_Progress = false;
            }
               
        }
        public static void SetUtxo()
        {
            JArray apis = config.lookupArray("utxo_servers");
            var TaskCollection = new List<Task<string>>();
            foreach (string endpoint in apis)
            {
                Task<string> t = new Task<string>(() => TestApi(endpoint, "/api/utxo"));
                t.Start();
                TaskCollection.Add(t);
            }

            utxo_endpoint = TaskCollection[Task.WaitAny(TaskCollection.ToArray())].Result;

        }

        private static string TestApi(string endpoint, string path)
        {

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(endpoint + path);
            try
            {
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            }
            catch{
                return "";
            }
           
            return endpoint;

        }


    }
}
