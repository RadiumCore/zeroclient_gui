import * as React from 'react';
import { NavMenu } from '../../NavMenu';
import t from "../../Language/Language";
import { ProgressBar, Jumbotron } from 'react-bootstrap';
import { TrueFalseIcon } from '../../Global/TrueFalseIcon';
import { DesktopData } from '../_Interfaces/DesktopInterfaces'
import * as api from "../../Global/API"

interface SmartChainSyncingState {
    intervaltick: any;
    language: number;

    secondary_text: string;
    loading_bar_text: string;
    loading_bar_pos: number;
    loading_bar_vis: boolean;
    data: DesktopData;
    wallet_connected: boolean;
    interval: number;

    setsync: number

    prev_remaining: number;
    avg_bps: number
}

export interface SmartChainSyncingProps {
    synced_callback: any;
}
export class SmartChainSyncing extends React.Component<SmartChainSyncingProps, SmartChainSyncingState> {
    constructor(props: SmartChainSyncingProps) {
        super(props);
        this.state = {
            intervaltick: [], language: 0, secondary_text: " ", loading_bar_text: "", loading_bar_vis: false, loading_bar_pos: 0, data: {
                NetworkSynced: false,
                NetworkBlock: 0,
                EstNetworkBlocks: 0,
                WalletConnected: false,
                SmartChainBlock: 0,
                SmartChainSynced: false,
                peercount: 0,
                transactions: {},
                spendable: 0,
                stake: 0,
                total: 0,
                unconfirmed: 0,
            },
            wallet_connected: false,
            interval: 1000,
            setsync: 0,
            prev_remaining: 0,
            avg_bps: 0,
        };
        this.tick();
    }

    tick() {
        api.SyncInfo((json: any) => { this.setState({ data: json }); })

        let remaining: number = (this.state.data.NetworkBlock - this.state.data.SmartChainBlock)
        let bps: number = 0
        if (this.state.prev_remaining != 0) {
            bps = (this.state.prev_remaining - remaining)
        }

        let avg_bps: number = ((this.state.avg_bps * .9) + (bps * .1))
        if (this.state.avg_bps == 0) {
            this.setState({ avg_bps: bps })
        } else {
            this.setState({ avg_bps: avg_bps })
        }

        let min_remaining: number = (remaining / avg_bps / 60)
        let hours_remaining: number = Math.floor(min_remaining / 60)
        min_remaining = min_remaining - (hours_remaining * 60)

        this.setState({
            secondary_text: "Smartchain syncing approximatly " + hours_remaining.toFixed(0) + " hr, " + min_remaining.toFixed(0) + " min remaining",
            loading_bar_vis: true,
            loading_bar_pos: Math.round((this.state.data.SmartChainBlock / this.state.data.NetworkBlock) * 100),
            loading_bar_text: Math.round((this.state.data.SmartChainBlock / this.state.data.NetworkBlock) * 10000) / 100 + "%",
            prev_remaining: remaining
        })
    }

    update() {
        if (this.state.data.SmartChainSynced) {
            this.props.synced_callback(true)
        }
    }

    componentDidMount() {
        var inttick = setInterval(() => this.tick(), 1000);

        // store intervalId in the state so it can be accessed later:
        this.setState({ intervaltick: inttick });
    }
    componentWillUnmount() {
        clearInterval(this.state.intervaltick);
    }

    public render() {
        this.update();

        return <div className="loading-page">

            <div className="loading-page-head">
            </div>
            <div className="loading-page-body" >
                <div className="col-sm-3" />
                <div className="col-sm-6">
                    <h3 className="text-center">SmartChain Syncing</h3>
                    <h4 className="text-center">{this.state.secondary_text}</h4>

                    {this.state.loading_bar_vis ? <ProgressBar bsStyle="success" now={this.state.loading_bar_pos} label={this.state.loading_bar_text} />
                        : ""}
                </div>

                <div className="col-sm-3" />

            </div>
            <div className="loading-page-foot" />

        </div>;
    }
}