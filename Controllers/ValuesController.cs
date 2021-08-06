using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using smartchain;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using static smartchain.event_delegates;
using static smartchain.Types;

namespace GUI.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller, ilogconsumer
    {
        public event delegate_string LogInfo;
        public event delegate_string LogDebug;
        public event delegate_string LogVerbose;
        public event delegate_string LogWarning;
        public event delegate_error LogError;
        public event delegate_error LogFatal;



        bool dev = false;

        public ValuesController()
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

        #region "setup"


        [HttpGet]
        [Route("webstats")]
        public JObject webstats()
        {
            Vars.update_stats();

            return Vars.stats;
        }

        [HttpGet]
        [Route("getnetworkinfo")]
        public JObject getnetworkinfo()
        {
            JObject resp = new JObject();

            resp.Add("totoal_supply", decimal.Round((decimal)Vars.WalletInterface.walletModel.Info.total_amount));
            resp.Add("net_weight", decimal.Round(Vars.WalletInterface.walletModel.Stakinginfo.netstakeweight / 100000000));
            resp.Add("user_count", Vars.SmartChainInterface.SmartTxCollection.Where(i => i.type == RecordType.user).Count());
            resp.Add("smart_tx_count", Vars.SmartChainInterface.SmartTxCollection.Count());
            resp.Add("wallet_block", Vars.WalletInterface.walletModel.Info.blocks);
            resp.Add("smartchain_block", Vars.SmartChainInterface.SyncHeight);
            resp.Add("best_hash", Vars.SmartChainInterface.cBestHash());
            //resp.Add("peercount", Vars.WalletInterface.peercount.ToString());

            return resp;
        }


        #endregion "setup"






    }
}