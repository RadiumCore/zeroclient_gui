import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import t from '../../Language/Language'
import { User, blank_user } from '../_Interfaces/iUser'
import * as settings from '../../Global/settings'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import { UnixToDate } from '../../Global/UnixToDate'
import { PersonalFileTable } from './PersonalFileTable'
import { CreateUserPopup } from '../Users/CreateUserPopup'
import { EditUserPopup } from '../Users/EditUserPopup'
import { Jumbotron } from 'react-bootstrap';
import * as statics from '../../Global/statics'

import * as api from '../../Global/API'
import * as iSigning from '../_Interfaces/iSigning'
interface State {
    user: User;
    load_complete: boolean;
    language: number;
    ShowCreateIdentity: boolean;
    show_edit: boolean;
    mobile: boolean;
    rads_balance: number;

    _my_account: my_account;
}

export class MyProfile extends React.Component<RouteComponentProps<{}> | undefined, State> {
    constructor(props: RouteComponentProps<{}> | undefined) {
        super(props);
        this.state = {
            user: blank_user,
            load_complete: false,
            language: 0,
            ShowCreateIdentity: false,
            show_edit: false,
            mobile: false,
            rads_balance: 0,
            _my_account: {
                coins: 0,
                credits: 0,
                pubkey: "",
                RowKey: "",
            }
        };

        this.tick()
    }
    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this))
        this.resize()
    }

    resize() {
        this.setState({ mobile: window.innerWidth <= 760 })
    }
    tick() {
        api.GetUser(settings.current_identity.address, (data: any) => { this.setState({ user: data, load_complete: true }); })

        api.GetAddressUtxos(settings.current_identity.address, (data: any) => {
            var value: number = 0;
            data.forEach(
                function (element: utxo) {
                    value += element.value
                }
            )
            this.setState({ rads_balance: value });
        })

        this.get_my_info();
    }

    get_my_info() {
        const body = JSON.stringify({
            method: "getmyinfo",
            block: settings.top_block.hash,
            pubkey: settings.current_identity.pub_key,
            sig: iSigning.sign_message(settings.top_block.hash + "getmyinfo")
        })

        api.GetMyInfo(body, (data: any) => { this.setState({ _my_account: data }); })
    }

    show_edit() {
        this.setState({ show_edit: true })
    }

    close_edit() {
        this.setState({ show_edit: false })
    }

    Should_show(st: string): boolean {
        if (typeof (st) == 'string' && st.length > 0)
            return true;

        return false
    }
    ShowCreateIdentity() {
        this.setState({ ShowCreateIdentity: true })
    }
    CloseCreateUser() {
        this.setState({ ShowCreateIdentity: false })
    }

    get_content() {
        if (settings.current_identity.address == "") { return <Redirect to='/users' /> }

        if (settings.current_identity.username == "") { return this.render_new() }
        if (this.state.user.txid == null && settings.current_identity.registration_pending) { return this.render_pending() }
        return this.render_main()
    }

    render_new() {
        return <span>

            <div className="main-page-head">
                <h2>Welcome to your Dashboard</h2>
            </div>

            <div className="main-page-body">
                <h2> Welcome New User! </h2>
                <h4> Please complete the new user account creation using the button below </h4>

                <button type="button" className="btn btn-default " onClick={() => { this.ShowCreateIdentity() }}>Complete Account Creation</button>
                {this.state.ShowCreateIdentity ?
                    <CreateUserPopup address={settings.current_identity.address} close_callback={this.CloseCreateUser.bind(this)} language={this.state.language} />
                    : null
                }
            </div>

            <div className="main-page-foot" />

        </span>
    }

    render_pending() {
        return <span>

            <div className="main-page-head">
                <h2>Welcome to your Dashboard</h2>
            </div>

            <div className="main-page-body">
                <h2> Welcome {this.state.user.username} </h2>
                <h4> Please wait, your account creation is pending! </h4>
            </div>

            <div className="main-page-foot" />

        </span>
    }

    public render() {
        let content = this.get_content()
        return (content)
    }

    public paypal() {
        return <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="73NV4Y372NQY4" />
            <table>
                <tr><td><input type="hidden" name="on0" value="Quantity" />Quantity</td></tr><tr><td><select name="os0">
                    <option value="One (1) Credit">One (1) Credit $0.75 USD</option>
                    <option value="Five (5) Credits">Five (5) Credits $3.00 USD</option>
                    <option value="Twenty (20) Credits">Twenty (20) Credits $10.00 USD</option>
                </select> </td></tr>
            </table>
            <input type="hidden" name="currency_code" value="USD" />
            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif" name="submit" alt="PayPal - The safer, easier way to pay online!" />
            <img alt="" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
        </form>
    }

    public render_main() {
        // {
        //    this.state.ShowCreateIdentity ?
        //     <CreateUserPopup close_callback={this.CloseCreateUser.bind(this)} language={this.state.language} />
        //     : null
        //  }
        const prof_url = "https://ipfs.io/ipfs/" + this.state.user.profile_immage
        return <span>

            <div className="main-page-head">
                <h2>Welcome to your Dashboard</h2>
            </div>

            <div className="main-page-body">
                <div className="col-sm-4">
                    {this.state.load_complete ? <span>
                        <div className="row">
                            <div className="col-md-4">
                                {this.state.user.profile_immage != null ? <img src={prof_url} className="img-responsive img-thumbnail" /> : null}
                            </div>
                            <div className="col-md-8">
                                <h3> {this.state.user.username}</h3>
                            </div>
                        </div>

                        <h5><dl className="dl-horizontal">

                            <dt>{t[this.state.language].Address} :</dt><dd>{this.state.user.address}</dd>
                            {this.Should_show(this.state.user.description) ? <span><dt>{t[this.state.language].Description} :</dt> <dd>{this.state.user.description}</dd></span> : null}
                            {this.Should_show(this.state.user.company) ? <span><dt>{t[this.state.language].Company} :</dt> <dd>{this.state.user.company}</dd></span> : null}
                            {this.Should_show(this.state.user.streetaddress) ? <span><dt>{t[this.state.language].StreetAddress} :</dt> <dd>{this.state.user.streetaddress}</dd></span> : null}
                            {this.Should_show(this.state.user.phone) ? <span><dt>{t[this.state.language].Phone} :</dt> <dd>{this.state.user.phone}</dd></span> : null}
                            {this.Should_show(this.state.user.email) ? <span><dt>{t[this.state.language].Email} :</dt> <dd>{this.state.user.email}</dd></span> : null}
                            {this.Should_show(this.state.user.website) ? <span><dt>{t[this.state.language].Website} :</dt> <dd>{this.state.user.website}</dd></span> : null}
                            <dt>{t[this.state.language].Join_Date} :</dt> <dd><UnixToDate unix={this.state.user.unixtime} /></dd>

                        </dl></h5>

                        <button type="button" className="btn btn-default " onClick={this.show_edit.bind(this)}>Edit Profile</button>
                        <p>Avalible Credits: {this.state._my_account.credits}</p>
                        <p>Avalible Rads: {this.state.rads_balance}</p>
                        {this.paypal()}
                    </span>

                        : 'loading'
                    }

                </div>
                <div className="col-sm-1"> <dt></dt><dd></dd></div>
                <div className="col-sm-7 outside-table-div">
                    <PersonalFileTable mobile={this.state.mobile} defaultPageSize={-1} showPagination={true} language={this.state.language} />
                </div>
            </div>

            <div className="main-page-foot" />

            {this.state.show_edit ? <EditUserPopup user={this.state.user.address} close_callback={this.close_edit.bind(this)} language={this.state.language} /> : null}

        </span>;
    }
}

interface utxo_array {
    result: utxo[],
}

interface utxo {
    txid: string,
    index: number,
    value: number,
}

interface my_account {
    RowKey: string,
    pubkey: string,
    credits: number,
    coins: number,
}