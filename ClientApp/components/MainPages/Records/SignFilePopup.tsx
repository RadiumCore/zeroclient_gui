import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import * as crypto from "crypto-js";
import { sha256 } from 'js-sha256';
import { HashFileComponent } from './HashFileComponent'
import { SetTitleComponent } from './SetTitleComponent'
import { SignFileConfirmationComponent } from './SignFileConfirmationComponent'
import { SmartTxSendResultComponent } from '../../Global/SmartTxSendResultComponent'
import { User } from '../_Interfaces/iUser'
import { Modal } from 'react-bootstrap'
import { InfoPopup } from '../../Global/InfoPopup'

import * as settings from '../../Global/settings'
interface Props {
    close_callback: any;
    language: number;
}
interface SignFilePopupState {
    //control
    show_confimration: boolean;
    show_result: boolean;

    hex_data: string;

    file_title: string;
    file_hash: string;
    fee: number;

    //info popup
    info_title: string
    info_body: string
    show_info: boolean

    // identity
}

export class SignFilePopup extends React.Component<Props, SignFilePopupState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            show_confimration: false,
            show_result: false,
            //
            hex_data: "",

            file_title: "",
            file_hash: "",
            fee: 0,

            //
            info_title: "",
            info_body: "",
            show_info: false,
            //
        };
    }

    got_hash(hash: string) {
        this.setState({ file_hash: hash })
    }
    got_encoding(res: result) {
        this.setState({ hex_data: res.hex, fee: res.cost, show_confimration: false, show_result: true })
    }

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value } as any)
    }

    close() {
        this.props.close_callback(true)
    }

    validate() {
        if (this.state.file_hash == "" || this.state.file_hash == null) {
            this.setState({ info_title: "Data Error", info_body: "You must select a file", show_info: true })
            return;
        }

        this.setState({ show_confimration: true })
    }
    close_info() {
        this.setState({ show_info: false })
    }

    select_content() {
        if (settings.current_identity.address == "") {
            this.setState({ info_title: "Please log in", info_body: "Please log in using the loging button on the lower left" })
            return (<InfoPopup show_popup={true} close_callback={this.close.bind(this)} title={this.state.info_title} info={this.state.info_body} language={this.props.language} />)
        }

        if (this.state.show_confimration) {
            return <SignFileConfirmationComponent complete_callback={this.got_encoding.bind(this)} cancel_callback={() => { this.setState({ show_confimration: false }) }} language={this.props.language} title={this.state.file_title} hash={this.state.file_hash} identity={settings.current_identity.address} />
        }

        if (this.state.show_result) {
            return <SmartTxSendResultComponent encoded_hex={this.state.hex_data} fee={this.state.fee} identity={settings.current_identity.address} language={this.props.language} sucess_close_callback={this.close.bind(this)} fail_close_callback={this.close.bind(this)} />
        }

        return <Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>Sign a File</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <HashFileComponent complete_callback={this.got_hash.bind(this)} language={this.props.language} />
                <span> Describe the file (optional)</span>
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Title:</span>
                    <input type="text" className="form-control" placeholder="Title" maxLength={60} aria-describedby="basic-addon1" name="file_title" value={this.state.file_title} onChange={evt => this.handleInputChange(evt)}></input>

                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button type="button" className="btn btn-default btn-danger" onClick={() => { this.props.close_callback() }}>Close</button>
                    <button type="button" className="btn btn-default btn-success" onClick={this.validate.bind(this)}>{t[this.props.language].Continue}</button>

                </div>

            </Modal.Footer>
        </Modal>
    }

    render() {
        let content = this.select_content()

        return (
            this.state.show_info ?
                <InfoPopup show_popup={true} close_callback={this.close_info.bind(this)} title={this.state.info_title} info={this.state.info_body} language={this.props.language} />
                :
                content
        )
    }
}

interface result {
    hex: string
    cost: number
}