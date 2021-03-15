import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { NFT, blank_NFT, NFT_command, blank_asset_command, asset_command_type } from '../_Interfaces/Assets'
import { InfoPopup } from '../../Global/InfoPopup'
import * as Settings from '../../Global/settings'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import { GetInputPopup } from '../../Global/GetInputPopup'
import { Modal } from 'react-bootstrap'
import { User, blank_user } from "../_Interfaces/iUser"
import { SelectUser } from "../../Global/SelectUser"
import * as settings from "../../Global/settings"
import { DestroyAssetPopup } from "./DestroyNFTPopup"
import { TransferAssetPopup } from "./TransferNFTPopup"
import { SmartTxSendResultComponent } from '../../Global/SmartTxSendResultComponent'
import * as api from '../../Global/API'
interface Props {
    assettxid: string
    close_callback: any;
    language: number;
    address?: string;
}
interface State {
    asset: NFT

    //info popup
    info_title: string
    info_body: string
    show_info: boolean

    show_transfer_asset: boolean
    show_destroy_asset: boolean

    load_complete: boolean
}

export class AssetInfoPopup extends React.Component<Props, State>{
    public static defaultProps: Partial<Props> = {
        address: ""
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            info_title: "",
            info_body: "",
            show_info: false,
            //
            show_destroy_asset: false,
            show_transfer_asset: false,
            asset: blank_NFT,
            load_complete: false,
        };
        api.GetAsset(this.props.assettxid, (data: any) => { this.setState({ asset: data, load_complete: true }); })
    }

    close() {
        this.props.close_callback(true)
    }
    close_transfer_asset() {
        this.setState({ show_transfer_asset: false })
    }
    close_destroy_asset() {
        this.setState({ show_destroy_asset: false })
    }

    open_transfer_asset() {
        this.setState({ show_transfer_asset: true })
    }
    open_destroy_asset() {
        this.setState({ show_destroy_asset: true })
    }

    can_destroy() {
        // if base permission is false, then below operators are false.
        var creator_destroy_ok: boolean = this.state.asset.can_creator_destroy;
        var owner_destroy_ok: boolean = this.state.asset.can_owner_destroy;

        // check current identity against creator
        if (settings.current_identity.address != this.state.asset.creator.address) {
            creator_destroy_ok = false;
        }

        // check current identity agains owner
        if (this.state.asset.owner == undefined) {
            //owner can't destory if owner is undefined
            owner_destroy_ok = false;
        }
        else {
            //assuming owner is defined
            if (this.state.asset.owner.address != settings.current_identity.address) {
                owner_destroy_ok = false;
            }
        }

        if (!creator_destroy_ok && !owner_destroy_ok) {
            return false;
        }
        return true;
    }

    can_transfer() {
        // if base permission is false, then below operators are false.
        var can_transfer: boolean = this.state.asset.can_owner_transfer;

        // check current identity against creator
        if (settings.current_identity.address != this.state.asset.owner.address) {
            can_transfer = false;
        }

        return can_transfer;
    }

    select_content() {
        if (this.state.show_info) {
            return <InfoPopup title={this.state.info_title} info={this.state.info_body} show_popup={this.state.show_info} close_callback={() => this.setState({ show_info: false })} language={this.props.language} />
        }

        return (<Modal backdrop={"static"} show={true} onHide={this.props.close_callback}>
            <Modal.Header closeButton>
                <Modal.Title>NFT Information</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                {this.state.load_complete ? <dl className="dl-horizontal" >
                    <dt>Name :</dt><dd>{this.state.asset.name}</dd>
                    <dt>Description :</dt><dd>{this.state.asset.description}</dd>
                    {this.state.asset.asset_class != undefined ? <span>
                        <dt>Parrent Class :</dt><dd>{this.state.asset.asset_class}</dd>
                    </span> : null}
                    <dt>Current Owner :</dt><dd>{
                        this.state.asset.owner != undefined ? this.state.asset.owner.username : this.state.asset.creator.username
                    }</dd>
                    <dt>Creator :</dt> <dd>{this.state.asset.creator.username}</dd>
                    <dt>Can Owner Destroy :</dt> <dd><TrueFalseIcon state={this.state.asset.can_owner_destroy} /></dd>
                    <dt>Can Owner Transfer :</dt> <dd><TrueFalseIcon state={this.state.asset.can_owner_transfer} /></dd>
                    <dt>Can Creator Destroy :</dt> <dd><TrueFalseIcon state={this.state.asset.can_creator_destroy} /></dd>

                </dl >
                    :
                    <span>Loading...</span>}

                <div className="btn-toolbar" role="group" aria-label="...">
                    {this.can_destroy() ? <button type="button" className="btn btn-default btn-danger" onClick={this.open_destroy_asset.bind(this)} >Destroy Asset</button> : null}

                    {this.can_transfer() ? <button type="button" className="btn btn-default btn-success" onClick={this.open_transfer_asset.bind(this)} >Transfer Asset</button> : null}
                    {settings.current_identity.address == "" ? "Please loging to view NFT destroy/transfer options" : null}
                </div>

            </Modal.Body>
            <Modal.Footer>

                <button type="button" className="btn btn-default " onClick={this.close.bind(this)} >Ok</button>

            </Modal.Footer>
            {this.state.show_transfer_asset ?
                <TransferAssetPopup asset={this.state.asset} close_callback={this.close_transfer_asset.bind(this)} language={this.props.language} sucess_callback={this.close.bind(this)} />
                : null
            }

            {this.state.show_destroy_asset ?
                <DestroyAssetPopup NFT={this.state.asset} close_callback={this.close_destroy_asset.bind(this)} language={this.props.language} sucess_callback={this.close.bind(this)} />
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