//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import t from '../../Language/Language'
//import { UnixToDate } from '../../Global/UnixToDate'
//import { iTransaction } from '../_Interfaces/iTransaction'

//interface TxRowState {
//}
//export interface Props {
//    tx: iTransaction;

//    language: number;
//}

//export class RowTx extends React.Component<Props, TxRowState> {
//    constructor(props: Props) {
//        super(props);
//        this.state = {};
//    }

//    get_confirms() {
//        if (this.props.tx.catagory == "generate") {
//            return this.get_coinbaseConfirms();
//        }
//        return this.get_TxConfirms();
//    }

//    get_TxConfirms() {
//        let x = this.props.tx.confirmations
//        switch (true) {
//            case (x == 0):
//                return <span className="glyphicon glyphicon-question-sign text-info"></span>

//            case (x < 4):
//                return <span className="glyphicon glyphicon-time text-danger"></span>
//            case (x < 7):
//                return <span className="glyphicon glyphicon-time text-warning"></span>
//            case (x < 10):
//                return <span className="glyphicon glyphicon-time text-success"></span>

//            default:
//                return <span className="glyphicon glyphicon-ok text-success"></span>
//        }
//    }
//    get_coinbaseConfirms() {
//        let x = this.props.tx.confirmations
//        switch (true) {
//            case (x == 0):
//                return <span className="glyphicon glyphicon-question-sign text-info"></span>

//            case (x < 15):
//                return <span className="glyphicon glyphicon-time text-danger"></span>
//            case (x < 45):
//                return <span className="glyphicon glyphicon-time text-warning"></span>
//            case (x < 60):
//                return <span className="glyphicon glyphicon-time text-success"></span>

//            default:
//                return <span className="glyphicon glyphicon-ok text-success"></span>
//        }
//    }

//    get_icon() {
//        switch (this.props.tx.catagory) {
//            case ("send"):
//                return <span className="glyphicon glyphicon-send"></span>

//            case ("receive"):
//                return <span className="glyphicon glyphicon-download-alt"></span>
//            case ("generate"):
//                return <span className="glyphicon glyphicon-link"></span>
//            case ("self"):
//                return <span className="glyphicon glyphicon-refresh"></span>

//            default:
//                return <span >???</span>
//        }
//    }
//    get_time() {
//        const d: Date = new Date(0);
//        d.setUTCSeconds(this.props.tx.time + 0)
//        return <span>{d.toLocaleDateString()} {d.toLocaleTimeString()}</span>
//    }
//    get_title() {
//        if (this.props.tx.address == " ") { return "(n/a)" }
//        return this.props.tx.address
//    }

//    get_confirmToolTip() {
//        if (this.props.tx.confirmations > 9) {
//            return "Confirmed (" + this.props.tx.confirmations + ") confirmations."
//        } else {
//            return "Confirming, (" + this.props.tx.confirmations + " of 10) confirmations."
//        }
//    }
//    get_value() {
//        if (this.props.tx.totalvalue < 0) return this.props.tx.totalvalue.toFixed(5); else return "+" + this.props.tx.totalvalue.toFixed(4)
//    }
//    public render() {
//        return <tr key={this.props.tx.txid} data-toggle="tooltip" data-placement="top" title={this.get_confirmToolTip()}>

//            <td>{this.get_confirms()}</td>

//            <td>{this.get_icon()}</td>
//            <td><UnixToDate unix={this.props.tx.time} /></td>
//            <td>{this.get_title()}</td>
//            <td>{this.get_value()}</td>
//        </tr>
//    }
//}