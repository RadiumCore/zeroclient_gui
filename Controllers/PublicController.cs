using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using GUI;
using smartchain;
using static smartchain.event_delegates;
using System.Threading.Tasks;
using System.Linq;
using static smartchain.Types;
using System.Text;

namespace GUI.Controllers
{
    [Route("api/[controller]")]
    public class PublicController : Controller, ilogconsumer
    {
        public event delegate_string LogInfo;
        public event delegate_string LogDebug;
        public event delegate_string LogVerbose;
        public event delegate_string LogWarning;
        public event delegate_error LogError;
        public event delegate_error LogFatal;



        bool dev = false;

        public PublicController()
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
        [Route("Upload")]
        public async Task<IActionResult> Post([FromBody] List<IFormFile> files)
        {
            long size = files.Sum(f => f.Length);

            // full path to file in temp location
            var filePath = Path.GetTempFileName();

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                }
            }

            // process uploaded files
            // Don't rely on or trust the FileName property without validation.

            return Ok(new { count = files.Count, size, filePath });
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
        [Route("status")]
        public JObject status()
        {
            //Vars.Update_Info();

            JObject resp = new JObject();


            if (dev)
            {
                resp.Add("progress", 100);
                resp.Add("action", "complete");
                return resp;
            }


            if (Vars.WalletInterface.status.state != wallet_state.complete)
            {
                //awaiting wallet connection / loading addresses etc
                resp.Add("message", Vars.WalletInterface.status.message);
                resp.Add("progress", Vars.WalletInterface.status.progress);
            }
            else if (Vars.SmartChainInterface.status.state != smartchain_state.complete)
            {
                // syncing wallet
                resp.Add("message", Vars.SmartChainInterface.status.message);
                resp.Add("progress", Vars.SmartChainInterface.status.progress);
            }
            else
            {
                // syncing wallet
                resp.Add("message", Utxo_Server.status.message);
                resp.Add("progress", Utxo_Server.status.progress);
            }

            return resp;
        }

        [HttpGet]
        [Route("getblock")]
        public string getblock()
        {
            return Vars.WalletInterface.walletModel.Info.blocks.ToString();
        }

        [HttpGet]
        [Route("sctop")]
        public string getsctop()
        {
            return Vars.SmartChainInterface.cBestHash();
        }

        #endregion "setup"

        #region Dashboard

        [HttpGet]
        [Route("IsWalletConnected")]
        public JObject IsWalletConnected()
        {
            if (!Vars.wallet_connected)
            {
                try
                {
                    Vars.bcMain.GetInfo();
                    Vars.wallet_connected = true;
                }
                catch
                {
                }
            }

            JObject resp = new JObject();
            resp.Add("WalletConnected", Vars.wallet_connected);
            return resp;
        }

        [HttpGet]
        [Route("SyncInfo")]
        public JObject SyncInfo()
        {
            //Vars.Update_Info();

            JObject resp = new JObject();

            resp.Add("NetworkSynced", Vars.WalletInterface.walletModel.synced);
            resp.Add("NetworkBlock", Vars.WalletInterface.walletModel.Info.blocks);
            resp.Add("EstNetworkBlocks", Vars.WalletInterface.GuestimateNetworkHeight(false));
            resp.Add("WalletConnected", Vars.wallet_connected);
            resp.Add("SmartChainBlock", Vars.SmartChainInterface.SyncHeight.ToString());

            if (dev)
                resp.Add("SmartChainSynced", true);
            else
                resp.Add("SmartChainSynced", Vars.SmartChainInterface.SCSynced);
            resp.Add("peercount", Vars.WalletInterface.walletModel.PeerInfo.Count());
            return resp;
        }

