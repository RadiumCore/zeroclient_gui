//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import { TransactionTable_Mini } from './TransactionTable_Mini';
//import t from '../../Language/Language'
//import NetworkColum from './NetworkColum'
//import { DesktopData } from '../_Interfaces/DesktopInterfaces'
//import { iTransaction } from '../_Interfaces/iTransaction'
//import StakeColum from './StakingColum'
//import * as api from '../../Global/API'
//interface CounterState {
//    data: DesktopData;
//    intervaltick: any;
//    intervaltransaction: any;
//    loading: boolean;
//    transactions: iTransaction[];
//    language: number;
//}

//export class Dashboard extends React.Component<RouteComponentProps<{}> | undefined, CounterState> {
//    constructor(props: RouteComponentProps<{}> | undefined) {
//        super(props);
//        this.state = {
//            intervaltick: [], intervaltransaction: [], data: {
//                spendable: 0,
//                stake: 0,
//                unconfirmed: 0,
//                total: 0,
//                NetworkSynced: false,
//                NetworkBlock: 0,
//                WalletConnected: false,
//                SmartChainBlock: 0,
//                SmartChainSynced: false,
//                peercount: 0,
//                transactions: {},
//                EstNetworkBlocks: 0,
//            }, transactions: [], loading: false, language: 0
//        };
//        this.tick();
//    }

//    tick() {
//        api.DashboardInfo((json: any) => { this.setState({ data: json }); })

//        //  this.setState({ currentCount: this.state.currentCount + 1 })
//    }

//    gettransactions() {
//        fetch('api/public/GetTransactions')
//            .then((response) => { return response.json() })
//            .then((json) => {
//                this.setState({ transactions: json });
//            });

//        //  this.setState({ currentCount: this.state.currentCount + 1 })
//    }
//    Shutdown() {
//        fetch('api/public/Shutdown')
//    }

//    componentDidMount() {
//        var inttick = setInterval(() => this.tick(), 2000);
//        var inttransaction = setInterval(() => this.gettransactions(), 6000);
//        // store intervalId in the state so it can be accessed later:
//        this.setState({ intervaltick: inttick, intervaltransaction: inttransaction });
//    }
//    componentWillUnmount() {
//        clearInterval(this.state.intervaltick);
//        clearInterval(this.state.intervaltransaction);
//    }
//    private static ReSync() {
//        fetch('api/command/resync');
//    }

//    public render() {
//        let walletColum = this.state.loading ? <p><em>{t[this.state.language].Loading}...</em></p> : this.renderWalletColum(this.state.data);
//        let networkColum = this.state.loading ? <p><em>{t[this.state.language].Loading}...</em></p> : this.renderNetworkColum(this.state.data);
//        let stakiingColum = this.state.loading ? <p><em>{t[this.state.language].Loading}...</em></p> : <StakeColum language={this.state.language} data={this.state.data} />;

//        return <div className="container-fluid">
//            <h2>Dashboard</h2>

//            <button onClick={this.Shutdown}> shutdown </button>

//            <div>

//                <div>
//                    <div className="row">
//                        <div className="col-sm-5">{walletColum}{networkColum}{stakiingColum}</div>
//                        <div className="col-sm-7">
//                            <h3>{t[this.state.language].Transaction_History}</h3>
//                            <TransactionTable_Mini defaultPageSize={6} showPagination={false} language={this.state.language} />
//                        </div>
//                    </div>
//                </div>

//            </div>

//        </div>;
//    }

//    renderWalletColum(data: any) {
//        return <span>
//            <h3>{t[this.state.language].Wallet}</h3>
//            <dl className="dl-horizontal ">
//                <dt className="left">{t[this.state.language].Spendable}:</dt><dd>{data.spendable}</dd>
//                <dt className="left">{t[this.state.language].Stake}:</dt><dd>{data.stake}</dd>
//                <dt className="left">{t[this.state.language].Unconfirmed}:</dt><dd>{data.unconfirmed}</dd>
//                <dt className="left">{t[this.state.language].Total}:</dt><dd>{data.total}</dd>
//            </dl>

//        </span>
//    }

//    renderNetworkColum(data: any) {
//        return <NetworkColum language={this.state.language} data={this.state.data} />
//        // <button onClick={() => { this.ReSync() }}>Resync</button>
//    }
//}