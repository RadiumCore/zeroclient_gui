import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { InfoPopup } from './Global/InfoPopup'
import * as settings from './Global/settings'
const image = require('../../Assets/Validity-256.png');
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
        return    <div className='navbar navbar-inverse'>
            <div className='navbar-header'></div>
            <div className='clearfix'></div>
            <div className='navbar-collapse collapse'>
                <ul className='nav navbar-nav navbar-justify'>

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
                        <NavLink to={'/messages'} className='link' data-toggle={this.state.mobile ? 'collapse' : null} data-target='.navbar-collapse' activeClassName='active'>
                            <span className='glyphicon glyphicon-stats'></span> Signed Messages
                            </NavLink>
                    </li>
                    {false ? <li>
                        <NavLink to={'/tools'} className='link' activeClassName='active'   >
                            <span className='glyphicon glyphicon-wrench'></span> Tools
                            </NavLink>
                    </li> : null}



                </ul>
            </div>

        </div>;

      
    }
}