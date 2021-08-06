using smartchain;
using Ipfs.Api;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

using static smartchain.event_delegates;

namespace GUI
{
    public class IPFS_code : ilogconsumer
    {
        public event delegate_string LogInfo;
        public event delegate_string LogDebug;
        public event delegate_string LogVerbose;
        public event delegate_string LogWarning;
        public event delegate_error LogError;
        public event delegate_error LogFatal;

        private static Process ipfs_process;
        public void StartIpfs()
        {
            object t = Directory.GetCurrentDirectory();
            AppDomain.CurrentDomain.ProcessExit += new EventHandler(CurrentDomain_ProcessExit);
            start_ipfs();
        }

        private  async void read_file()
        {
            if (!Status.IPFS)
                return;
            if(Vars.config.lookup("env") == "windows")
                start_ipfs();

            var ipfs = new IpfsClient();

            const string filename = "QmU272ooQ51rgwY518vesJTG8MEHmr7HBEuxa4HyRS1ndt";
            Stream text = await ipfs.FileSystem.ReadFileAsync(filename);

            Console.WriteLine(text);
        }

        private void start_ipfs()
        {
            LogInfo?.Invoke("IPFS Starting....");  
            if(Vars.config.lookup("env") == "windows")
            {
                if(!File.Exists(Directory.GetCurrentDirectory() + "\\ipfs.exe"))
                {
                    Console.WriteLine("unable to find ipfs.exe");
                    Console.WriteLine("Starting Without IPFS");
                    Status.IPFS = false;
                    return;
                    //Environment.Exit(1);

                }



               ipfs_process = CreateHiddenProcess(Directory.GetCurrentDirectory() + "\\ipfs.exe", "daemon");
               ipfs_process.Start();
                Status.IPFS = true;

            }
           
            LogInfo?.Invoke("IPFS Start...Complete!");
        }

        public static Process CreateHiddenProcess(string file, string args)
        {
            Process process = new Process();

            process.StartInfo.Arguments = args;
            process.StartInfo.FileName = file;
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.RedirectStandardError = true;
            process.StartInfo.CreateNoWindow = true;
            process.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
            return process;
        }

        private static void CurrentDomain_ProcessExit(object sender, EventArgs e)
        {
            if(ipfs_process != null)
                ipfs_process.Kill();
        }

        private static async void get_wallet()
        {
            if (!Status.IPFS)
                return;
            var ipfs = new IpfsClient();
            const string filename = "QmU272ooQ51rgwY518vesJTG8MEHmr7HBEuxa4HyRS1ndt";
            Stream text = await ipfs.FileSystem.ReadFileAsync(filename);

            FileStream fileStream = File.Create(Directory.GetCurrentDirectory() + "\\radium-1.4.7.1.exe");
            text.CopyTo(fileStream);

            // Initialize the bytes array with the stream length and then fill it with data

            // Use write method to write to the file specified above
            fileStream.Close();
        }

        private static async Task<string> addfile(string file)
        {
            
            var ipfs = new IpfsClient();
            var fsn = await ipfs.FileSystem.AddFileAsync(file);
            
            return fsn.Id;
        }

        public void pin(string hash)
        {
            if (!Status.IPFS)
                return;
            var ipfs = new IpfsClient();
            ipfs.Pin.AddAsync(hash);
            LogInfo?.Invoke("IPFS Pinned file " + hash);
        }
    }
}