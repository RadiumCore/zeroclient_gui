import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { AssetClass, blank_AssetClass } from '../_Interfaces/Assets'
import { InfoPopup } from '../../Global/InfoPopup'
import * as Settings from '../../Global/settings'
import { GetInputPopup } from '../../Global/GetInputPopup'
import { Modal } from 'react-bootstrap'
import { User, blank_user } from "../_Interfaces/iUser"
import { SelectUser } from "../../Global/SelectUser"
import * as settings from "../../Global/settings"
import { CreateClassPopupConfirmation } from "./CreateClassPopupConfirmation"
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
    Class: AssetClass
    show_select_user: boolean

    // stage 2 - confirm info
    show_confirmation: boolean
    hex_data: string
    fee: number

    // stage 3 - try send SmartTx

    show_result: boolean

    use_custom_classwide_name: boolean

    issue_to_self: boolean
    issueto_display_name: string;
}

export class CreateClassPopup extends React.Component<Props, State>{
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
            Class: blank_AssetClass,
            show_select_user: false,

            //
            show_confirmation: false,
            hex_data: "",
            fee: 0,
            //
            show_result: false,

            //
            use_custom_classwide_name: false,
            issue_to_self: false,
            issueto_display_name: "",
        };
    }

    close() {
        this.props.close_callback(true)
    }

    validate() {
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
            return <CreateClassPopupConfirmation class={this.state.Class} cancel_callback={this.cancel_confirmation.bind(this)} continue_callback={this.send.bind(this)} language={this.props.language} />
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
                <Modal.Title>Create New Asset Group</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Class Name*:</span>
                    <input type="text" className="form-control" placeholder="Name" aria-describedby="basic-addon1" required={true} name="class_name" value={this.state.Class.class_name} onChange={e => { this.setState({ Class: { ...this.state.Class, class_name: e.target.value } }) }} ></input>

                </div>
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Class Description:</span>
                    <input type="text" className="form-control" placeholder="Description" aria-describedby="basic-addon1" required={true} name="class_description" value={this.state.Class.class_description} onChange={e => { this.setState({ Class: { ...this.state.Class, class_description: e.target.value } }) }} ></input>

                </div>
                {!this.state.use_custom_classwide_name && this.state.Class.asset_inherit_name ? <span>
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon1">Asset Name*:</span>
                        <input type="text" className="form-control" placeholder="Name" aria-describedby="basic-addon1" required={true} name="class_name" value={this.state.Class.asset_name} onChange={e => { this.setState({ Class: { ...this.state.Class, asset_name: e.target.value } }) }} ></input>

                    </div>
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon1">Asset Description:</span>
                        <input type="text" className="form-control" placeholder="Description" aria-describedby="basic-addon1" required={true} name="class_description" value={this.state.Class.asset_description} onChange={e => { this.setState({ Class: { ...this.state.Class, asset_description: e.target.value } }) }} ></input>

                    </div> </span>
                    : null}

                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this.state.Class.class_transferable} onChange={e => { this.setState({ Class: { ...this.state.Class, class_transferable: !this.state.Class.class_transferable } }) }} />
                        Class owner can transfer class controll</label>
                </div>

                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this.state.Class.class_can_owner_destroy} onChange={e => { this.setState({ Class: { ...this.state.Class, class_can_owner_destroy: !this.state.Class.class_can_owner_destroy } }) }} />
                        Class owner can destroy class and all associated assets</label>
                </div>

                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this.state.Class.asset_inherit_name} onChange={e => { this.setState({ Class: { ...this.state.Class, asset_inherit_name: !this.state.Class.asset_inherit_name }, use_custom_classwide_name: !this.state.Class.asset_inherit_name }) }} />
                        All assets have identical names</label>
                </div>
                {this.state.Class.asset_inherit_name ?
                    <div className="checkbox check-margin10">
                        <label>
                            <input type="checkbox" checked={this.state.use_custom_classwide_name} onChange={e => { this.setState({ use_custom_classwide_name: !this.state.use_custom_classwide_name }) }} />
                            Assets inherit name from class</label>
                    </div>
                    : null}

                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this.state.Class.asset_can_creator_destroy} onChange={e => { this.setState({ Class: { ...this.state.Class, asset_can_creator_destroy: !this.state.Class.asset_can_creator_destroy } }) }} />
                        Asset Creators can destroy own assets of this class</label>
                </div>

                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this.state.Class.asset_can_owner_destroy} onChange={e => { this.setState({ Class: { ...this.state.Class, asset_can_owner_destroy: !this.state.Class.asset_can_owner_destroy } }) }} />
                        Asset Owner can destroy own assets of this class</label>
                </div>

                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this.state.Class.asset_can_owner_transfer} onChange={e => { this.setState({ Class: { ...this.state.Class, asset_can_owner_transfer: !this.state.Class.asset_can_owner_transfer } }) }} />
                        Asset Owner can transfer own assets of this class</label>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button type="button" className="btn btn-default btn-danger" onClick={() => { this.props.close_callback() }}>Close</button>

                    <button type="button" className="btn btn-default btn-success" onClick={this.validate.bind(this)}>Continue</button>
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