import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { User, blank_user, customfield, blank_customfield } from '../_Interfaces/iUser'
import { CreateUserPopupConfirmation } from './CreateUserPopupConfirmation'
import { InfoPopup } from '../../Global/InfoPopup'
import * as Settings from '../../Global/settings'
import { GetInputPopup } from '../../Global/GetInputPopup'
import { Modal } from 'react-bootstrap'

import { SmartTxSendResultComponent } from '../../Global/SmartTxSendResultComponent'

interface Props {
    close_callback: any;
    language: number;
    address?: string;
}
interface CreateUserPopupState {
    //control
    stage: number

    //info popup
    info_title: string
    info_body: string
    show_info: boolean

    // stage 1 - gather info
    user: User
    valid_username: boolean

    // stage 2 - confirm info
    show_confirmation: boolean
    hex_data: string
    fee: number

    // stage 3 - try send SmartTx

    show_result: boolean
}

export class CreateUserPopup extends React.Component<Props, CreateUserPopupState>{
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
            user: blank_user,
            valid_username: true,
            //
            show_confirmation: false,
            hex_data: "",
            fee: 0,
            //
            show_result: false,
        };

        if (this.props.address != "") {
            let temp = this.state.user;
            temp.address = this.props.address!;
            this.setState({ user: temp })
        }
    }

    set_address(address: string): User {
        var temp: User = this.state.user;
        temp.address = address;
        return temp;
    }

    close() {
        this.props.close_callback(true)
    }

    username_change(name: string) {
        this.setState({ user: { ...this.state.user, username: name } });
    }

    setError = (errorMessage: string) => {
        this.setState({ info_title: "Data Error", info_body: errorMessage, show_info: true })
    }

    validate_custom_fields = (custom_fields: Array<customfield>) => {
        if(custom_fields.length){
            const result = custom_fields.reduce((store: Istore, {key}) => {
                if(!(/^[\w]+$/.test(key))){
                    store.invalidKeys.push(key)
                }
                store.keys.push(key)
                return store
            }, {
                keys: [],
                invalidKeys:[]
            })
            if(result.invalidKeys.length){
                this.setError("You must enter a valid key for all custom fields")
                return false
            }
            const uniqueKeys = new Set(result.keys)
            if(uniqueKeys.size !== result.keys.length){
                this.setError("You must ensure all custom fields have unique keys")
                return false
            }
        }
        return true
    }

    validate() {
        if (this.state.user.address == "" || this.state.user.address == null) {
            this.setState({ info_title: "Data Error", info_body: "You must create a new address", show_info: true })
            return;
        }

        if (this.state.valid_username == false) {
            this.setState({ info_title: "Data Error", info_body: "The username you selected is allready in use", show_info: true })
            return;
        }

        if (this.state.user.username == "") {
            this.setState({ info_title: "Data Error", info_body: "You must enter a username!", show_info: true })
            return;
        }

        const {custom_fields} = this.state.user;
        if(!this.validate_custom_fields(custom_fields)){return };

        this.setState({ show_confirmation: true })
    }
    add_custom() {
        var temp: User = this.state.user
        var custom: customfield = {
            key: "",
            value: "",
            index: 0,
        };
        custom.index = this.state.user.custom_fields.length

        temp.custom_fields.push(custom)

        this.setState({ user: temp });
    }
    remove_custom(index: number) {
        var temp: User = this.state.user
        var custom: customfield[] = temp.custom_fields;

        for (var _i = 0; _i < temp.custom_fields.length; _i++) {
            if (temp.custom_fields[_i].index = index) {
                custom.splice(_i, 1);
                break;
            }
        }

        temp.custom_fields = custom

        this.setState({ user: temp });
    }
    update_custom_key(index: number, value: string) {
        var temp: User = this.state.user
        var custom: customfield = temp.custom_fields[index];
        custom.key = value
        temp.custom_fields[index] = custom

        this.setState({ user: temp });
    }

    update_custom_value(index: number, value: string) {
        var temp: User = this.state.user
        var custom: customfield = temp.custom_fields[index];
        custom.value = value
        temp.custom_fields[index] = custom

        this.setState({ user: temp });
    }

    send(res: result) {
        this.setState({ hex_data: res.hex, fee: res.cost, show_confirmation: false, show_result: true })
    }

    fail() {
        this.setState({ hex_data: "", fee: 0, show_confirmation: false, show_result: false })
    }

    sucess() {
        this.setState({ user: { ...this.state.user, registration_pending: true } }, () => {
            Settings.set_current_identity(this.state.user)
            this.props.close_callback()
        });
    }

    select_content() {
        if (this.state.show_confirmation) {
            return <CreateUserPopupConfirmation user={this.state.user} cancel_callback={() => this.setState({ show_confirmation: false })} continue_callback={this.send.bind(this)} language={this.props.language} />
        }
        if (this.state.show_result) {
            console.log(this.state)
            console.log("try show send ")
            return <SmartTxSendResultComponent encoded_hex={this.state.hex_data} fee={this.state.fee} identity={this.state.user.address} language={this.props.language} sucess_close_callback={this.sucess.bind(this)} fail_close_callback={this.fail.bind(this)} />
        }
        if (this.state.show_info) {
            return <InfoPopup title={this.state.info_title} info={this.state.info_body} show_popup={this.state.show_info} close_callback={() => this.setState({ show_info: false })} language={this.props.language} />
        }

        return (<Modal backdrop={"static"} show={true} onHide={this.props.close_callback}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Identity</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Username*:</span>
                    <input type="text" className="form-control" placeholder="Username" aria-describedby="basic-addon1" required={true} name="username" value={this.state.user.username} onChange={e => this.username_change(e.target.value)} ></input>

                </div>
                {this.state.valid_username ? "" : <span className="label label-danger">Username allready in use!</span>}
                <p />

                <p />
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Description:</span>
                    <input type="text" className="form-control" placeholder="Description" aria-describedby="basic-addon1" name="description" value={this.state.user.description} onChange={e => { this.setState({ user: { ...this.state.user, description: e.target.value } }) }} ></input>
                </div>
                <p />
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Street Address:</span>
                    <input type="text" className="form-control" placeholder="Street Address" aria-describedby="basic-addon1" name="streetaddress" value={this.state.user.streetaddress} onChange={e => { this.setState({ user: { ...this.state.user, streetaddress: e.target.value } }) }} ></input>
                </div>
                <p />
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Phone:</span>
                    <input type="text" className="form-control" placeholder="Phone" aria-describedby="basic-addon1" name="phone" value={this.state.user.phone} onChange={e => { this.setState({ user: { ...this.state.user, phone: e.target.value } }) }} ></input>
                </div>
                <p />
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Email:</span>
                    <input type="text" className="form-control" placeholder="Email" aria-describedby="basic-addon1" name="email" value={this.state.user.email} onChange={e => { this.setState({ user: { ...this.state.user, email: e.target.value } }) }} ></input>
                </div>
                <p />
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Website:</span>
                    <input type="text" className="form-control" placeholder="Website" aria-describedby="basic-addon1" name="website" value={this.state.user.website} onChange={e => { this.setState({ user: { ...this.state.user, website: e.target.value } }) }} ></input>
                </div>
                <p />

                * Required
            <p />
                {this.state.user.custom_fields.map(custom =>
                    <span>
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">
                                <input type="text" className="custom_input " placeholder="Custom Key" name="website" value={custom.key} onChange={e => { this.update_custom_key(custom.index, e.target.value) }} ></input>
                            </span>
                            <input type="text" className="form-control" placeholder="Custom Value" aria-describedby="basic-addon1" name="website" value={custom.value} onChange={e => { this.update_custom_value(custom.index, e.target.value) }} ></input>
                            <span className="input-group-addon nopad " id="basic-addon1">
                                <button type="button" className="btn btn-default btn-success nopad noborder" onClick={e => { this.remove_custom(custom.index) }}>X</button>
                            </span>
                        </div>
                        <p />
                    </span>

                )}
                <button type="button" className="btn btn-default btn-success" onClick={this.add_custom.bind(this)}>Add Custom Field</button>
                <p />
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

interface custom {
    index: number,
    key: string,
    value: string
}

interface Istore {
    keys: Array<string>,
    invalidKeys: Array<string>
}
