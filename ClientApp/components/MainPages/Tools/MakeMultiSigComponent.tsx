//import * as React from 'react';
//import ReactTable from 'react-table';
//import 'react-table/react-table.css'
//import { RouteComponentProps } from 'react-router';

//import { Modal } from 'react-bootstrap'
//interface MakeMultiSigState {
//    inputs: any;
//    outputs: any;
//    pubkey_input: string;
//    sigs_required_input: string;
//    make_new: boolean;
//    pubkeys: any;
//    intervaltransaction: any;
//    response: MultisigResponse;
//}

//interface Props {
//    language: number,
//    close_callback: any,
//}

//export class MakeMultiSigComponent extends React.Component<Props, MakeMultiSigState> {
//    constructor(props: Props) {
//        super(props);
//        this.state = { inputs: "", outputs: "", pubkey_input: "", sigs_required_input: "", make_new: true, pubkeys: [], intervaltransaction: [], response: { address: "", redeemScript: "", error: "", id: "" } };
//    }

//    addnewpubkey(key: string) {
//        var newArray = this.state.pubkeys.slice();
//        newArray.push({ key: key });
//        this.setState({ pubkeys: newArray, pubkey_input: "" })
//    }

//    update_pubkey_Input_Value(e: React.ChangeEvent<HTMLInputElement>) { this.setState({ pubkey_input: e.target.value }); }
//    update_Sig_required_Input_Value(e: React.ChangeEvent<HTMLInputElement>) { this.setState({ sigs_required_input: e.target.value }); }

//    CreateNew() {
//        fetch('api/public/PostNewMultisig', {
//            method: 'POST',

//            body: JSON.stringify({
//                keys: this.state.pubkeys,
//                keys_required: this.state.sigs_required_input,
//            })
//        })
//            .then((response) => { return response.json() })
//            .then((json) => {
//                this.setState({ response: json });
//            });
//    }

//    public render() {
//        if (this.state.response.address != "") return this.render_result(); else return this.render_makenew();
//    }

//    render_result() {
//        return <div className='popup'>
//            <div className='popup_inner'>
//                <h3>Multisig Address</h3>
//                <p>{this.state.response.address}</p>
//                <h3>Script</h3>
//                <p>{this.state.response.redeemScript}</p>
//                <p></p>
//                <h2>Copy this information, as it will not be saved. </h2>
//                <button onClick={() => { this.props.close_callback() }}>Close</button>
//            </div>
//        </div>
//    }

//    render_makenew() {
//        const data = this.state.pubkeys

//        const columns = [{
//            Header: 'Pubkey',
//            accessor: 'key'
//        }]

//        return <Modal backdrop={"static"} show={true} onHide={this.props.close_callback}>
//            <Modal.Header closeButton>
//                <Modal.Title>Multi-Signature Address Creation</Modal.Title>

//            </Modal.Header>
//            <Modal.Body>
//                < ReactTable data={data} columns={columns} defaultPageSize={5} showPagination={false} />
//                <input value={this.state.pubkey_input} onChange={evt => this.update_pubkey_Input_Value(evt)} />
//                <button onClick={() => { this.addnewpubkey(this.state.pubkey_input) }}>AddKey</button>
//                <p> <input value={this.state.sigs_required_input} onChange={evt => this.update_Sig_required_Input_Value(evt)} />required sigs</p>
//                <p><button onClick={() => { this.CreateNew() }}>CreateNew</button></p>

//            </Modal.Body>
//            <Modal.Footer>
//                <div className="btn-toolbar" role="group" aria-label="...">

//                    <button onClick={() => { this.props.close_callback() }}>Close</button>
//                </div>
//            </Modal.Footer>
//        </Modal>
//    }
//}
//interface MultisigResponse {
//    address: string;
//    redeemScript: string;
//    error: any;
//    id: any;
//}