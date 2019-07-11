//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import { RecipiantTableLine } from './RecipiantTableLine';
//import ReactTable from 'react-table';
//import 'react-table/react-table.css';
//import t from '../../Language/Language';
//import { Modal } from 'react-bootstrap'

//interface SendState {
//    recipiants: RecipiantTableLineState[];
//    loading: boolean;
//    language: number;
//    show_popup: boolean;
//    invalid_password: boolean;
//    pass: string;
//}

//export class Send extends React.Component<RouteComponentProps<{}> | undefined, SendState> {
//    constructor(props: RouteComponentProps<{}> | undefined) {
//        super(props);

//        this.state = {
//            loading: false,
//            recipiants: [{ payto: "", value: 0, index: 0 }],
//            language: 0,
//            show_popup: false,
//            invalid_password: false,
//            pass: ""
//        };
//    }

//    add_recipiant() {
//        var newArray = this.state.recipiants.slice();
//        let line: RecipiantTableLineState = { payto: "", value: 0, index: this.state.recipiants.length }
//        newArray.push(line);
//        this.setState({ recipiants: newArray })
//    }
//    clear_all() {
//        this.setState({ recipiants: [{ payto: "", value: 0, index: 0 }] })
//    }
//    childcallback(payto: string, value: number, index: number) {
//        var newArray = this.state.recipiants.slice();
//        newArray[index].payto = payto
//        newArray[index].value = value
//        this.setState({ recipiants: newArray })
//    }

//    start_send() {
//        if (this.state.recipiants.length == 0) {
//            alert(t[this.state.language].No_Recipiant_Selected)
//            return;
//        }
//        this.setState({ show_popup: true })
//    }

//    close_password() {
//        this.setState({ show_popup: false })
//    }

//    password_callback(result: boolean) {
//        if (!result) { return };
//        this.finish_send();

//        this.setState({ show_popup: false })
//    }

//    finish_send() {
//        fetch('api/public/SendRadium', {
//            method: 'POST',
//            body: JSON.stringify({ values: this.state.recipiants })
//        })
//            .then((response) => { return response.json() })
//            .then((json) => {
//                alert('Transaction sent. TXID: ' + json["txid"]);
//                this.clear_all()
//            });
//    }

//    public render() {
//        return <div className="container-fluid">
//            <h2>Send</h2>

//            {this.state.recipiants.map(recipiant =>
//                <div className="row">
//                    <RecipiantTableLine language={this.state.language} index={recipiant.index} callback={this.childcallback.bind(this)} />
//                </div>
//            )}

//            <div className="btn-toolbar" role="group" aria-label="...">
//                <button type="button" className="btn btn-default " onClick={() => { this.add_recipiant() }}>Add Recipiant</button>
//                <button type="button" className="btn btn-default btn-danger" onClick={() => { this.clear_all() }}>Clear All</button>
//                <button type="button" className="btn btn-default btn-success" onClick={() => { this.start_send() }}>Send</button>
//            </div>

//        </div >
//    }
//}

//interface RecipiantTableLineState {
//    payto: string;

//    value: number;
//    index: number;
//}
//interface bool_result {
//    result: boolean
//}