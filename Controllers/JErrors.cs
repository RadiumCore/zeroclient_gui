using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GUI
{
    public static class JErrors
    {

        public static JObject Junauthorized = new JObject
        {
            { "sucess", false },
            { "message", "unauthorized" },
        };

        public static JObject JAccountsNotEnabled = new JObject
        {
            { "sucess", false },
            { "message", "accounts not enabled" },
        };
    }
}
