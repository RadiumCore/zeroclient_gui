import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { Asset, asset_command, blank_asset_command, asset_command_type } from '../_Interfaces/Assets'
import { InfoPopup } from '../../Global/InfoPopup'
import * as Settings from '../../Global/settings'
import { GetInputPopup } from '../../Global/GetInputPopup'
import { Modal } from 'react-bootstrap'
import { User, blank_user } from "../_Interfaces/iUser"
import { SelectUser } from "../../Global/SelectUser"
import * as settings from "../../Global/settings"
import { SmartTxSendResultComponent } from "../../Global/SmartTxSendResultComponent"
import { TransferAssetPopupConfirmation } from "./TransferAssetPopupConfirmation"

interface Props {
    asset: Asset
    close_callback: any;
    sucess_callback: any;
    language: number;
}
interface State {
    command: asset_command

    //info popup
    info_title: string
    info_body: string
    show_info: boolean

    confirm_name: string
    confirm_id: string

    show_select_user: boolean

    // stage 2 - confirm info
    show_confirmation: boolean
    hex_data: string
    fee: number

    // stage 3 - try send SmartTx

    show_result: boolean
    issueto_display_name: string
}

export class TransferAssetPopup extends React.Component<Props, State>{
    public static defaultProps: Partial<Props> = {
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            info_title: "",
            info_body: "",
            show_info: false,
            //
            confirm_id: "",
            confirm_name: "",

            command: {
                destination: undefined,
                amount: undefined,
                asset_id: this.props.asset.txid,
                command_type: asset_command_type.transfer,
            },
            show_select_user: false,

            //
            show_confirmation: false,
            hex_data: "",
            fee: 0,
            //
            show_result: false,

            //
            issueto_display_name: "",
        };
    }

    close() {
        this.props.close_callback(true)
    }

    set_user(u: User) {
        if (u == undefined) { return }
        this.setState({ issueto_display_name: "User:" + u.username + " Address:" + u.address })
        this.setState({ command: { ...this.state.command, destination: u } })
        this.setState({ show_select_user: false })
    }

    validate() {
        if (this.props.asset.txid != this.state.confirm_id) {
            this.setState({ show_info: true, info_title: "Error", info_body: "Confirmation ID does not match" })
            return;
        }
        if (this.props.asset.name != this.state.confirm_name) {
            this.setState({ show_info: true, info_title: "Error", info_body: "Confirmation name does not match" })
            return;
        }

        // chesks that asset is transferable
        if (!this.props.asset.can_owner_transfer) {
            this.setState({ show_info: true, info_title: "Error", info_body: "This asset is non-transferable!" })
            return;
        }

        let can_transfer: boolean = false
        if (this.props.asset.can_owner_transfer) {
            if (this.props.asset.owner!.address == settings.current_identity.address) {
                can_transfer = true;
            }
        }
        if (!can_transfer) {
            this.setState({ show_info: true, info_title: "Error", info_body: "You do not have permission to transfer this asset!" })
            return;
        }

        // checks that destination is set
        if (this.state.command.destination == undefined) {
            this.setState({ show_info: true, info_title: "Error", info_body: "You must select a person to transfer this asset to!" })
            return;
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
        this.props.sucess_callback()
    }

    select_content() {
        if (this.state.show_confirmation) {
            return <TransferAssetPopupConfirmation asset={this.props.asset} command={this.state.command} cancel_callback={() => this.setState({ show_confirmation: false })} continue_callback={this.send.bind(this)} language={this.props.language} />
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
                <Modal.Title>Transfer Asset</Modal.Title>
                <dl className="dl-horizontal">
                    <dt>Name :</dt> <dd>{this.props.asset.name}</dd>
                    <dt>Description :</dt> <dd>{this.props.asset.description}</dd>
                    <dt>Owner :</dt> <dd>{this.props.asset.owner!.username}</dd>
                    <dt>ID :</dt> <dd>{this.props.asset.txid}</dd>
                </dl>

            </Modal.Header>
            <Modal.Body>

                <p />

                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Transfer To:</span>
                    <input type="text" className="form-control" placeholder="Click to edit" aria-describedby="basic-addon1" required={true} name="username" value={this.state.issueto_display_name} onClick={e => { this.setState({ show_select_user: true }) }} ></input>

                </div>
                <p />
                <span>Transfering an asset is an irriviersable action.</span>
                <span>Please enter the asset name and ID below to confirm</span>
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Asset Name*:</span>
                    <input type="text" className="form-control" placeholder="Name" aria-describedby="basic-addon1" required={true} name="username" value={this.state.confirm_name} onChange={e => { this.setState({ confirm_name: e.target.value }) }} ></input>

                </div>
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Asset ID:</span>
                    <input type="text" className="form-control" placeholder="ID" aria-describedby="basic-addon1" required={true} name="username" value={this.state.confirm_id} onChange={e => { this.setState({ confirm_id: e.target.value }) }} ></input>

                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button type="button" className="btn btn-default btn-danger" onClick={() => { this.props.close_callback() }}>Cancel</button>

                    <button type="button" className="btn btn-default btn-success" onClick={this.validate.bind(this)}>Transfer</button>
                </div>
            </Modal.Footer>
            {this.state.show_select_user ?
                <SelectUser cancel_callback={this.close_select_user.bind(this)} return_callback={this.set_user.bind(this)} language={this.props.language} />
                : null
            }

            {this.state.show_confirmation ?
                <TransferAssetPopupConfirmation command={this.state.command} asset={this.props.asset} cancel_callback={this.cancel_confirmation.bind(this)} continue_callback={this.send.bind(this)} language={this.props.language} />
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