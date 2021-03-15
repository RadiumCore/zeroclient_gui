import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import * as statics from '../../Global/statics'
import { TrueFalseIcon } from "../../Global/TrueFalseIcon"
import * as api from '../../Global/API'
import { NFT, NFT_command, NFTClass } from '../_Interfaces/Assets'
import { Modal } from 'react-bootstrap'
import { InfoPopup } from '../../Global/InfoPopup'

import { result, blank_result } from '../_Interfaces/iResult'
interface Props {
    class: NFTClass
    command: NFT_command

    cancel_callback: any;
    continue_callback: any;
    language: number;
}
interface State {
    encoding_result: result;
}
export class TransferNFTClassPopupConfirmation extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            encoding_result: blank_result
        };

        const body = JSON.stringify({
            command: this.props.command,
        })
        api.EncodeNewAssetCommand(body, (data: any) => { this.setState({ encoding_result: data }); })
    }
    //required for security, set pass to null

    Should_show(st: string): boolean {
        if (typeof (st) == 'string' && st.length > 0)
            return true;

        return false
    }

    close_info() {
        this.props.cancel_callback()
    }

    render() {
        if (!this.state.encoding_result.sucess) {
            return <InfoPopup title={'Error'} info={this.state.encoding_result.message} close_callback={this.props.cancel_callback} show_popup={true} language={this.props.language} />
        }
        return (<Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>Please ensure the following information is correct</Modal.Title>

            </Modal.Header>
            <Modal.Body>

                <span>Transfer NFT</span>
                <dl className="dl-horizontal">
                    <dt>Class Name :</dt> <dd>{this.props.class.class_name}</dd>
                    <dt>Class Action:</dt> <dd>Transfer</dd>
                    <dt>Destination:</dt> <dd>{this.props.command.destination!.username}</dd>

                </dl>

                <span></span>

                <h4>The cost for this operation is {this.state.encoding_result.cost} Radium. Are you sure?</h4>

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button type="button" className="btn btn-default btn-danger" onClick={() => {
                        this.props.cancel_callback()
                    }}>Close</button>

                    <button type="button" className="btn btn-default btn-success" onClick={() => {
                        this.props.continue_callback(this.state.encoding_result)
                    }}>Transfer</button>
                </div>
            </Modal.Footer>
        </Modal>

        );
    }
}