        [HttpGet]
        [Route("getserverinfo")]
        public JObject getserverinfo()
        {
            JObject resp = new JObject();

            resp.Add("wallet_version", Vars.WalletInterface.walletModel.Info.version);
            resp.Add("administrator", Vars.config.lookup_or_default("administrator"));
            resp.Add("admin_contact", Vars.config.lookup_or_default("admin_contact"));
            resp.Add("server_version", Vars.server_version);

            //resp.Add("peercount", Vars.WalletInterface.peercount.ToString());

            return resp;
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

        [HttpGet]
        [Route("GetDashboardInfo")]
        public JObject GetDashboardInfo()
        {

            JObject resp = new JObject();
            resp.Add("NetworkSynced", Vars.WalletInterface.walletModel.synced);
            resp.Add("NetworkBlock", Vars.info.blocks);
            resp.Add("WalletConnected", Vars.wallet_connected);

            resp.Add("SmartChainBlock", Vars.SmartChainInterface.SyncHeight.ToString());
            resp.Add("SmartChainSynced", Vars.SmartChainInterface.SCSynced);
            resp.Add("peercount", Vars.WalletInterface.walletModel.PeerInfo.Count());

            //resp.Add("transactions", Vars.WalletInterface.walletModel.TxDictonaryJSON());

            //resp.Add("peercount", Vars.WalletInterface.peercount.ToString());

            return resp;
        }


        [HttpGet]
        [Route("gettopblock")]
        public JObject gettopblock()
        {
            JObject block = (JObject)Vars.WalletInterface.top_block();
            return block;
        }

        [HttpGet]
        [Route("getbestblockhash")]
        public string getbestblockhash()
        {
            string block = Vars.bcMain.getbestblockhash();
            NBitcoin.Key privkey = new NBitcoin.Key();
            var k = privkey.GetBitcoinSecret(NBitcoin.Network.RadiumMain);
            string s = k.ToString();
            var a = privkey.PubKey.GetAddress(NBitcoin.Network.RadiumMain);
            string userName = System.Security.Principal.WindowsIdentity.GetCurrent().Name;
            int trim = userName.LastIndexOf("\\") + 1;
            userName = userName.Substring(trim, userName.Length - trim);

            return block;
        }

        [HttpPost]
        [Route("message")]
        public void message([FromBody] JObject json)
        {
            string data = (string)json["data"];
            string message = "";
            string sig = "";
            string username;
            string address = "";
            string block = "";
            string pubkey = "";

            using (StringReader reader = new StringReader(data))
            {
                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    if (line == "###BEGIN RADIUM SIGNED MESSAGE###")
                        message = reader.ReadLine();
                    if (line == "###BEGIN RADIUM IDENTITY###")
                    {
                        username = reader.ReadLine();
                        address = reader.ReadLine();
                        pubkey = reader.ReadLine();
                        block = reader.ReadLine();
                    }
                    if (line == "###BEGIN RADIUM SIGNATURE###")
                        sig = reader.ReadLine();
                    // Do something with the line
                }
            }

            NBitcoin.PubKey key = new NBitcoin.PubKey(pubkey);
            var verified = key.VerifyMessage(address + block + message, sig);




            //JObject jmessage = JObject.Parse(message);
            //NBitcoin.PubKey test = new NBitcoin.PubKey()

            // string sig = test.SignMessage("test");


        }

        static string ToBase16String(byte[] inArray)
        {
            StringBuilder result = new StringBuilder(inArray.Length * 2);

            for (int i = 0; i < inArray.Length; i++)
            {
                result.AppendFormat("{0:X}", inArray[i]);
            }

            return result.ToString();
        }

        [HttpGet]
        [Route("getblockbyhash/{id}")]
        public JObject getblockbyhash(string id)
        {
            JObject block = (JObject)Vars.WalletInterface.get_block_by_hash(id)["result"];
            return block;
        }



        #endregion Dashboard

        #region Transactions

        //[HttpGet]
        //[Route("GetTransactions")]
        //public JArray GetTransactions()
        //{
        //    JArray resp = Vars.WalletInterface.walletModel.TxDictonaryJSON();
        //    return resp;
        //}

