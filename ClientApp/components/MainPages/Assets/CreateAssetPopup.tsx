import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { Asset, blank_asset } from '../_Interfaces/Assets'
import { InfoPopup } from '../../Global/InfoPopup'
import * as Settings from '../../Global/settings'
import { GetInputPopup } from '../../Global/GetInputPopup'
import { Modal } from 'react-bootstrap'
import { User, blank_user } from "../_Interfaces/iUser"
import { SelectUser } from "../../Global/SelectUser"
import * as settings from "../../Global/settings"
import { CreateAssetPopupConfirmation } from "./CreateAssetPopupConfirmation"

import { SmartTxSendResultComponent } from '../../Global/SmartTxSendResultComponent'

interface Props {
    close_callback: any;
    language: number;
    address?: string;
}
interface State {
    //control
    stage: number

    //info popup
    info_title: string
    info_body: string
    show_info: boolean

    // stage 1 - gather info
    Asset: Asset
    show_select_user: boolean

    // stage 2 - confirm info
    show_confirmation: boolean
    hex_data: string
    fee: number

    // stage 3 - try send SmartTx

    show_result: boolean

    use_assetclass: boolean

    issue_to_self: boolean
    issueto_display_name: string;
}

export class CreateAssetPopup extends React.Component<Props, State>{
    public static defaultProps: Partial<Props> = {
        address: ""
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            stage: 0,
            //
            info_title: "",
            info_body: "",
            show_info: false,
            //
            Asset: blank_asset,
            show_select_user: false,

            //
            show_confirmation: false,
            hex_data: "",
            fee: 0,
            //
            show_result: false,

            //
            use_assetclass: false,
            issue_to_self: false,
            issueto_display_name: "",
        };
    }

    close() {
        this.props.close_callback(true)
    }

    set_user(u: User) {
        if (u == undefined) { return }
        this.setState({ issueto_display_name: "User:" + u.username + " Address:" + u.address })
        this.setState({ Asset: { ...this.state.Asset, owner: u } })
        this.setState({ show_select_user: false })
    }

    validate() {
        if (this.state.issue_to_self) {
            this.setState({ Asset: { ...this.state.Asset, owner: settings.current_identity } })
        }

        this.setState({ show_confirmation: true })
    }
    cancel_confirmation() {
        this.setState({ show_confirmation: false })
    }

    send(res: result) {
        this.setState({ hex_data: res.hex, fee: res.cost, show_confirmation: false, show_result: true })
    }

    close_select_user() {
        this.setState({ show_select_user: false })
    }

    fail() {
        this.setState({ hex_data: "", fee: 0, show_confirmation: false, show_result: false })
    }

    sucess() {
        this.props.close_callback()
    }

    select_content() {
        if (this.state.show_confirmation) {
            return <CreateAssetPopupConfirmation asset={this.state.Asset} cancel_callback={this.cancel_confirmation.bind(this)} continue_callback={this.send.bind(this)} language={this.props.language} />
        }
        if (this.state.show_result) {
            console.log(this.state)
            console.log("try show send ")
            return <SmartTxSendResultComponent encoded_hex={this.state.hex_data} fee={this.state.fee} identity={settings.current_identity.address} language={this.props.language} sucess_close_callback={this.sucess.bind(this)} fail_close_callback={this.fail.bind(this)} />
        }
        if (this.state.show_info) {
            return <InfoPopup title={this.state.info_title} info={this.state.info_body} show_popup={this.state.show_info} close_callback={() => this.setState({ show_info: false })} language={this.props.language} />
        }

        return (<Modal backdrop={"static"} show={true} onHide={this.props.close_callback}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Single Asset</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Asset Name*:</span>
                    <input type="text" className="form-control" placeholder="Name" aria-describedby="basic-addon1" required={true} name="username" value={this.state.Asset.name} onChange={e => { this.setState({ Asset: { ...this.state.Asset, name: e.target.value } }) }} ></input>

                </div>
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Asset Description:</span>
                    <input type="text" className="form-control" placeholder="Description" aria-describedby="basic-addon1" required={true} name="username" value={this.state.Asset.description} onChange={e => { this.setState({ Asset: { ...this.state.Asset, description: e.target.value } }) }} ></input>

                </div>
                <p />
                {!this.state.issue_to_self ?
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon1">Issue To:</span>
                        <input type="text" className="form-control" placeholder="Click to edit" aria-describedby="basic-addon1" required={true} name="username" value={this.state.issueto_display_name} onClick={e => { this.setState({ show_select_user: true }) }} ></input>

                    </div>
                    :
                    null}

                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this.state.issue_to_self} onChange={e => { this.setState({ issue_to_self: !this.state.issue_to_self }) }} />
                        Issue Asset to yourself</label>
                </div>

                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this.state.Asset.can_creator_destroy} onChange={e => { this.setState({ Asset: { ...this.state.Asset, can_creator_destroy: !this.state.Asset.can_creator_destroy } }) }} />
                        Asset can be destroyed by the creator</label>
                </div>

                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this.state.Asset.can_owner_destroy} onChange={e => { this.setState({ Asset: { ...this.state.Asset, can_owner_destroy: !this.state.Asset.can_owner_destroy } }) }} />
                        Asset can be destroyed by the owner</label>
                </div>

                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this.state.Asset.can_owner_transfer} onChange={e => { this.setState({ Asset: { ...this.state.Asset, can_owner_transfer: !this.state.Asset.can_owner_transfer } }) }} />
                        Asset can be transfered</label>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button type="button" className="btn btn-default btn-danger" onClick={() => { this.props.close_callback() }}>Close</button>

                    <button type="button" className="btn btn-default btn-success" onClick={this.validate.bind(this)}>Continue</button>
                </div>
            </Modal.Footer>
            {this.state.show_select_user ?
                <SelectUser cancel_callback={this.close_select_user.bind(this)} return_callback={this.set_user.bind(this)} language={this.props.language} />
                : null
            }

        </Modal>
        )
    }

    render() {
        console.log(this.state)
        let content = this.select_content()

        return (content)
    }
}

interface result {
    hex: string
    cost: number
}