import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { NFTClass, blank_AssetClass } from '../_Interfaces/Assets'
import { InfoPopup } from '../../Global/InfoPopup'
import * as Settings from '../../Global/settings'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import { GetInputPopup } from '../../Global/GetInputPopup'
import { Modal } from 'react-bootstrap'
import { User, blank_user } from "../_Interfaces/iUser"
import { SelectUser } from "../../Global/SelectUser"
import * as settings from "../../Global/settings"
import { SmartTxSendResultComponent } from '../../Global/SmartTxSendResultComponent'
import { CreateGroupedAssetPopup } from "../NFTClasses/CreateGroupedAssetPopup"
import * as api from '../../Global/API'
import { TransferAssetClassPopup } from './TransferNFTClassPopup';
import { DestroyAssetClassPopup } from './DestroyNFTClassPopup';

interface Props {
    assettxid: string
    close_callback: any;
    language: number;
    address?: string;
}
interface State {
    class: NFTClass

    //info popup
    info_title: string
    info_body: string
    show_info: boolean

    show_transfer_asset_class: boolean
    show_destroy_asset_class: boolean
    show_create_asset: boolean

    load_complete: boolean
}

export class AssetClassInfoPopup extends React.Component<Props, State>{
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
            show_destroy_asset_class: false,
            show_transfer_asset_class: false,
            show_create_asset: false,
            class: blank_AssetClass,
            load_complete: false,
        };
        api.AssetClass(this.props.assettxid, (data: NFTClass) => { this.setState({ class: data, load_complete: true }) })
    }

    open_create_asset() {
        this.setState({ show_create_asset: true })
    }
    close_create_asset() {
        this.setState({ show_create_asset: false })
    }

    open_transfer_asset_class() {
        this.setState({ show_transfer_asset_class: true })
    }
    close_transfer_asset_class() {
        this.setState({ show_transfer_asset_class: false })
    }

    open_destroy_asset_class() {
        this.setState({ show_destroy_asset_class: true })
    }
    close_destroy_asset_class() {
        this.setState({ show_destroy_asset_class: false })
    }

    close() {
        this.props.close_callback(true)
    }

    can_destroy() {
        // check current identity agains owner
        if (this.state.class.owner == undefined) {
            //owner can't destory if owner is undefined
            return false;
        }
        else {
            //assuming owner is defined
            if (this.state.class.owner.address != settings.current_identity.address) {
                return false;
            }
        }

        return this.state.class.class_can_owner_destroy
    }

    can_transfer() {
        // if base permission is false, then below operators are false.
        var can_transfer: boolean = this.state.class.class_transferable;

        // check current identity against creator
        if (settings.current_identity.address != this.state.class.owner.address) {
            can_transfer = false;
        }

        return can_transfer;
    }

    select_content() {
        if (this.state.show_create_asset) {
            return <CreateGroupedAssetPopup class={this.state.class} close_callback={this.close_create_asset.bind(this)}  language={this.props.language} />
        }

        if (this.state.show_transfer_asset_class) {
            return <TransferAssetClassPopup class={this.state.class} close_callback={this.close_create_asset.bind(this)} sucess_callback={this.close.bind(this)} language={this.props.language} />
        }

        if (this.state.show_destroy_asset_class) {
            return <DestroyAssetClassPopup class={this.state.class} close_callback={this.close_create_asset.bind(this)} sucess_callback={this.close.bind(this)} language={this.props.language} />
        }

        if (this.state.show_info) {
            return <InfoPopup title={this.state.info_title} info={this.state.info_body} show_popup={this.state.show_info} close_callback={() => this.setState({ show_info: false })} language={this.props.language} />
        }

        return (<Modal backdrop={"static"} show={this.state.load_complete} onHide={this.props.close_callback}>
            <Modal.Header closeButton>
                <Modal.Title>NFT Group Information</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <dl className="dl-horizontal" >
                    <dt>Name :</dt><dd>{this.state.class.class_name}</dd>
                    <dt>Description :</dt><dd>{this.state.class.class_description}</dd>
                    <dt>Group ID :</dt><dd>{this.state.class.txid}</dd>
                    <dt>Current Owner :</dt><dd>{
                        this.state.class.owner != undefined ? this.state.class.owner.username : this.state.class.creator.username
                    }</dd>
                    <dt>Creator :</dt> <dd>{this.state.class.creator.username}</dd>
                    <dt>Owner can transfer group :</dt> <dd><TrueFalseIcon state={this.state.class.class_transferable} /></dd>
                    <dt>Owner can destroy group :</dt> <dd><TrueFalseIcon state={this.state.class.class_can_owner_destroy} /></dd>
                    <dt>NFTs have identical names :</dt> <dd><TrueFalseIcon state={this.state.class.asset_inherit_name} /></dd>
                    {this.state.class.asset_inherit_name ?
                        <span>
                            <dt> NFT Name :</dt> <dd>{this.state.class.asset_name = "" ? this.state.class.class_name : this.state.class.asset_name}</dd>
                            <dt>NFT Description </dt> <dd>{this.state.class.asset_description = "" ? this.state.class.class_name : this.state.class.asset_description}</dd>
                        </span>
                        : null}
                    <dt> Creators can destroy NFTs :</dt> <dd><TrueFalseIcon state={this.state.class.asset_can_creator_destroy} /></dd>
                    <dt> Owner can destroy NFTs :</dt> <dd><TrueFalseIcon state={this.state.class.asset_can_owner_destroy} /></dd>
                    <dt> Owner can transfer NFTs :</dt> <dd><TrueFalseIcon state={this.state.class.asset_can_owner_transfer} /></dd>

                </dl >

                <div className="btn-toolbar" role="group" aria-label="...">
                    {this.can_destroy() ? <button type="button" className="btn btn-default btn-danger" onClick={this.open_destroy_asset_class.bind(this)} >Destroy Asset Group</button> : null}

                    {this.can_transfer() ? <button type="button" className="btn btn-default btn-success" onClick={this.open_transfer_asset_class.bind(this)} >Transfer Asset Group</button> : null}
                    {settings.current_identity.address == "" ? "Please loging to view NFT destroy/transfer options" : null}
                </div>

            </Modal.Body>
            <Modal.Footer>

                {settings.current_identity.address == this.state.class.owner.address ?
                    <button type="button" className="btn btn-default btn-danger" onClick={this.open_create_asset.bind(this)}>Create Asset in this group </button> : null}

                <button type="button" className="btn btn-default " onClick={this.close.bind(this)} >Ok</button>

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