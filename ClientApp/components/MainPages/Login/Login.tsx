import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import t from '../../Language/Language';
import * as statics from '../../Global/statics'
import * as settings from '../../Global/settings'
import { Jumbotron } from 'react-bootstrap';
import { ECPair, payments, networks } from 'radiumjs-lib'
import { CreateKeyPopup } from './CreateKeyPopup'
import { InfoPopup } from '../../Global/InfoPopup'
import { User } from '../_Interfaces/iUser'
import * as api from '../../Global/API'
//import * as radium from 'radium-lib'
interface SendState {
    show_make: boolean,
    language: number,
    key: string,

    show_info: boolean
    info_title: string;
    info_body: string;

    login_complete: boolean
}
interface Props {
}

export class Login extends React.Component<RouteComponentProps<{}> | undefined, SendState> {
    constructor(props: RouteComponentProps<{}> | undefined) {
        super(props);

        this.state = {
            show_make: false,
            language: 0,
            key: "",
            show_info: false,
            info_title: "",
            info_body: "",
            login_complete: false,
        };
    }

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value } as any);
    }

    make_key() {
        const keyPair = ECPair.makeRandom({ network: networks.radium })
        const address = payments.p2pkh({ pubkey: keyPair.publicKey })

        return keyPair.toWIF()
    }

    show_make_key() {
        this.setState({ show_make: true })
    }

    hide_make_key() {
        this.setState({ show_make: false })
    }

    login() {
        try {
            settings.set_priv_key(this.state.key)
            const { address } = payments.p2pkh({ pubkey: settings.private_keypair.publicKey, network: networks.radium })

            api.GetUser(address as string, (data: any) => {
                if (data.address == null) {
                    settings.clear_current_identity()
                    settings.current_identity.address = address as string
                }
                else {
                    settings.set_current_identity(data)
                    settings.set_priv_key(this.state.key)
                }

                this.setState({ key: "" });

                if (data.address == null) { this.show_incomplete_user() } else { this.show_welcome_user(data.username) }
                this.setState({ login_complete: true })
            })
        }
        catch (ex) {
            this.setState({ show_info: true, info_title: "Error ", info_body: "Invalid Radium Key" })
        }
    }

    show_welcome_user(username: string) {
        this.setState({ show_info: true, info_title: "Welcome back, " + username })
    }
    show_incomplete_user() {
        this.setState({ show_info: true, info_title: "Welcome Unknown User ", info_body: "Please complete the user registration under the My Profile tab" })
    }

    close_info() {
        this.setState({ show_info: false })
    }
    get_content() {
        if (this.state.login_complete) { return <Redirect to='/myprofile' /> }
        if (this.state.show_info) {
            return <InfoPopup title={this.state.info_title} info={this.state.info_body} language={this.state.language} show_popup={true} close_callback={this.close_info.bind(this)} />
        }

        return this.render_main()
    }

    public render() {
        let content = this.get_content()
        return (content)
    }

    public render_main() {
        return <span>
            <div className="main-page-head">
            </div>
            <div className="main-page-body" >
                <div className="col-sm-3" />
                <div className="col-sm-4">

                    <h2> Use Existing Account</h2>
                    <h4> Please enter the key associated with the account you wish to use.</h4>
                    <div className="input-group pad-left-5 ">
                        <span className="input-group-addon " id="basic-addon1">Key*:</span>
                        <input type="password" className="form-control" placeholder="Username" aria-describedby="basic-addon1" required={true} name="key" value={this.state.key} onChange={e => this.setState({ key: e.target.value })}></input>
                    </div>
                    <button type="button" className="btn btn-default btn-default" onClick={this.login.bind(this)}>Login</button>

                    <h2> Create New Account</h2>
                    <h4> To create a new account, generate a new key and then use it to log in. After you log in, you will be prompted to complete your registration.</h4>
                    <button type="button" className="btn btn-default" onClick={this.show_make_key.bind(this)}>Generate New Key</button>
                    <h2 />

                </div>

                <div className="col-sm-3" />
                {this.state.show_make ? <CreateKeyPopup language={this.state.language} close_callback={this.hide_make_key.bind(this)} /> : null}

            </div>
            <div className="main-page-foot" />

        </span>
    }
}