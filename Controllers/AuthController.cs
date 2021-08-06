using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using smartchain;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using static smartchain.event_delegates;

namespace GUI.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller, ilogconsumer
    {
        public event delegate_string LogInfo;
        public event delegate_string LogDebug;
        public event delegate_string LogVerbose;
        public event delegate_string LogWarning;
        public event delegate_error LogError;
        public event delegate_error LogFatal;



        bool dev = false;

        public AuthController()
        {
            Vars.logger.add_consumer(this);
#if RELEASE
            dev = false;
#endif
        }

        [HttpGet]
        public JObject Get()
        {
            return null;
        }


        [HttpPost]
        [Route("getmyinfo")]
        public JObject GetMyInfo([FromBody] JObject data)
        {
            if (!Vars.Accounts.enabled) return JErrors.JAccountsNotEnabled;
            JObject res = new JObject();


            //make sure signed method matches called method
            if (data["method"].ToString() != "getmyinfo")
                return JErrors.Junauthorized;
            //make sure signature is recent
            if (Vars.WalletInterface.GetBlockConfirms(data["block"].ToString()) > 2)
                return JErrors.Junauthorized;

            //validate request signature
            NBitcoin.PubKey key = new NBitcoin.PubKey(data["pubkey"].ToString());
            var verified = key.VerifyMessage(data["block"].ToString() + data["method"].ToString(), data["sig"].ToString());

            if (!verified)
                return JErrors.Junauthorized;

            string address = key.GetAddress(NBitcoin.Network.RadiumMain).ToString();



            if (!Vars.SmartChainInterface.IsAddressRegestered(address))
                return JErrors.Junauthorized;


            return Vars.Accounts.GetAccountInfo(address).tojson();
        }

        [HttpPost]
        [Route("BuildSmartTx")]
        public JObject BuildSmartTx([FromBody] JObject data)

        {
            JObject result = new JObject();

            string sender_address = data["identity"].ToString();
            string hex = data["hex"].ToString();
            decimal tx_fee = decimal.Parse(data["fee"].ToString());
            string final_tx;
            decimal t = tx_fee;



            JArray test = new JArray();


            IEnumerable<utxo> sender_utxos = Utxo_Server.utxos.Values.Where(i => i.address == sender_address && i.value > tx_fee);
            //IEnumerable<utxo> sender_utxos1 = UtxoServer.utxos.Where(i => i.address == sender_address);
            //IEnumerable<utxo> sender_utxos2 = UtxoServer.utxos.Where(i => i.value > 1);

            if (sender_utxos.Count() > 0)
                final_tx = Vars.WalletInterface.BuildSefFundedSmartTx(hex, tx_fee, sender_address, sender_utxos.First());
            else if (Vars.Accounts.enabled && Vars.Accounts.GetAccountInfo(sender_address).credits > 0)
            {
                final_tx = Vars.WalletInterface.BuildLocalFundedSmartTx(hex, tx_fee, sender_address);
                Vars.Accounts.SubtractCredit(sender_address, 1, "smarttx creation. HEX: " + hex);
            }
            else
            {
                string message = "No funds are avalible to create this transaction! Please send some Radium coins to " + sender_address;
                if (Vars.Accounts.enabled)
                    message += " or purchse ZeroClient credits!";
                result.Add("sucess", false);
                result.Add("message", message);
                return result;
            }



            result.Add("sucess", true);
            result.Add("message", final_tx);
            return result;
        }
    }
}