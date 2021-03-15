import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { NFT, NFTClass, blank_asset_command, asset_command_type, NFT_command } from '../_Interfaces/Assets'
import { InfoPopup } from '../../Global/InfoPopup'
import * as Settings from '../../Global/settings'
import { GetInputPopup } from '../../Global/GetInputPopup'
import { Modal } from 'react-bootstrap'
import { User, blank_user } from "../_Interfaces/iUser"
import { SelectUser } from "../../Global/SelectUser"
import * as settings from "../../Global/settings"
import { SmartTxSendResultComponent } from "../../Global/SmartTxSendResultComponent"
import { DestroyAssetPopupConfirmation } from "./DestroyNFTPopupConfirmation"

interface Props {
    NFT: NFT
    close_callback: any;
    sucess_callback: any;
    language: number;
}
interface State {
    command: NFT_command

    //info popup
    info_title: string
    info_body: string
    show_info: boolean

    confirm_name: string
    confirm_id: string

    // stage 2 - confirm info
    show_confirmation: boolean
    hex_data: string
    fee: number

    // stage 3 - try send SmartTx

    show_result: boolean
}

export class DestroyAssetPopup extends React.Component<Props, State>{
    public static defaultProps: Partial<Props> = {
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            info_title: "",
            info_body: "",
            show_info: false,
            //
            command: {
                destination: undefined,
                amount: undefined,
                asset_id: this.props.NFT.txid,
                command_type: asset_command_type.destroy,
            },
            confirm_name: "",
            confirm_id: "",

            //
            show_confirmation: false,
            hex_data: "",
            fee: 0,
            //
            show_result: false,

            //
        };
    }

    close() {
        this.props.close_callback(true)
    }

    validate() {
        if (this.props.NFT.txid != this.state.confirm_id) {
            this.setState({ show_info: true, info_title: "Error", info_body: "Confirmation ID does not match" })
            return;
        }
        if (this.props.NFT.name != this.state.confirm_name) {
            this.setState({ show_info: true, info_title: "Error", info_body: "Confirmation name does not match" })
            return;
        }

        // Destroy command validation

        // if base permission is false, then below operators are false.
        var creator_destroy_ok: boolean = this.props.NFT.can_creator_destroy;
        var owner_destroy_ok: boolean = this.props.NFT.can_owner_destroy;

        // check current identity against creator
        if (settings.current_identity.address != this.props.NFT.creator.address) {
            creator_destroy_ok = false;
        }

        // check current identity agains owner
        if (this.props.NFT.owner == undefined) {
            //owner can't destory if owner is undefined
            owner_destroy_ok = false;
        }
        else {
            //assuming owner is defined
            if (this.props.NFT.owner.address != settings.current_identity.address) {
                owner_destroy_ok = false;
            }
        }

        if (!creator_destroy_ok && !owner_destroy_ok) {
            this.setState({ show_info: true, info_title: "Error", info_body: "You do not have the permissions to destroy this NFT!" })
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

    fail() {
        this.setState({ hex_data: "", fee: 0, show_confirmation: false, show_result: false })
    }

    sucess() {
        this.props.sucess_callback()
    }

    select_content() {
        if (this.state.show_confirmation) {
            return <DestroyAssetPopupConfirmation NFT={this.props.NFT} command={this.state.command} cancel_callback={this.cancel_confirmation.bind(this)} continue_callback={this.send.bind(this)} language={this.props.language} />
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
                <Modal.Title>Destroy NFT</Modal.Title>
                <dl className="dl-horizontal">
                    <dt>Name :</dt> <dd>{this.props.NFT.name}</dd>
                    <dt>ID :</dt> <dd>{this.props.NFT.txid}</dd>
                    <dt>Owner :</dt> <dd>{this.props.NFT.owner!.username}</dd>
                    <dt>ID :</dt> <dd>{this.props.NFT.creator.username}</dd>
                </dl>

            </Modal.Header>
            <Modal.Body>

                <span>Destroying an NFT is an irriviersable action.</span>
                <span>Please enter the NFT name and ID below to confirm</span>
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">NFT Name*:</span>
                    <input type="text" className="form-control" placeholder="Name" aria-describedby="basic-addon1" required={true} name="username" value={this.state.confirm_name} onChange={e => { this.setState({ confirm_name: e.target.value }) }} ></input>

                </div>
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">NFT ID:</span>
                    <input type="text" className="form-control" placeholder="ID" aria-describedby="basic-addon1" required={true} name="username" value={this.state.confirm_id} onChange={e => { this.setState({ confirm_id: e.target.value }) }} ></input>

                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button type="button" className="btn btn-default btn-danger" onClick={() => { this.props.close_callback() }}>Cancel</button>

                    <button type="button" className="btn btn-default btn-success" onClick={this.validate.bind(this)}>Destroy</button>
                </div>
            </Modal.Footer>

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