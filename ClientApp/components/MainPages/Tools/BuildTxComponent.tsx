//import * as React from 'react';
//import ReactTable from 'react-table';
//import 'react-table/react-table.css'
//import { RouteComponentProps } from 'react-router';
//import { InfoPopup } from '../../Global/InfoPopup'
//import * as statics from "../../Global/statics"

//import { Modal } from 'react-bootstrap'
//interface MultiSigState {
//    inputs: input[];
//    in_input: string;
//    in_index: number;
//    outputs: output[];
//    in_address: string;
//    in_value: number;

//    input_lookup_result: input;
//    rawtx: string;
//    showresult: boolean;
//}

//interface Props {
//    language: number,
//    close_callback: any,
//}

//export class BuildTransactionComponent extends React.Component<Props, MultiSigState> {
//    constructor(props: Props) {
//        super(props);
//        this.state = {
//            inputs: [],
//            in_input: "",
//            in_index: -1,
//            outputs: [],
//            in_address: "",
//            in_value: -1,
//            input_lookup_result: { txid: "", index: 0, value: 0 },
//            rawtx: "",
//            showresult: false,
//        }
//    };
//    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
//        const target = e.target;
//        const value = target.type === 'checkbox' ? target.checked : target.value;
//        const name = target.name;
//        this.setState({ [name]: value } as any);
//    }
//    addinput() {
//        fetch('api/public/GetInputValue', {
//            method: 'POST',
//            headers: statics.requestHeaders,

//            body: JSON.stringify({
//                txid: this.state.in_input,
//                index: this.state.in_index,
//            })
//        })
//            .then((response) => { return response.json() })
//            .then((json) => {
//                var newArray = this.state.inputs.slice();
//                var val: number = 0;
//                val = json["result"] as number;
//                newArray.push({ txid: this.state.in_input, index: this.state.in_index, value: val });
//                this.setState({ inputs: newArray, in_input: "", in_index: -1, })
//            });
//    }
//    addoutput() {
//        var newArray = this.state.outputs.slice();
//        newArray.push({
//            address: this.state.in_address,
//            value: this.state.in_value
//        });
//        this.setState({ outputs: newArray, in_address: "", in_value: -1 })
//    }

//    CheckTransaction() {
//    }
//    BuildTransaction() {
//        fetch('api/public/PostCreateRawTransaction', {
//            method: 'POST',
//            headers: statics.requestHeaders,
//            body: JSON.stringify({
//                inputs: this.state.inputs,
//                outputs: this.state.outputs,
//            })
//        })
//            .then((response) => { return response.json() })
//            .then((json) => {
//                var rawtxid: string = "";
//                rawtxid = json["result"] as string;
//                if (rawtxid != "error") {
//                    this.setState({ rawtx: rawtxid, showresult: true })
//                }
//            });
//    }

//    close_popup() {
//        this.setState({ showresult: false })
//    }

//    public render() {
//        const inputs = this.state.inputs;
//        const input_columns = [
//            {
//                Header: 'Txid',
//                accessor: 'txid'
//            },
//            {
//                Header: 'Index',
//                accessor: 'index'
//            },
//            {
//                Header: 'Value',
//                accessor: 'value'
//            },

//        ]

//        const outputs = this.state.outputs;
//        const output_columns = [
//            {
//                Header: 'Address',
//                accessor: 'address'
//            },
//            {
//                Header: 'Value',
//                accessor: 'value'
//            },

//        ]
//        let total_input: number = 0
//        for (let entry of this.state.inputs) {
//            total_input += entry.value; // 1, "string", false
//        }

//        let total_output: number = 0
//        for (let entry of this.state.outputs) {
//            total_output += entry.value; // 1, "string", false
//        }

//        let fee: number = total_input - total_output

//        return <Modal backdrop={"static"} show={true} onHide={this.props.close_callback}>
//            <Modal.Header closeButton>
//                <Modal.Title>Transaction Builder</Modal.Title>

//            </Modal.Header>
//            <Modal.Body>
//                <h3>Inputs</h3>
//                < ReactTable data={inputs} columns={input_columns} defaultPageSize={2} showPagination={false} />
//                <div className='row'>
//                    <div className='col-sm-9'>
//                        <div className="input-group">
//                            <span className="input-group-addon" id="basic-addon1">Unspent Output:</span>
//                            <input type="text" className="form-control" value={this.state.in_input} name="in_input" onChange={evt => this.handleInputChange(evt)} />
//                        </div>
//                    </div>

//                    <div className='col-sm-3'>
//                        <div className="input-group">
//                            <span className="input-group-addon" id="basic-addon1">Index:</span>
//                            <input type="number" className="form-control" value={this.state.in_index} name="in_index" onChange={evt => this.handleInputChange(evt)} />
//                        </div>
//                    </div>

//                </div>

//                <div className='row'>
//                    <div className='col-sm-6'>
//                        <button onClick={this.addinput.bind(this)}>Add Input</button>
//                    </div>

//                    <div className='col-sm-6'>
//                        <span> Input Total Value: {total_input}</span>
//                    </div>
//                </div>

//                <h3>Outputs</h3>

//                < ReactTable data={outputs} columns={output_columns} defaultPageSize={2} showPagination={false} />
//                <div className='row'>
//                    <div className='col-sm-9'>
//                        <div className="input-group">
//                            <span className="input-group-addon" id="basic-addon1">Recipiant:</span>
//                            <input type="text" className="form-control" value={this.state.in_address} name="in_address" onChange={evt => this.handleInputChange(evt)} />
//                        </div>
//                    </div>

//                    <div className='col-sm-3'>
//                        <div className="input-group">
//                            <span className="input-group-addon" id="basic-addon1">Value:</span>
//                            <input type="number" className="form-control" value={this.state.in_value} name="in_value" onChange={evt => this.handleInputChange(evt)} />
//                        </div>
//                    </div>

//                </div>
//                <div className='row'>
//                    <div className='col-sm-4'>
//                        <button onClick={this.addoutput.bind(this)}>Add output</button>
//                    </div>

//                    <div className='col-sm-4'>
//                        <span> Input Total Value: {total_input}</span>
//                    </div>
//                    <div className='col-sm-4'>
//                        <span> Network Fees: {fee}</span>
//                    </div>

//                </div>

//                <InfoPopup show_popup={this.state.showresult} title={"Raw Transaction"} info={this.state.rawtx} close_callback={this.close_popup.bind(this)} language={this.props.language} />

//            </Modal.Body>
//            <Modal.Footer>
//                <div className="btn-toolbar" role="group" aria-label="...">

//                    <button onClick={this.BuildTransaction.bind(this)}>Check Transaction</button>
//                    <button onClick={() => { this.props.close_callback(true) }}>Close</button>
//                </div>
//            </Modal.Footer>
//        </Modal>
//    }
//}

//interface input {
//    txid: string;
//    index: number;
//    value: number;
//}
//interface output {
//    address: string;
//    value: number;
//}
//interface rawtx {
//    rawtx: string;
//}