//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import t from '../../Language/Language'
//import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
//import { DesktopData } from '../_Interfaces/DesktopInterfaces'
//interface props {
//    data: DesktopData;
//    language: number;
//}

//export default class NetworkColum extends React.Component<props, {}>{
//    render() {
//        return <span>
//            <h3>{t[this.props.language].Network}</h3>
//            <dl className="dl-horizontal ">
//                <dt className="left">{t[this.props.language].Wallet_Connected}:</dt><dd><TrueFalseIcon state={this.props.data.WalletConnected} /></dd>
//                <dt className="left">{t[this.props.language].Network_Synced}:</dt><dd><TrueFalseIcon state={this.props.data.NetworkSynced} /></dd>
//                <dt className="left">{t[this.props.language].SmartChain_Synced}:</dt><dd><TrueFalseIcon state={this.props.data.SmartChainSynced} /></dd>
//                <dt className="left">{t[this.props.language].Network_Block}:</dt><dd>{this.props.data.NetworkBlock}</dd>
//                <dt className="left">{t[this.props.language].SmartChain_Block}:</dt><dd>{this.props.data.SmartChainBlock}</dd>
//                <dt className="left">{t[this.props.language].Peer_Count}:</dt><dd>{this.props.data.peercount}</dd>
//            </dl>
//        </span>
//    }
//}