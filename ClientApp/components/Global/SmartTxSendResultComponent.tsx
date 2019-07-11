import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../Language/Language'
import * as crypto from "crypto-js";
import { sha256 } from 'js-sha256';
import { Modal } from 'react-bootstrap'
import * as statics from '../Global/statics'
import * as settings from '../Global/settings'
import * as bitcoin from 'radiumjs-lib'
import { InfoPopup } from '../Global/InfoPopup'
import * as api from '../Global/API'
interface Props {
    encoded_hex: string;
    fee: number;
    identity: string;
    language: number;
    sucess_close_callback: any;
    fail_close_callback: any;
}
interface SmartTxSendResultComponentState {
    loading: boolean;
    show_pw_popup: boolean;
    signed: string;
    result: SendResult;
    show_me: boolean;
    show_info: boolean;
    info_message: string;
}

export class SmartTxSendResultComponent extends React.Component<Props, SmartTxSendResultComponentState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: true,
            show_pw_popup: true,
            result: { sucess: false, message: "" },
            show_me: true,
            signed: "",
            show_info: false,
            info_message: "",
        };

        this.send_smart_tx();
    }

    send_smart_tx() {
        const body = JSON.stringify({
            hex: this.props.encoded_hex,
            fee: this.props.fee,
            identity: settings.current_identity.address,
        })

        api.BuildSmartTx(body, (data: any) => {
            if (data.sucess) {
                var tx = bitcoin.Transaction.fromHex(data.message);
                var txb = bitcoin.TransactionBuilder.fromTransaction(tx, bitcoin.networks.radium);
                txb.sign(0, settings.private_keypair)

                var stx = txb.build().toHex();
                const body2 = JSON.stringify({
                    hex: stx
                })

                api.SendRawTx(body2, (data: any) => { this.setState({ result: data, loading: false }); })
            }
            else { this.setState({ info_message: data.message, loading: false }) }
        })
    }

    close_me() {
        if (this.state.result.sucess) {
            console.log("close_me sucess callback")
            this.props.sucess_close_callback()
        }
        else {
            console.log("close_me fail callback")
            this.props.fail_close_callback()
        }
    }

    get_title() {
        if (this.state.loading) {
            return t[this.props.language].Loading
        }
        if (this.state.result.sucess) {
            return <h4> Sucess! SmartTx sent to network</h4>
        }
        return <h4>Error!</h4>
    }

    get_body() {
        if (this.state.loading) {
            return "please wait..."
        }
        if (this.state.result.sucess) {
            return <dl className="dl-horizontal">
                <span><h4> Success! Your transaction will be visible once it has reached all nodes of the Radium
                    network. This is usually complete in less than two minutes.</h4></span>
            </dl>
        }
        return <dl className="dl-horizontal">
            <span><h4>{this.state.info_message}</h4></span>
        </dl>
    }

    select_content() {
        if (this.state.show_info)
            return (<InfoPopup close_callback={this.setState({ show_info: false })} info={this.state.info_message} show_popup={true} language={this.props.language} title={"Error"} />)
        return (
            <Modal backdrop={"static"} show={true} onHide={() => { }}>
                <Modal.Header closeButton>
                    {this.get_title()}

                </Modal.Header>
                <Modal.Body>
                    {this.get_body()}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-default btn-danger" onClick={this.close_me.bind(this)}>Close</button>
                </Modal.Footer>
            </Modal>
        )
    }

    render() {
        let content = this.select_content()

        return (content);
    }
}

interface SendResult {
    sucess: boolean,
    message: string
}