        [HttpPost]
        [Route("PostCreateRawTransaction")]
        public JObject PostCreateRawTransaction([FromBody] JObject data)
        {
            double inputvalue = 0;
            JArray inputarray = new JArray();
            foreach (JObject _input in data["inputs"])
            {
                JObject inputobject = new JObject();
                inputobject.Add("txid", _input["txid"]);
                inputobject.Add("vout", int.Parse(_input["index"].ToString()));
                inputarray.Add(inputobject);
                inputvalue += double.Parse(_input["value"].ToString());
            }

            double outputvalue = 0;
            JObject outputs = new JObject();

            foreach (JObject _output in data["outputs"])
            {
                outputs.Add(_output["address"].ToString(), double.Parse(_output["value"].ToString()));
                outputvalue += double.Parse(_output["value"].ToString());
            }

            JObject outputstring = new JObject();
            string rawtransaction = null;
            decimal cost = 0;

            cost = cost + 0.0001M;
            cost = cost + 0.0001M;

            JObject res = new JObject();
            try
            {
                rawtransaction = Vars.WalletInterface.BC.TryInvokeMethod("createrawtransaction", inputarray, outputs)["result"].ToString();
                res.Add("result", rawtransaction);
            }
            catch
            {
                res.Add("result", "error");
            }

            return res; //// rawtransaction;
        }

        [HttpPost]
        [Route("GetInputValue")]
        public JObject GetInputValue([FromBody] JObject data)
        {
            JObject resp = new JObject();
            resp.Add("result", Vars.WalletInterface.GetInputValue((string)data["txid"], (int)data["index"]));
            return resp;
        }

        #endregion Transactions

        #region Receiving

        //[HttpGet]
        //[Route("GetReceiving")]
        //public JArray GetReceiving()
        //{
        //    JArray resp = Vars.WalletInterface.walletModel.ReceivingDictonaryJSON();
        //    return resp;
        //}

        [HttpPost]
        [Route("ValidateAddress")]
        public JObject ValidateAddress([FromBody] JObject data)
        {
            return Vars.WalletInterface.BC.ValidateAddress((string)data["address"]);
        }

        //[HttpGet]
        //[Route("GetNewValidatedAddress")]
        //public JObject GetNewValidatedAddress()
        //{
        //    return Vars.WalletInterface.BC.ValidateAddress(Vars.WalletInterface.BC.GetNewAddress(""));
        //}

        //[HttpGet]
        //[Route("GetNewAddress")]
        //public string GetNewAddress()
        //{
        //    return Vars.WalletInterface.BC.GetNewAddress("");
        //}

        //[HttpGet]
        //[Route("GetNewAddress/{label}")]
        //public string GetNewAddress(string label)
        //{
        //    return Vars.WalletInterface.BC.GetNewAddress(label);
        //}

        [HttpPost]
        [Route("PostNewMultisig")]
        public JObject GetInfo([FromBody] JObject data)
        {
            JObject result = Vars.WalletInterface.CreateMultiSig(data);
            return (JObject)result["result"];
        }

        #endregion Receiving

        #region Users

        [HttpGet]
        [Route("GetAllUsers")]
        public JArray GetAllUsers()
        {
            User[] users = Vars.SmartChainInterface.GetAllUsers();
            JArray response = new JArray();
            foreach (User u in users)
            {
                response.Add(u.ToJson());
            }
            return response;
        }

        [HttpPost]
        [Route("GetFilteredUsers")]
        public JArray GetFilteredUsers([FromBody] JObject data)
        {
            User[] users = Vars.SmartChainInterface.GetFilteredUsers(data);
            JArray response = new JArray();
            foreach (User u in users)
            {
                response.Add(u.ToJson());
            }
            response.Add("");
            return response;
        }

        //[HttpPost]
        //[Route("PostProfPicture")]
        //public JArray PostProfPicture(List<FileResult> files)
        //{
        //    JArray response = new JArray();

        //    response.Add("");
        //    return response;
        //}


