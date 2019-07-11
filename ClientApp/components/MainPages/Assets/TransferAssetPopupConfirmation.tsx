import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import * as statics from '../../Global/statics'
import { TrueFalseIcon } from "../../Global/TrueFalseIcon"
import * as api from '../../Global/API'
import { Asset, asset_command } from '../_Interfaces/Assets'
import { Modal } from 'react-bootstrap'

interface Props {
    asset: Asset
    command: asset_command

    cancel_callback: any;
    continue_callback: any;
    language: number;
}
interface State {
    encoding_result: result;
}
export class TransferAssetPopupConfirmation extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            encoding_result: {
                hex: "",
                cost: 0,
            }
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

    render() {
        return (<Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>Please ensure the following information is correct</Modal.Title>

            </Modal.Header>
            <Modal.Body>

                <span>Transfer Asset</span>
                <dl className="dl-horizontal">
                    <dt>Asset Name :</dt> <dd>{this.props.asset.name}</dd>
                    <dt>Asset Action:</dt> <dd>Transfer</dd>
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

interface result {
    hex: string
    cost: number
}