//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import { ReceivingTable } from './ReceiveAddressTable';
//import t from '../../Language/Language'
//import { NewAddressPopup } from './NewAddressPopup'

//interface ReceiveState {
//    loading: boolean;
//    language: number;
//    show_new_address: boolean;
//    new_address: string
//}

//export class Receive extends React.Component<RouteComponentProps<{}> | undefined, ReceiveState> {
//    constructor(props: RouteComponentProps<{}> | undefined) {
//        super(props);
//        this.state = { loading: false, language: 0, show_new_address: false, new_address: "" };
//    }

//    Close_new_addresss(address: string) {
//        this.setState({ show_new_address: false, new_address: address })
//    }

//    Show_new_addresss() {
//        this.setState({ show_new_address: true })
//    }

//    public render() {
//        return <div className="fixed-div">

//            <h1>{t[this.state.language].Your_Addresses}</h1>

//            <div className="scroll-div">
//                <ReceivingTable selected_address={this.state.new_address} language={this.state.language} />
//            </div>
//            <button onClick={this.Show_new_addresss.bind(this)}>New Address</button> <button>Sign Message</button>

//            {this.state.show_new_address ?
//                <NewAddressPopup close_callback={this.Close_new_addresss.bind(this)} language={this.state.language} />
//                : null
//            }

//        </div>;
//    }
//}