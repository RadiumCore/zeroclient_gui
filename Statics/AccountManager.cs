using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace GUI
{
    public class AccountManager
    {
        CloudStorageAccount JJ;
        CloudTableClient tableclient;
        CloudTable table;
        CloudBlobClient blobclient;
        CloudBlobContainer blob;
        Dictionary<string, int> nonces = new Dictionary<string, int>();
        public bool enabled = false;

        public AccountManager()
        {
            if (!Vars.config.haskey("azure_connection_string")) return;
            if(!Vars.config.haskey("azure_table")) return;
            if(!Vars.config.haskey("zcaccountlogs")) return;
            enabled = true;
            JJ = CloudStorageAccount.Parse(Vars.config.lookup("azure_connection_string"));
            tableclient = JJ.CreateCloudTableClient();
            table = tableclient.GetTableReference(Vars.config.lookup("azure_table"));

            blobclient = JJ.CreateCloudBlobClient();
            blob = blobclient.GetContainerReference("zcaccountlogs");
            blob.CreateIfNotExistsAsync();
        }


        public AzureZCAccount GetAccountInfo(string address)
        {
            if (!enabled) throw new Exception("account manager not enabled");
            TableOperation retrieveOperation = TableOperation.Retrieve<AzureZCAccount>("zcaccount", address);
            TableResult retrievedResult = table.ExecuteAsync(retrieveOperation).Result;
            AzureZCAccount account;
            if (retrievedResult.Result == null)
            {
                account = new AzureZCAccount(address);
                table.ExecuteAsync(TableOperation.InsertOrReplace(account)).Wait();
                write_log(address, "account created.");
                AddCredits(address, 10, " for new account!");
               
             
                return account;
            }
          return (AzureZCAccount) retrievedResult.Result;
        }

        public bool AddCredits(string address, int credits, string comment = "")
        {
            if (!enabled) throw new Exception("account manager not enabled");
            TableOperation retrieveOperation = TableOperation.Retrieve<AzureZCAccount>("zcaccount", address);
            TableResult retrievedResult = table.ExecuteAsync(retrieveOperation).Result;
            AzureZCAccount account;
            if (retrievedResult.Result == null)
                account = new AzureZCAccount(address);  
            else
                account = (AzureZCAccount)retrievedResult.Result;

            account.credits += credits;
            table.ExecuteAsync(TableOperation.InsertOrReplace(account));
            write_log(address, credits + " credits added. " + " " + comment);
            return true;
        }



        public bool SubtractCredit(string address, int credits, string comment = "")
        {
            if (!enabled) throw new Exception("account manager not enabled");
            TableOperation retrieveOperation = TableOperation.Retrieve<AzureZCAccount>("zcaccount", address);
            TableResult retrievedResult = table.ExecuteAsync(retrieveOperation).Result;
            AzureZCAccount account;
            if (retrievedResult == null)
                account = new AzureZCAccount(address);
            else
                account = (AzureZCAccount)retrievedResult.Result;

            if (account.credits < credits)
                return false;

           
            account.credits -= credits;
            table.ExecuteAsync(TableOperation.InsertOrReplace(account));
            write_log(address, credits + " credits removed. " + " " + comment);
            return true;
        }

        private void write_log(string address, string entry)
        {
            if (!enabled) throw new Exception("account manager not enabled");
            CloudAppendBlob log = blob.GetAppendBlobReference(address);
            if (!log.ExistsAsync().Result)   
                log.CreateOrReplaceAsync().Wait();

            log.AppendTextAsync(DateTime.Now + " " + address + entry + "\n").Wait();

          
        }

        public int get_account_nonce(string address)
        {
            int nonce;
            // if key exists, copy to nonce and return nonce. if not, add it to nonce
            if (!nonces.TryGetValue(address, out nonce))
            {
                nonce = unixtimems();
                nonces.Add(address, nonce);
                
            }
            return nonce;                
                
        }

        public bool check_valid_nonce(string address, int nonce)
        {

            
            if (get_account_nonce(address) < nonce)
            {
                nonces[address] = nonce;
                return true;
            }
            return false;
        }

        private int unixtimems()
        {
           return (int) DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalMilliseconds;
        }
       

    }

    public class AzureZCAccount : TableEntity
    {

        public AzureZCAccount() { }
        public AzureZCAccount(string _address)
        {

            this.PartitionKey = "zcaccount";
            this.RowKey = _address;


        }

        public string pubkey { get; set; }
        public int credits { get; set; }

        public JObject tojson()
        {
            JObject response = new JObject();
            response.Add("address", RowKey);
            response.Add("pubkey", pubkey);
            response.Add("credits", credits);
            return response;

                
        }
    }
}



    
