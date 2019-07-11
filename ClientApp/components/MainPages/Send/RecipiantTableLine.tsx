//import * as React from 'react';
//import ReactTable from 'react-table';
//import 'react-table/react-table.css'
//import { RouteComponentProps } from 'react-router';
//import t from '../../Language/Language'

//import * as statics from '../../Global/statics'
//interface RecipiantTableLineState {
//    payto: string;
//    account: string;
//    value: number;
//}

//export interface Props {
//    language: number;
//    callback: any;
//    index: number;
//}

//export class RecipiantTableLine extends React.Component<Props, RecipiantTableLineState> {
//    constructor(props: Props) {
//        super(props);
//        this.state = {
//            payto: "",
//            account: "",
//            value: 0
//        }
//    };
//    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
//        const target = e.target;
//        const value = target.type === 'checkbox' ? target.checked : target.value;
//        const name = target.name;
//        this.setState({ [name]: value } as any, () => {
//            this.props.callback(this.state.payto, this.state.value, this.props.index)
//        });
//        if (name == "payto") { this.CheckAddress(value) }
//    }

//    CheckAddress(address: any) {
//        fetch('api/public/ValidateAddress', {
//            method: 'POST',
//            headers: statics.requestHeaders,
//            body: JSON.stringify({ address: address })
//        })
//            .then((response) => { return response.json() })
//            .then((json) => {
//                if (json["isvalid"] == false) {
//                    alert(t[this.props.language].Invalid_Address);
//                    return;
//                }

//                this.setState({
//                    account: json["account"]
//                })
//            });
//    }

//    public render() {
//        //this.props.callback(this.state.payto, this.state.account, this.state.value, this.props.index)

//        return <div className="container-fluid">

//            <span>

//                <p></p>
//                <div className="input-group">
//                    <span className="input-group-addon" id="basic-addon1">Pay To:</span>
//                    <input type="text" className="form-control" placeholder="Address" aria-describedby="basic-addon1" value={this.state.payto} name="payto" onChange={evt => this.handleInputChange(evt)}></input>
//                </div>
//                <p></p>
//                <div className="input-group">
//                    <span className="input-group-addon" id="basic-addon1">Label:</span>
//                    <input type="text" className="form-control" placeholder="Address" aria-describedby="basic-addon1" value={this.state.account} name="account" onChange={evt => this.handleInputChange(evt)}></input>
//                </div>

//                <p></p>
//                <div className="input-group">
//                    <span className="input-group-addon" id="basic-addon1">Value:</span>
//                    <input type="text" className="form-control" placeholder="Radium Amount" aria-describedby="basic-addon1" value={this.state.value} name="value" onChange={evt => this.handleInputChange(evt)}></input>
//                </div>
//                <p></p>
//                <p></p>
//                <hr className="col-xs-12" />
//            </span>
//        </div>
//    }
//}

//interface Irecipiant {
//    payto: string;
//    account: string;
//    value: number;
//}