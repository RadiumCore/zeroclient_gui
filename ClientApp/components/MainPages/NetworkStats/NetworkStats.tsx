import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { DesktopData } from '../_Interfaces/DesktopInterfaces'
import { iTransaction } from '../_Interfaces/iTransaction'
import * as settings from '../../Global/settings'

import * as api from '../../Global/API'
interface state {
    server: server_info;
    network: network_info;
    intervaltick: any;
    language: number;
    loading: boolean;
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
        };
        api.GetServerInfo((data: any) => { this.setState({ server: data }); })

        this.tick();
    }

    tick() {
        api.GetNetworkInfo((data: any) => { this.setState({ network: data, loading: false }); })
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

        return <span>
            <div className="main-page-head">
                <h1>Network Stats</h1>
            </div>
            <div className="main-page-body">
                <div className="row">
                    <div className="col-sm-6">{walletColum}{networkColum}</div>
                    <div className="col-sm-6"></div>
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