        [HttpGet]
        [Route("GetUser/{id}")]
        public JObject GetUser(string id)
        {
            //accounting may not be avalible on all servers. 


            if (Vars.SmartChainInterface.IsAddressRegestered(id))
                return Vars.SmartChainInterface.GetUserFromAddress(id).ToJson();

            // registers new account with credit tracking database
            if (Vars.Accounts.enabled)
                Vars.Accounts.GetAccountInfo(id);


            User n = new User();
            return n.ToJson();


        }

        [HttpGet]
        [Route("GetUserFromName/{id}")]
        public JObject GetUserFromName(string id)
        {
            //accounting may not be avalible on all servers. 


            if (Vars.SmartChainInterface.IsUsernameRegestered(id))
                return Vars.SmartChainInterface.GetUserFromUsername(id).ToJson();

            // registers new account with credit tracking database
            if (Vars.Accounts.enabled)
                Vars.Accounts.GetAccountInfo(id);


            User n = new User();
            return n.ToJson();


        }



        [HttpGet]
        [Route("isusernameregistered/{u}")]
        public string isusernameregistered(string u)
        {
            Boolean res = Vars.SmartChainInterface.IsUsernameRegestered(u);
            return res.ToString();
        }

        [HttpPost]
        [Route("EncodeNewUser")]
        public JObject EncodeNewUser([FromBody] JObject data)
        {
            JObject res = new JObject();
            User newuser = new User(data["user"]);
            string hex;

            if (Vars.SmartChainInterface.IsAddressRegestered(newuser.address))
            {
                res.Add("sucess", false);
                res.Add("message", "Address allready in use!");
                return res;
            }
            if (Vars.SmartChainInterface.IsUsernameRegestered(newuser.username))
            {
                res.Add("sucess", false);
                res.Add("message", "Username allready in use!");
                return res;
            }

            try
            {
                hex = newuser.Compress();
                res.Add("sucess", true);
                res.Add("message", "");
                res.Add("hex", hex);
                res.Add("cost", Cost.GetCost(hex, Vars.WalletInterface.walletModel.Info.blocks, Boolean.Parse(Vars.config.lookup("testnet"))));
            }
            catch (Exception e)
            {
                res.Add("sucess", false);
                res.Add("message", e.Message.ToString());
            }
            return res;
        }

        [HttpPost]
        [Route("EncodeEditUser")]
        public JObject EncodeEditUser([FromBody] JObject data)
        {
            JObject res = new JObject();
            string hex;
            User newuser = new User(data["user"]);
            User existing = Vars.SmartChainInterface.GetUserFromAddress(newuser.address);
            if (existing.address == "")
            {
                res.Add("sucess", false);
                res.Add("message", "Unknown user!");
                return res;
            }



            newuser.username = null;
            if (newuser.description == existing.description) { newuser.description = null; }
            if (newuser.company == existing.company) { newuser.company = null; }
            if (newuser.streetadress == existing.streetadress) { newuser.streetadress = null; }
            if (newuser.phone == existing.phone) { newuser.phone = null; }
            if (newuser.email == existing.email) { newuser.email = null; }
            if (newuser.website == existing.website) { newuser.website = null; }

            Dictionary<string, string> final_collection = new Dictionary<string, string>();



            //loop through new values
            foreach (KeyValuePair<string, string> new_custom in newuser.custom_fields)
            {
                //if value allready exists
                if (!existing.custom_fields.ContainsKey(new_custom.Key))
                {
                    final_collection.Add(new_custom.Key, new_custom.Value);
                }
                else if (existing.custom_fields[new_custom.Key] != new_custom.Value)
                    existing.custom_fields[new_custom.Key] = new_custom.Value;
            }


            // loop through existing values, and remove if they no longer exist by setting value to null

            foreach (KeyValuePair<string, string> old_custom in existing.custom_fields)
            {
                if (!newuser.custom_fields.ContainsKey(old_custom.Key))
                {
                    final_collection.Add(old_custom.Key, "");
                }


            }
            newuser.custom_fields = final_collection;


            if (!Vars.SmartChainInterface.IsAddressRegestered(newuser.address))
            {
                res.Add("sucess", false);
                res.Add("message", "Unknown allready in use!");
                return res;
            }


            try
            {
                hex = newuser.Compress();
                res.Add("sucess", true);
                res.Add("message", "");
                res.Add("hex", hex);
                res.Add("cost", Cost.GetCost(hex, Vars.WalletInterface.walletModel.Info.blocks, Boolean.Parse(Vars.config.lookup("testnet"))));
            }
            catch (Exception e)
            {
                res.Add("sucess", false);
                res.Add("message", e.Message.ToString());
            }
            return res;
        }

