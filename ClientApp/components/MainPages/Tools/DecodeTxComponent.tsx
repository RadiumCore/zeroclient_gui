//import * as React from 'react';
//import ReactTable from 'react-table';
//import 'react-table/react-table.css'
//import { RouteComponentProps } from 'react-router';
//import { InfoPopup } from '../../Global/InfoPopup'
//import * as statics from "../../Global/statics"
//import * as bitcoin from 'bitcoinjs-lib'

//import { Modal } from 'react-bootstrap'
//interface state {
//    rawtx: string;
//}

//interface Props {
//    language: number,
//    close_callback: any,
//}

//export class DecodeTxComponent extends React.Component<Props, state> {
//    constructor(props: Props) {
//        super(props);
//        this.state = {
//            rawtx: "",
//        }
//    };
//    handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
//        const target = e.target;
//        const value = target.value;
//        const name = target.name;
//        this.setState({ [name]: value } as any);
//    }

//    decode() {
//        var tx = bitcoin.Transaction.fromHex(this.state.rawtx);
//    }

//    public render() {
//        return <Modal backdrop={"static"} show={true} onHide={this.props.close_callback}>
//            <Modal.Header closeButton>
//                <Modal.Title>Transaction Decoder</Modal.Title>

//            </Modal.Header>
//            <Modal.Body>
//                <h3>Raw Transaction to Decode</h3>

//                <div className="input-group">
//                    <span className="input-group-addon" id="basic-addon1"></span>
//                    <textarea rows={5} className="form-control" value={this.state.rawtx} name="rawtx" onChange={evt => this.handleInputChange(evt)} />
//                </div>
//                <button onClick={this.decode.bind(this)}>Decode</button>

//                <h3>Outputs</h3>

//            </Modal.Body>
//            <Modal.Footer>
//                <div className="btn-toolbar" role="group" aria-label="...">

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