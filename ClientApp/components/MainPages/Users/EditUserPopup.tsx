import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { User, customfield, blank_user } from '../_Interfaces/iUser'
import { EditUserPopupConfirmation } from './EditUserPopupConfirmation'
import { InfoPopup } from '../../Global/InfoPopup'
import * as Settings from '../../Global/settings'
import { GetInputPopup } from '../../Global/GetInputPopup'
import { Modal } from 'react-bootstrap'
import * as api from '../../Global/API'
import { SmartTxSendResultComponent } from '../../Global/SmartTxSendResultComponent'

interface Props {
    close_callback: any;
    language: number;
    user: string;
}
interface State {
    //info popup
    info_title: string
    info_body: string
    show_info: boolean

    // stage 1 - gather info
    user: User

    // stage 2 - confirm info
    show_confirmation: boolean
    hex_data: string
    fee: number

    // stage 3 - try send SmartTx
    upload_stataus: string

    show_result: boolean
    edit_profile: boolean
    edit_pic_hash: boolean
    edit_description: boolean
    edit_company: boolean
    edit_street: boolean
    edit_phone: boolean
    edit_email: boolean
    edit_website: boolean

    profile_pic: any
}

export class EditUserPopup extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            info_title: "",
            info_body: "",
            show_info: false,
            //
            user: blank_user,
            //
            show_confirmation: false,
            hex_data: "",
            fee: 0,
            //
            show_result: false,

            upload_stataus: "",

            edit_profile: false,
            edit_pic_hash: false,
            edit_description: false,
            edit_company: false,
            edit_street: false,
            edit_phone: false,
            edit_email: false,
            edit_website: false,

            profile_pic: null,
        };
        api.GetUser(this.props.user, (data: any) => {
            for (var _i = 0; _i < data.custom_fields.length; _i++) {
                data.custom_fields[_i].index = _i
            }
            this.setState({ user: data });
        })
    }
    togle_edit_profile() {
        this.setState({ edit_profile: !this.state.edit_profile })
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
            if (temp.custom_fields[_i].index == index) {
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
    togle_edit_pic_hash() {
        this.setState({ edit_pic_hash: !this.state.edit_pic_hash })
    }

    togle_edit_description() {
        this.setState({ edit_description: !this.state.edit_description })
    }
    togle_edit_edit_company() {
        this.setState({ edit_company: !this.state.edit_company })
    }
    togle_edit_street() {
        this.setState({ edit_street: !this.state.edit_street })
    }
    togle_edit_phone() {
        this.setState({ edit_phone: !this.state.edit_phone })
    }
    togle_edit_email() {
        this.setState({ edit_email: !this.state.edit_email })
    }
    togle_edit_website() {
        this.setState({ edit_website: !this.state.edit_website })
    }

    show_profile_help() {
        var text = "To set your profile picture, please uplad a picture of yourself to IPFS."
        text = text + "We suggest  using https://globalupload.io/.  Once uploaded, enter the hash in the 'Profile Picture Hash' box. "
        text = text + "All IPFS hashes all start with 'Qm' and look similar to this: QmZDQxCAK1yjvf7MkkpFqNphv4tJzPksmnS4BN5LfTw1JS "
        text = text + "Your profile picture will become part of the permanent web, maintained by the ZeroClient server."
        this.setState({ info_title: "Info", info_body: text, show_info: true })
    }

    close() {
        this.props.close_callback(true)
    }

    username_change(name: string) {
        this.setState({ user: { ...this.state.user, username: name } });
    }

    validate() {
        var u: User = this.state.user;
        if (!this.state.edit_pic_hash) {
            u.profile_immage = ""
        }
        if (!this.state.edit_description) {
            u.description = ""
        }
        if (!this.state.edit_company) {
            u.company = ""
        }
        if (!this.state.edit_street) {
            u.streetaddress = ""
        }
        if (!this.state.edit_phone) {
            u.phone = ""
        }
        if (!this.state.edit_email) {
            u.email = ""
        }
        if (!this.state.edit_website) {
            u.website = ""
        }
        this.setState({ show_confirmation: true })
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

    handleFileRead(r: FileReader) {
        this.setState({ profile_pic: r.result })
        this.setState({ upload_stataus: "Upload Complete" })
    }

    handlefilechosen(fi: FileList | null) {
        this.setState({ upload_stataus: "Uploading" })
        let fileReader = new FileReader();
        fileReader.onload = () => { this.handleFileRead(fileReader) };
        fileReader.readAsArrayBuffer(fi![0])
    }

    select_content() {
        if (this.state.show_confirmation) {
            return <EditUserPopupConfirmation user={this.state.user} cancel_callback={() => this.setState({ show_confirmation: false })} continue_callback={this.send.bind(this)} language={this.props.language} />
        }
        if (this.state.show_result) {
            console.log(this.state)
            console.log("try show send ")
            return <SmartTxSendResultComponent encoded_hex={this.state.hex_data} fee={this.state.fee} identity={this.state.user.address} language={this.props.language} sucess_close_callback={this.sucess.bind(this)} fail_close_callback={this.fail.bind(this)} />
        }
        if (this.state.show_info) {
            return <InfoPopup title={this.state.info_title} info={this.state.info_body} show_popup={this.state.show_info} close_callback={() => this.setState({ show_info: false })} language={this.props.language} />
        }
        const prof_url = "https://ipfs.io/ipfs/" + this.state.edit_pic_hash ? this.state.user.profile_immage : this.state.user.profile_immage
        return (<Modal backdrop={"static"} show={true} onHide={this.props.close_callback}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Existing Identity</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-4">
                        <img src={"https://ipfs.io/ipfs/" + prof_url} className="img-responsive img-thumbnail" />
                    </div>
                    <div className="col-md-8 text-center">
                        <button type="button" className="btn btn-default btn-danger " onClick={this.show_profile_help.bind(this)}>How to set Profile Picture</button>
                        {this.state.edit_profile ? <input type="file" className="custom-file-input" id="customFile" onChange={evt => this.handlefilechosen(evt.target.files)} /> : null}
                        {this.state.edit_profile ? <span>{this.state.upload_stataus}</span> : null}

                    </div>
                </div>

                <dl className="dl-horizontal">
                    <dt className="left">{t[this.props.language].Username + "*"}  :</dt> <dd>   {this.state.user.username} </dd>
                    <dt className="left">{t[this.props.language].Address + "*"}  :</dt> <dd>   {this.state.user.address} </dd>
                </dl>

                <p />
                Click headder to edit
                <div className="input-group" >
                    <span className="input-group-addon" id="basic-addon1" onClick={this.togle_edit_pic_hash.bind(this)} >Profile Picture Hash: {this.state.edit_pic_hash ? <span>(editing)</span> : null}</span>
                    <input type="text" className="form-control" disabled={!this.state.edit_pic_hash} aria-describedby="basic-addon1" name="pic_hash" value={this.state.edit_pic_hash ? this.state.user.profile_immage : this.state.user.profile_immage != null ? this.state.user.profile_immage : ""} onChange={e => { this.setState({ user: { ...this.state.user, profile_immage: e.target.value } }) }} ></input>
                </div>
                <p />

                <div className="input-group" >
                    <span className="input-group-addon" id="basic-addon1" onClick={this.togle_edit_description.bind(this)} >Description: {this.state.edit_description ? <span>(editing)</span> : null}</span>
                    <input type="text" className="form-control" disabled={!this.state.edit_description} aria-describedby="basic-addon1" name="description" value={this.state.edit_description ? this.state.user.description : this.state.user.description != null ? this.state.user.description : ""} onChange={e => { this.setState({ user: { ...this.state.user, description: e.target.value } }) }} ></input>
                </div>
                <p />
                <div className="input-group" >
                    <span className="input-group-addon" id="basic-addon1" onClick={this.togle_edit_edit_company.bind(this)} >Company: {this.state.edit_company ? <span>(editing)</span> : null}</span>
                    <input type="text" className="form-control" disabled={!this.state.edit_company} aria-describedby="basic-addon1" name="company" value={this.state.edit_company ? this.state.user.company : this.state.user.company != null ? this.state.user.company : ""} onChange={e => { this.setState({ user: { ...this.state.user, company: e.target.value } }) }} ></input>
                </div>
                <p />
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1" onClick={this.togle_edit_street.bind(this)} >Street Address:{this.state.edit_street ? <span>(editing)</span> : null}</span>
                    <input type="text" className="form-control" disabled={!this.state.edit_street} aria-describedby="basic-addon1" name="streetaddress" value={this.state.edit_street ? this.state.user.streetaddress : this.state.user.streetaddress != null ? this.state.user.streetaddress : ""} onChange={e => { this.setState({ user: { ...this.state.user, streetaddress: e.target.value } }) }} ></input>
                </div>
                <p />
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1" onClick={this.togle_edit_phone.bind(this)} >Phone:{this.state.edit_phone ? <span>(editing)</span> : null}</span>
                    <input type="text" className="form-control" disabled={!this.state.edit_phone} aria-describedby="basic-addon1" name="phone" value={this.state.edit_phone ? this.state.user.phone : this.state.user.phone != null ? this.state.user.phone : ""} onChange={e => { this.setState({ user: { ...this.state.user, phone: e.target.value } }) }} ></input>
                </div>
                <p />
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1" onClick={this.togle_edit_email.bind(this)} >Email:{this.state.edit_email ? <span>(editing)</span> : null}</span>
                    <input type="text" className="form-control" disabled={!this.state.edit_email} aria-describedby="basic-addon1" name="email" value={this.state.edit_email ? this.state.user.email : this.state.user.email != null ? this.state.user.email : ""} onChange={e => { this.setState({ user: { ...this.state.user, email: e.target.value } }) }} ></input>
                </div>
                <p />
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1" onClick={this.togle_edit_website.bind(this)} >Website:{this.state.edit_website ? <span>(editing)</span> : null}</span>
                    <input type="text" className="form-control" disabled={!this.state.edit_website} aria-describedby="basic-addon1" name="website" value={this.state.edit_website ? this.state.user.website : this.state.user.website != null ? this.state.user.website : ""} onChange={e => { this.setState({ user: { ...this.state.user, website: e.target.value } }) }} ></input>
                </div>

                <p />

                * Required

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