        private bool DoesKeyPairExist(Collection<KeyValuePair<string, string>> collect, KeyValuePair<string, string> pair)
        {
            foreach (KeyValuePair<string, string> p in collect)
            {
                if (p.Key == pair.Key && p.Value == pair.Value) { return true; }
            }
            return false;
        }

        #endregion Users

        #region "Assets"

        [HttpGet]
        [Route("getasset/{id}")]
        public JObject getasset(string id)
        {
            return Vars.SmartChainInterface.getasset(id).ToJson();
        }

        [HttpGet]
        [Route("GetAllAssets")]
        public JArray GetAllAssets()
        {
            Asset1[] users = Vars.SmartChainInterface.GetAllAssets();
            JArray response = new JArray();
            foreach (Asset1 u in users)
            {
                response.Add(u.ToJson());
            }

            response.Add(new JObject());
            return response;
        }

        [HttpPost]
        [Route("GetFilteredAssets")]
        public JArray GetFilteredAssets([FromBody] JObject data)
        {
            Asset1[] users = Vars.SmartChainInterface.GetFilteredAssets(data);
            JArray response = new JArray();
            foreach (Asset1 u in users)
            {
                response.Add(u.ToJson());
            }
            response.Add("");
            return response;
        }

        [HttpPost]
        [Route("encodenewasset")]
        public JObject encodenewasset([FromBody] JObject data)
        {
            JObject res = new JObject();
            Asset1 newasset = new Asset1(data["asset"]);
            string hex;
            try
            {
                hex = newasset.Compress();
                res.Add("sucess", true);
                res.Add("message", "");
                res.Add("hex", hex);
                res.Add("cost", Cost.GetCost(hex, Vars.WalletInterface.walletModel.Info.blocks, Boolean.Parse(Vars.config.lookup("testnet"))));
            }
            catch (Exception e)
            {
                res.Add("sucess", false);
                res.Add("message", e.Message.ToString());
            }
            return res;
        }

        [HttpPost]
        [Route("encodenewassetcommand")]
        public JObject encodenewassetcommand([FromBody] JObject data)
        {
            JObject res = new JObject();
            AssetCommand command = new AssetCommand(data["command"]);
            string hex;
            try
            {
                hex = command.Compress();
                res.Add("sucess", true);
                res.Add("message", "");
                res.Add("hex", hex);
                res.Add("cost", Cost.GetCost(hex, Vars.WalletInterface.walletModel.Info.blocks, Boolean.Parse(Vars.config.lookup("testnet"))));
            }
            catch (Exception e)
            {
                res.Add("sucess", false);
                res.Add("message", e.Message.ToString());
            }
            return res;
        }

        #endregion "Assets"


        #region "AssetClasses"

        [HttpGet]
        [Route("getassetclass/{id}")]
        public JObject getassetclass(string id)
        {
            return Vars.SmartChainInterface.getassetclassbytxid(id).ToJson();
        }

        [HttpGet]
        [Route("getallassetclassses")]
        public JArray getallassetclassses()
        {
            AssetClassv1[] classes = Vars.SmartChainInterface.GetAllAssetClasses();
            JArray response = new JArray();
            foreach (AssetClassv1 u in classes)
            {
                response.Add(u.ToJson());
            }

            response.Add(new JObject());
            return response;
        }

