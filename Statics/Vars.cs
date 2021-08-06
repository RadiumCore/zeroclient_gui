using smartchain;
using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.Threading;
using System.Collections.ObjectModel;
using System.Collections.Generic;
using System.Linq;
using System.Collections.Concurrent;

namespace GUI
{
    internal static class Vars
    {
        public static string server_version = "92";
        public static ManualResetEvent shutdown_Event = new ManualResetEvent(false);
       
        public static ConfigFileReader config = new ConfigFileReader();
        public static WalletIface WalletInterface = new WalletIface();
        public static SmartChainIface SmartChainInterface = new SmartChainIface();
        public static BitnetClient bcMain = new BitnetClient();
        public static LogWriter logger = new LogWriter(Boolean.Parse(config.lookup("testnet")));
        public static AccountManager Accounts = new AccountManager();
        public static int language { get; set; } = 1;

        public static Info info = new Info();
        public static IPFS_code ipfs_interface = new IPFS_code();

        public static stakinginfo staking_info = new stakinginfo();
        public static JObject stats = new JObject();
        public static DateTime stats_update = DateTime.Now;

        public static bool wallet_connected = false;

        public static ConcurrentQueue<string> smart_tx_que = new ConcurrentQueue<string>();


        public static void Send_smart_tx_que()
        {
            //needed to store tx's we attempt to send, in case there is a send error.
            Collection<string> sent_txs = new Collection<string>();
           

            if (smart_tx_que.Count == 0)
                return;

            Bundle bundle = new Bundle();

            string hex = "";
            if (smart_tx_que.Count == 1)
            {
                smart_tx_que.TryDequeue(out hex);
                sent_txs.Add(hex);
            }
            else
            {
                while (smart_tx_que.Count > 0)
                {
                    string tx = "";
                    smart_tx_que.TryDequeue(out tx);
                   if(tx.Length <= bundle.remaining())
                    {
                        bundle.add(tx);
                        sent_txs.Add(tx);
                    }
                    else
                    {
                        smart_tx_que.Enqueue(tx);
                        break;
                    }                                      
                }
                hex = bundle.Compress();
            }

          
           
            decimal tx_fee = Cost.GetCost(hex, Vars.WalletInterface.walletModel.Info.blocks, Boolean.Parse(Vars.config.lookup("testnet")));

            JObject result = new JObject();

            string sender_address = Vars.config.lookup("MSDR_Address");


            string final_tx = "";

            IEnumerable<utxo> sender_utxos = Utxo_Server.utxos.Values.Where(i => i.address == sender_address && i.value > tx_fee);
            //IEnumerable<utxo> sender_utxos1 = UtxoServer.utxos.Where(i => i.address == sender_address);
            //IEnumerable<utxo> sender_utxos2 = UtxoServer.utxos.Where(i => i.value > 1);


            // unable to send txs
            if (sender_utxos.Count() == 0)
            {
                foreach (string tx in sent_txs)
                    smart_tx_que.Enqueue(tx);
                insufficent_funds_notification();
                return;
            }

            try
            {
                final_tx = Vars.WalletInterface.BuildSefFundedSmartTx(hex, tx_fee, sender_address, sender_utxos.First());
                string signedtx = Vars.bcMain.signrawtransaction(final_tx);
                string txid = Vars.bcMain.sendrawtransaction(signedtx);

            }
            catch{
                foreach (string tx in sent_txs)
                    smart_tx_que.Enqueue(tx);
                insufficent_funds_notification();
                return;
            }



            if (smart_tx_que.Count > 0)
                Send_smart_tx_que();


        }


        public static void insufficent_funds_notification()
        {

        }


        public static void Update_StakingInfo()
        {
            if (staking_info.t_updated.AddSeconds(2) > DateTime.UtcNow) return; staking_info = new stakinginfo(WalletInterface.BC.GetStakingInfo());
        }


        public static void update_stats()
        {

            if (DateTime.Compare(stats_update.AddMinutes(1), DateTime.Now) > 0)
            {
                return;
            }

            stats = new JObject();


            stats.Add("blockcount", WalletInterface.walletModel.Info.blocks);
            stats.Add("stakereturn", Math.Round(((.485 * 1440 * 365) / (WalletInterface.walletModel.Stakinginfo.netstakeweight / 100000000)) * 100, 2));
            stats.Add("stakeweight", WalletInterface.walletModel.Stakinginfo.netstakeweight);


            using (WebClient wc = new WebClient())
            {
                JObject rad_ticker = JObject.Parse(wc.DownloadString("https://api.coingecko.com/api/v3/coins/radium"));
                

                stats.Add("supply", WalletInterface.walletModel.Info.total_amount);
                stats.Add("btcprice", double.Parse(rad_ticker["market_data"]["current_price"]["btc"].ToString()));

                stats.Add("marketcap", double.Parse(rad_ticker["market_data"]["market_cap"]["usd"].ToString()));
                stats.Add("usdprice", double.Parse(rad_ticker["market_data"]["current_price"]["usd"].ToString()));
                stats.Add("tradevolume", double.Parse(rad_ticker["market_data"]["total_volume"]["usd"].ToString()));
               

                stats_update = DateTime.Now;
            }


            // public static Timer t_keepalive = new Timer(10000);
            //  public static void Set_shutdown() { shutdown = true; }
            //  public static DateTime last_ui_call = DateTime.UtcNow;
            //public static void T_keepalive_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
            //{
            //   if (last_ui_call.AddSeconds(10) < DateTime.UtcNow) {
            // WalletInterface.HardShutdown();
            //shutdown = true;
            // }
            // }
        }
    }


    internal static class Status {
        public static bool IPFS { get; set; } = false;

    }

}