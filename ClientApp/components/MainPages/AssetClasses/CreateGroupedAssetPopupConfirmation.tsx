import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import * as statics from '../../Global/statics'
import { TrueFalseIcon } from "../../Global/TrueFalseIcon"
import * as api from '../../Global/API'
import { Asset, AssetClass } from '../_Interfaces/Assets'
import { Modal } from 'react-bootstrap'
import { InfoPopup } from '../../Global/InfoPopup'

interface Props {
    asset: Asset
    class: AssetClass
    cancel_callback: any;
    continue_callback: any;
    language: number;
}
interface State {
    encoding_result: result;
    loading: boolean;
}

export class CreateGroupedAssetPopupConfirmation extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            encoding_result: {
                hex: "",
                cost: 0,
                sucess: false,
                message: "",
            },
            loading: true,
        };

        const body = JSON.stringify({
            asset: this.props.asset,
        })
        api.EncodeNewAsset(body, (data: any) => { this.setState({ encoding_result: data, loading: false }) })
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

    get_asset_name(): string {
        if (this.props.asset.name != "")
            return this.props.asset.name
        if (this.props.class.asset_name != undefined)
            return this.props.class.asset_name
        return this.props.class.class_name
    }

    get_asset_description(): string {
        if (this.props.asset.description != "")
            return this.props.asset.description
        if (this.props.class.asset_description != undefined)
            return this.props.class.asset_description
        return this.props.class.class_description
    }

    render() {
        if (!this.state.encoding_result.sucess) {
            return <InfoPopup close_callback={this.close_info.bind(this)} title={"ERROR"} info={this.state.encoding_result.message} show_popup={true} language={this.props.language} />
        }
        return (<Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>Please ensure the following information is correct</Modal.Title>

            </Modal.Header>
            <Modal.Body>

                <dl className="dl-horizontal">
                    <dt>Asset Name :</dt> <dd>{this.get_asset_name()}</dd>
                    <dt>{t[this.props.language].Description} :</dt><dd>{this.get_asset_description()}</dd>
                    <dt>Asset Group :</dt><dd> {this.props.class.owner.username}.{this.props.class.class_name}</dd>
                    <dt>Asset Issued To :</dt><dd>{
                        this.props.asset.owner == undefined ? <span>Self</span> : this.props.asset.owner.username
                    }</dd>

                    <dt> Asset Creators can destroy assets :</dt> <dd><TrueFalseIcon state={this.props.class.asset_can_creator_destroy} /></dd>
                    <dt> Asset Owner can destroy assets :</dt> <dd><TrueFalseIcon state={this.props.class.asset_can_owner_destroy} /></dd>
                    <dt> Asset Owner can transfer assets :</dt> <dd><TrueFalseIcon state={this.props.class.asset_can_owner_transfer} /></dd>

                </dl>

                <h4>The cost for this operation is {this.state.encoding_result.cost} Radium. Are you sure?</h4>

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button type="button" className="btn btn-default btn-danger" onClick={() => {
                        this.props.cancel_callback()
                    }}>Close</button>

                    <button type="button" className="btn btn-default btn-success" onClick={() => {
                        this.props.continue_callback(this.state.encoding_result)
                    }}>Create</button>
                </div>
            </Modal.Footer>
        </Modal>

        );
    }
}

interface result {
    hex: string
    cost: number
    sucess: boolean
    message: string
}