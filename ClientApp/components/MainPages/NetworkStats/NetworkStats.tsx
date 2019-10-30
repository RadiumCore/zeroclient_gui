import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { DesktopData } from '../_Interfaces/DesktopInterfaces'
import { iTransaction } from '../_Interfaces/iTransaction'
import * as settings from '../../Global/settings'

import * as api from '../../Global/API'
import { address } from 'radiumjs-lib';
interface state {
    server: server_info;
    network: network_info;
    intervaltick: any;
    language: number;
    loading: boolean;
    address_input: string;
    stakes: stake[];
    stake_report: stake_report;
    rads_price: number;
}

export class Network extends React.Component<RouteComponentProps<{}> | undefined, state> {
    constructor(props: RouteComponentProps<{}> | undefined) {
        super(props);
        this.state = {
            intervaltick: [],
            server: blank_server_info,
            network: blank_network_info,
            language: 0,
            loading: true,
            address_input: "",
            stakes: [],
            stake_report: { stakes: 0, rads: 0 },
            rads_price: 0,
        };
        api.GetServerInfo((data: any) => { this.setState({ server: data }); })

        this.tick();
    }

    tick() {
        api.GetNetworkInfo((data: any) => { this.setState({ network: data, loading: false }); })
    }

     generate_stake_report() {

         if (this.state.stakes.length != 0) {
             this.setState({ stakes: [], stake_report: { stakes: 0, rads: 0} });
             return;
         }
         api.GetPrice((data: any) => {
             this.setState({ rads_price: data["usdprice"] });
         })

        var addresses: string[] = this.state.address_input.split(" ");

        addresses.forEach((address: string) => {

            api.GetStakes(address, 1440, (data: stake[]) => {
                var temp: stake[] = this.state.stakes;
                data.forEach((v: stake) => {
                    temp.push(v);
                })

                this.setState({ stakes: temp })
                this.calculate_stake_report();
                
            })
        })   
    }

    calculate_stake_report() {
        var report: stake_report = {stakes: 0, rads: 0 };
        this.state.stakes.forEach((s: stake) => {
            report.stakes += 1;
            report.rads += s.value;
        })
        this.setState({ stake_report: report})
    }

    componentDidMount() {
        var inttick = setInterval(() => this.tick(), 2000);

        // store intervalId in the state so it can be accessed later:
        this.setState({ intervaltick: inttick });
    }
    componentWillUnmount() {
        clearInterval(this.state.intervaltick);
    }

    public render() {
        let walletColum = this.state.loading ? <p><em>{t[this.state.language].Loading}...</em></p> : this.renderServerColum();
        let networkColum = this.state.loading ? <p><em>{t[this.state.language].Loading}...</em></p> : this.renderNetworkColum();
        let stake_report = this.state.loading ? <p><em>{t[this.state.language].Loading}...</em></p> : this.renderStakeReport();

        return <span>
            <div className="main-page-head">
                <h1>Network Stats</h1>
            </div>
            <div className="main-page-body">
                <div className="row">
                    <div className="col-sm-6">{walletColum}{networkColum}</div>
                    <div className="col-sm-6">
                        <h3> Calculate a 24 hour staking report </h3>
                        <h5> Enter a single address or addresses seperated by a space </h5>
                        <textarea rows={10} className="form-control rounded-0" onChange={evt => this.setState({ address_input: evt.target.value })} />
                        <button type="button" className="btn btn-default" onClick={this.generate_stake_report.bind(this)}>{this.state.stakes.length == 0 ? "Generate Report" : "clear" }</button>
                        {stake_report}
                    </div>
                    
                </div>

            </div>
            <div className="main-page-foot">

            </div>
        </span>
    }

    renderServerColum() {
        return <span>
            <h3>Server Info</h3>
            <dl className="dl-horizontal ">
                <dt className="left">Server Version:</dt><dd>{this.state.server.server_version}</dd>
                <dt className="left">Server Address :</dt><dd>{api.pub_base}</dd>
                <dt className="left">Administrator :</dt><dd>{this.state.server.administrator}</dd>
                <dt className="left">Contact :</dt><dd>{this.state.server.admin_contact}</dd>
                
            </dl>
            <h3>Network Info</h3>
            <dl className="dl-horizontal ">
                <dt className="left">Wallet Version :</dt><dd>{this.state.server.wallet_version}</dd>
                <dt className="left">Network Blocks:</dt><dd>{this.state.network.wallet_block}</dd>
                <dt className="left">Network Stake Weight:</dt><dd>{this.state.network.net_weight}</dd>
                <dt className="left">Total Supply: </dt><dd>{this.state.network.totoal_supply}</dd>    
                <dt className="left">Stake Reward</dt><dd>{Math.round( (((.485 * 1440 * 365) /  this.state.network.net_weight) * 10000))/100}%</dd>    
            </dl>
            <h3>SmartChain Stats</h3>
            <dl className="dl-horizontal ">
               <dt className="left">SmartChain Blocks:</dt><dd>{this.state.network.smartchain_block}</dd>
                <dt className="left">SmartChain Users :</dt><dd>{this.state.network.user_count}</dd>
                <dt className="left">Smart Transaction Count :</dt><dd>{this.state.network.smart_tx_count}</dd>
                <dt className="left">SmartChain Hash :</dt><dd >{this.state.network.best_hash}</dd>

            </dl>

        </span>
    }

    renderNetworkColum() {
        return <span>
            
        </span>
    }
    renderStakeReport() {


        return <span>
            <dl className="dl-horizontal ">
            <dt className="left">Stakes:</dt><dd>{this.state.stake_report.stakes}</dd>
            <dt className="left">Total Rads</dt><dd>{this.state.stake_report.rads}</dd>
            <dt className="left">USD Value</dt><dd>{this.state.stake_report.rads * this.state.rads_price}</dd>
</dl>
        </span>
    }
}

interface server_info {
    wallet_version: string;
    administrator: string;
    admin_contact: string;
    server_version: string;
}
var blank_server_info = {
    wallet_version: '',
    administrator: '',
    admin_contact: '',
    server_version: '',
}

interface network_info {
    totoal_supply: number;
    net_weight: number;
    user_count: number;
    smart_tx_count: number;
    wallet_block: number;
    smartchain_block: number;
    best_hash: string;
}

var blank_network_info = {
    totoal_supply: 0,
    net_weight: 0,
    user_count: 0,
    smart_tx_count: 0,
    wallet_block: 0,
    smartchain_block: 0,
    best_hash: "",
}

interface stake {
    txid: string;
    value: number;
    address: string;
    block: number;
}

interface stake_report {
    stakes: number;
    rads: number;
}