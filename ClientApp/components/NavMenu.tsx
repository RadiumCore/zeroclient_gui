import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { InfoPopup } from './Global/InfoPopup'
import * as settings from './Global/settings'
const image = require('../../Assets/Validity-256.png');
const icon48 = require('../../Assets/radium-48.png');
interface NavMenuState {
    user: string;
    webonly: boolean
    mobile: boolean
}

interface Props {
}

export class NavMenu extends React.Component<Props, NavMenuState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            user: "",
            webonly: true,
            mobile: false,
        };

        this.setState({ user: settings.current_identity.username })
    }

    componentWillUnmount() {
        settings.clear_current_identity();
    }
    componentDidMount() {
        this.resize();
        window.addEventListener("resize", this.resize.bind(this))
    }
    resize() {
        this.setState({ mobile: window.innerWidth <= 760 })
    }

    log_out() {
        settings.clear_current_identity();
        this.setState({ user: this.state.user });
    }

    get_button_text() {
        if (settings.current_identity.address == "") {
            return "Login Required"
        }
        if (settings.current_identity.address != "") {
            if (settings.current_identity.username == "") {
                return "Unregisterd User"
            }
        }
        return settings.current_identity.username
    }

    public render() {
        return <div className='main-nav'>
            <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <div className="row">

                        <div className="col-xs-10">
                            {this.state.mobile ?
                                <div className="text-left" >
                                    <NavLink to={'/'} className='link' >
                                        <img src={icon48} className="img-fluid inherit-size" /><span className="label text-14 align-bottom">Radium SmartChain</span>
                                    </NavLink>
                                </div>
                                : null}
                        </div>

                        <div className="col-xs-2 ">
                            <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                                <span className='sr-only'>Toggle navigation</span>
                                <span className='icon-bar'></span>
                                <span className='icon-bar'></span>
                                <span className='icon-bar'></span>
                            </button>
                        </div>
                    </div>

                    {this.state.mobile ? null :
                        <NavLink to={'/'} className='link' >
                            <img src={image} className="img-fluid inherit-height pad-15" />
                        </NavLink>
                    }

                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        {settings.current_identity.address != "" ?
                            <li>
                                <NavLink to={'/myprofile'} className='link' activeClassName='active'>
                                    <span className='glyphicon glyphicon-send'></span> My Profile
                            </NavLink>
                            </li>
                            : null}

                        {this.state.webonly ? null : <li>
                            <NavLink to={'/dashboard'} className='link' activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Dashboard
                            </NavLink>
                        </li>}

                        {this.state.webonly ? null : <li>
                            <NavLink to={'/send'} className='link' activeClassName='active'>
                                <span className='glyphicon glyphicon-send'></span> Send
                            </NavLink>
                        </li>}

                        {this.state.webonly ? null : <li>
                            <NavLink to={'/Receive'} className='link' activeClassName='active'>
                                <span className='glyphicon glyphicon-save'></span> Receive
                            </NavLink>
                        </li>}

                        {this.state.webonly ? null : <li>
                            <NavLink to={'/transactions'} className='link' activeClassName='active'>
                                <span className='glyphicon glyphicon-transfer'></span> Transactions
                            </NavLink>
                        </li>}

                        <li>
                            <NavLink to={'/users'} className='link' data-toggle={this.state.mobile ? 'collapse' : null} data-target='.navbar-collapse' activeClassName='active'>
                                <span className='glyphicon glyphicon-user'></span> Users
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/records'} className='link' data-toggle={this.state.mobile ? 'collapse' : null} data-target='.navbar-collapse' activeClassName='active'>
                                <span className='glyphicon glyphicon-file'></span> Records
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/Elections'} className='link' data-toggle={this.state.mobile ? 'collapse' : null} data-target='.navbar-collapse' activeClassName='active'>
                                <span className='glyphicon glyphicon-check'></span> Elections
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/NFTs'} className='link' data-toggle={this.state.mobile ? 'collapse' : null} data-target='.navbar-collapse' activeClassName='active'>
                                <span className='glyphicon glyphicon-tag'></span> NFTs
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/NFTgroups'} className='link' data-toggle={this.state.mobile ? 'collapse' : null} data-target='.navbar-collapse' activeClassName='active'>
                                <span className='glyphicon glyphicon-list-alt'></span> NFT Groups
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/Stats'} className='link' data-toggle={this.state.mobile ? 'collapse' : null} data-target='.navbar-collapse' activeClassName='active'>
                                <span className='glyphicon glyphicon-stats'></span> Stats
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/messages'} className='link' data-toggle={this.state.mobile ? 'collapse' : null} data-target='.navbar-collapse' activeClassName='active'>
                                <span className='glyphicon glyphicon-stats'></span> Signed Messages
                            </NavLink>
                        </li>
                        {false ? <li>
                            <NavLink to={'/tools'} className='link' activeClassName='active'   >
                                <span className='glyphicon glyphicon-wrench'></span> Tools
                            </NavLink>
                        </li> : null}

                        {settings.current_identity.address == "" ?
                            <li>
                                <NavLink to={'/login'} className='link' data-toggle={this.state.mobile ? 'collapse' : null} data-target='.navbar-collapse' activeClassName='active' >
                                    <span className='glyphicon glyphicon-log-in'></span> Login
                            </NavLink>
                            </li>
                            :
                            <li>
                                <NavLink to={'/logout'} className='link' data-toggle={this.state.mobile ? 'collapse' : null} data-target='.navbar-collapse' activeClassName='active' onClick={this.log_out.bind(this)} >
                                    <span className='glyphicon glyphicon-log-out'></span> Log Out
                            </NavLink>
                            </li>
                        }

                    </ul>
                </div>
                {this.state.mobile ?
                    null
                    :
                    <div className="text-center">
                        <h4> <span className="label label-default">{this.get_button_text()}</span></h4>
                    </div>
                }
            </div>

        </div>;
    }
}