        [HttpPost]
        [Route("getfilteredassetclasses")]
        public JArray getfilteredassetclasses([FromBody] JObject data)
        {
            AssetClassv1[] users = Vars.SmartChainInterface.GetFilteredAssetClasses(data);
            JArray response = new JArray();
            foreach (AssetClassv1 u in users)
            {
                response.Add(u.ToJson());
            }
            response.Add("");
            return response;
        }

        [HttpPost]
        [Route("encodenewassetclass")]
        public JObject encodenewassetclass([FromBody] JObject data)
        {
            JObject res = new JObject();
            AssetClassv1 newasset = new AssetClassv1(data["class"]);
            string hex;
            try
            {
                hex = newasset.Compress();
                res.Add("sucess", true);
                res.Add("message", "");
                res.Add("hex", hex);
                res.Add("cost", Cost.GetCost(hex, Vars.WalletInterface.walletModel.Info.blocks, Boolean.Parse(Vars.config.lookup("testnet"))));
            }
            catch (Exception e)
            {
                res.Add("sucess", false);
                res.Add("message", e.Message.ToString());
            }
            return res;
        }

        [HttpPost]
        [Route("encodenewassetclasscommand")]
        public JObject encodenewassetclasscommand([FromBody] JObject data)
        {
            JObject res = new JObject();
            AssetCommand command = new AssetCommand(data["command"]);
            string hex;
            try
            {
                hex = command.Compress();
                res.Add("sucess", true);
                res.Add("message", "");
                res.Add("hex", hex);
                res.Add("cost", Cost.GetCost(hex, Vars.WalletInterface.walletModel.Info.blocks, Boolean.Parse(Vars.config.lookup("testnet"))));
            }
            catch (Exception e)
            {
                res.Add("sucess", false);
                res.Add("message", e.Message.ToString());
            }
            return res;
        }

        #endregion "Assets"

        #region Records

        [HttpGet]
        [Route("GetAllRecords")]
        public JArray GetAllRecords()
        {
            FileHash[] hashes = Vars.SmartChainInterface.GetAllFileHash();
            JArray response = new JArray();
            foreach (FileHash u in hashes)
            {
                response.Add(u.ToJson());
            }
            return response;
        }

        [HttpPost]
        [Route("GetFilteredFiles")]
        public JArray GetFilteredFiles([FromBody] JObject data)
        {
            FileHash[] users = Vars.SmartChainInterface.GetFilteredFileHash(data);
            JArray response = new JArray();
            foreach (FileHash u in users)
            {
                response.Add(u.ToJson());
            }
            response.Add("");
            return response;
        }

        [HttpGet]
        [Route("GetFileHash/{id}")]
        public JObject GetFileHash(string id)
        {
            return Vars.SmartChainInterface.GetFingerprint(id).ToJson();
        }

        [HttpPost]
        [Route("EncodeFileHash")]
        public JObject EncodeFileHash([FromBody] JObject data)
        {
            JObject res = new JObject();
            FileHash hash = new FileHash();
            hash.Title = data["title"].ToString();
            hash.hash = data["hash"].ToString();
            string hex;

            try
            {
                hex = hash.Compress();
                res.Add("sucess", true);
                res.Add("message", "");
                res.Add("hex", hex);
                res.Add("cost", Cost.GetCost(hex, Vars.WalletInterface.walletModel.Info.blocks, Boolean.Parse(Vars.config.lookup("testnet"))));
            }
            catch (Exception e)
            {
                res.Add("sucess", false);
                res.Add("message", e.Message.ToString());

            }


            return res;
        }



        [HttpPost]
        [Route("sendrawtx")]
        public JObject sendrawtx([FromBody] JObject data)

