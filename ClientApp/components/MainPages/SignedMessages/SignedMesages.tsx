import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import t from '../../Language/Language';
import * as settings from '../../Global/settings'
import { InfoPopup } from '../../Global/InfoPopup'
import { Block, blank_block } from '../_Interfaces/iBLock'
import * as iSigning from '../_Interfaces/iSigning'
import { VerifiedMessagePopup } from './VerifiedMessagePopup'
import * as api from '../../Global/API'
//import * as radium from 'radium-lib'
interface SendState {
    show_make: boolean,
    language: number,
    key: string,

    show_info: boolean
    info_title: string;
    info_body: string;
    sign_message_input: string;
    verify_message_input: string;
    message: iSigning.SignedMesage
    login_complete: boolean

    intervaltick: any

    show_verified: boolean;
}
interface Props {
}

export class Messages extends React.Component<RouteComponentProps<{}> | undefined, SendState> {
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

            intervaltick: 10000,
            sign_message_input: "",
            verify_message_input: "",
            message: iSigning.blank_SignedMesage,
            show_verified: false,
        };
    }

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value } as any);
    }

    Sign() {
        const sig2 = iSigning.sign_message(settings.current_identity.address + settings.top_block.hash + this.state.sign_message_input)

        var signed_message = `###BEGIN RADIUM SIGNED MESSAGE###\
\n${this.state.sign_message_input}\
\n###BEGIN RADIUM IDENTITY###\
\n${settings.current_identity.username}\
\n${settings.current_identity.address}\
\n${settings.current_identity.pub_key}\
\n${settings.top_block.hash}\
\n###BEGIN RADIUM SIGNATURE###\
\n${sig2}\
\n###END RADIUM SIGNED MESSAGE###\
`

        this.setState({ info_title: "Signed message", info_body: signed_message, show_info: true })
    }

    Verify1() {
        //  const message_result: SignedMesage = JSON.parse(this.state.verify_message_input)
        var input = this.state.verify_message_input.split("\n");

        var test_message: iSigning.SignedMesage = iSigning.blank_SignedMesage;

        for (var i = 0; i < input.length; i++) {
            if (input[i] == "###BEGIN RADIUM SIGNED MESSAGE###") {
                i++
                test_message.message = input[i];
            }
            if (input[i] == "###BEGIN RADIUM IDENTITY###") {
                i++

                i++
                test_message.address = input[i]
                i++
                test_message.pubkey = input[i]
                i++
                test_message.blockhash = input[i]
            }
            if (input[i] == "###BEGIN RADIUM SIGNATURE###") {
                i++
                test_message.sig = input[i];
            }
        }

        const result = iSigning.verify_message(test_message.address + test_message.blockhash + test_message.message, test_message.pubkey, test_message.sig)

        if (!result) {
            this.setState({ info_title: "Bad Message", info_body: "Message signature does not validate. Invalid message", show_info: true })
            return;
        }

        api.GetBlockByHash(test_message.blockhash, (data: any) => { test_message.time = data.time })

        this.setState({ message: test_message, show_verified: true })
    }

    close_info() {
        this.setState({ show_info: false })
    }
    close_verified() {
        this.setState({ show_verified: false })
    }
    get_content() {
        if (this.state.login_complete) { return <Redirect to='/myprofile' /> }
        if (this.state.show_info) {
            return <InfoPopup title={this.state.info_title} info={this.state.info_body} language={this.state.language} show_popup={true} close_callback={this.close_info.bind(this)} />
        }
        if (this.state.show_verified) {
            return <VerifiedMessagePopup message={this.state.message} language={this.state.language} show_popup={true} close_callback={this.close_verified.bind(this)} />
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

                {settings.current_identity.address != "" ?
                    <div className="col-sm-5">

                        <h2> Create signed message</h2>
                        <textarea rows={10} className="form-control rounded-0" onChange={evt => this.setState({ sign_message_input: evt.target.value })} />
                        <dl className="dl-horizontal">
                            <dt>Using identity</dt><dd>{settings.current_identity.username}</dd>
                            <dt>Using address</dt><dd>{settings.current_identity.address}</dd>
                            <dt>Using blockhash</dt><dd>{settings.top_block.hash}</dd>
                            <dt>Using date </dt><dd>{settings.top_block.hash}</dd>
                        </dl>

                        <button type="button" className="btn btn-default" onClick={this.Sign.bind(this)}>Create Signed Message</button>

                    </div>
                    :
                    null}
                <div className="col-sm-2" />

                <div className="col-sm-5">

                    <h2>Verify signed message</h2>
                    <textarea rows={10} className="form-control rounded-0" onChange={evt => this.setState({ verify_message_input: evt.target.value })} />
                    <button type="button" className="btn btn-default" onClick={this.Verify1.bind(this)}>Verify Message</button>

                </div>

            </div>
            <div className="main-page-foot" />

        </span>
    }
}