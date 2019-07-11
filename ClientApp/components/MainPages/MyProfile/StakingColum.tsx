//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import t from '../../Language/Language'
//import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
//import { DesktopData, StakingInfo } from '../_Interfaces/DesktopInterfaces'

//interface Props {
//    data: DesktopData;
//    language: number;
//}

//interface StakingColumState {
//    show_password_popup: boolean
//    staking_info: StakingInfo
//    intervaltick: any
//    expected_staking: boolean
//}

//export default class StakingColum extends React.Component<Props, StakingColumState>{
//    constructor(props: Props) {
//        super(props);
//        this.state = {
//            show_password_popup: false,
//            staking_info: {
//                enabled: false,
//                staking: false,
//                weight: 0,
//                netstakeweight: 0,
//            },
//            intervaltick: 1000,
//            expected_staking: false,
//        };

//        this.tick()
//    }

//    componentDidMount() {
//        var inttick = setInterval(() => this.tick(), 10000);

//        // store intervalId in the state so it can be accessed later:
//        this.setState({ intervaltick: inttick });
//    }
//    componentWillUnmount() {
//        clearInterval(this.state.intervaltick);
//    }

//    tick() {
//        fetch('api/public/GetStakingInfo')
//            .then((response) => { return response.json() })
//            .then((json) => {
//                this.setState({ staking_info: json });
//            });
//        if (this.state.expected_staking == this.state.staking_info.staking) { this.setState({ intervaltick: 10000 }) }
//        //  this.setState({ currentCount: this.state.currentCount + 1 })
//    }

//    Stop_Staking() {
//        this.setState({ expected_staking: false, intervaltick: 250 })
//        fetch('api/public/WalletLock');
//    }

//    Start_Staking() {
//        this.setState({ expected_staking: true, intervaltick: 250 })
//        this.setState({ show_password_popup: true })
//    }

//    Close_Password_Popup() {
//        this.setState({ show_password_popup: false })
//    }

//    render() {
//        return <span>
//            <h3>{t[this.props.language].Stake}</h3>
//            {this.state.intervaltick}

//            <dl className="dl-horizontal ">
//                <dt className="left">{t[this.props.language].Stake}:</dt><dd><TrueFalseIcon state={this.state.staking_info.staking} /></dd>

//                {this.state.staking_info.staking ?

//                    <span>
//                        <dt className="left">Your Stake Weight is:</dt> <dd>{(this.state.staking_info.weight / 100000000).toFixed(0)} </dd>

//                        <dt className="left">You are contribition:</dt> <dd>{((this.state.staking_info.weight / this.state.staking_info.netstakeweight) * 100).toFixed(2) + '%'} of the network total.</dd>

//                        <dt className="left">Chance to find block: </dt> <dd>{((this.state.staking_info.weight / this.state.staking_info.netstakeweight) * 100).toFixed(2) + '%'}</dd>
//                        <dt className="left">Daily change of block:   </dt> <dd> {
//                            ((1 - ((1 - (this.state.staking_info.weight / this.state.staking_info.netstakeweight)) ** 1440)) * 100).toFixed(2) + '%'
//                        }</dd>

//                        <dt className="left"><button type="button" className="btn btn-default btn-danger" onClick={() => { this.Stop_Staking() }}>Stop Staking!</button></dt><dd />

//                    </span>

//                    : <span><dt className="left"><button type="button" className="btn btn-default btn-success" onClick={() => { this.Start_Staking() }}>Start Staking!</button></dt> <dd /> </span>}

//            </dl>

//        </span>
//    }
//}