        {

            JObject res = new JObject();

            string hex;
            try
            {
                res.Add("sucess", true);
                res.Add("message", Vars.WalletInterface.sendrawtx(data["hex"].ToString()));


            }
            catch (Exception e)
            {
                res.Add("sucess", false);
                res.Add("message", e.Message.ToString());
            }
            return res;




        }



        #endregion Records

        #region Elections

        [HttpPost]
        [Route("EncodeNewElection")]
        public JObject EncodeNewElection([FromBody] JObject data)
        {
            Election newuser = new Election(data["election"]);

            string hex;
            JObject res = new JObject(); ;

            try
            {
                hex = newuser.Compress();
                res.Add("sucess", true);
                res.Add("message", "");
                res.Add("hex", hex);
                res.Add("cost", Cost.GetCost(hex, Vars.WalletInterface.walletModel.Info.blocks, Boolean.Parse(Vars.config.lookup("testnet"))));
            }
            catch (Exception e)
            {
                res.Add("sucess", false);
                res.Add("message", e.Message.ToString());
            }
            return res;
        }

        [HttpPost]
        [Route("EncodeNewVote")]
        public JObject EncodeNewVote([FromBody] JObject data)
        {
            JObject res = new JObject();
            if (Vars.SmartChainInterface.HasUserVoted(data["id"].ToString(), data["id"].ToString()))
            {
                res.Add("sucess", false);
                res.Add("message", "User has previously voted");
                return res;
            }

            Election_Status stat = Vars.SmartChainInterface.GetElectionStatus(data["id"].ToString());
            if (stat == Election_Status.Completed)
            {
                res.Add("sucess", false);
                res.Add("message", "Election has allready closed");
                return res;
            }
            if (stat == Election_Status.Future)
            {
                res.Add("sucess", false);
                res.Add("message", "Election has not yet opened for voting");
                return res;
            }

            Vote newvote = new Vote(data);
            string hex;
            try
            {
                hex = newvote.Compress();
                res.Add("sucess", true);
                res.Add("message", "");
                res.Add("hex", hex);
                res.Add("cost", Cost.GetCost(hex, Vars.WalletInterface.walletModel.Info.blocks, Boolean.Parse(Vars.config.lookup("testnet"))));
            }
            catch (Exception e)
            {
                res.Add("sucess", false);
                res.Add("message", e.Message.ToString());
            }
            return res;
        }

        [HttpGet]
        [Route("GetAllElections")]
        public JArray GetAllElections()
        {
            Election[] hashes = Vars.SmartChainInterface.GetAllElections();
            JArray response = new JArray();

            foreach (Election u in hashes)
            {
                response.Add(u.ToJson());
            }
            return response;
        }

        [HttpPost]
        [Route("GetFilteredElections")]
        public JArray GetFilteredElections([FromBody] JObject data)
        {
            Election[] users = Vars.SmartChainInterface.GetFilteredElection(data);
            JArray response = new JArray();
            response.Add("");
            foreach (Election u in users)
            {
                response.Add(u.ToJson());
            }
            response.Add("");
            return response;
        }

        [HttpPost]
        [Route("hasuservoted")]
        public Boolean hasuservoted([FromBody] JObject data)
        {
            bool res = Vars.SmartChainInterface.HasUserVoted(data["address"].ToString(), data["id"].ToString());
            if (res)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        [HttpGet]
        [Route("GetElection/{id}")]
        public JObject GetElection(string id)
        {
            return Vars.SmartChainInterface.GetElection(id).ToJson();
        }

        #endregion Elections

        [HttpGet]
        [Route("getaddressutxos/{id}")]
        public JArray getaddressutxos(string id)
        {

            JArray result = new JArray();
            foreach (utxo utx in Utxo_Server.utxos.Values.Where(i => i.address == id))
                result.Add(utx.ToJson());

            return result;


        }

        [Route("SetSyncHeight/{id}")]
        public void SetSyncHeight(int id)
        {
            Vars.SmartChainInterface.SetSyncHeight(id);
        }



    }
}
