import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { UserTable } from './UserTable';
import t from "../../Language/Language";
import { CreateUserPopup } from './CreateUserPopup'
import { SmartChainSyncing } from '../Loading/SmartChainSyncing'
import { InfoPopup } from '../../Global/InfoPopup'
import * as settings from '../../Global/settings'
interface UsersState {
    loading: boolean;
    language: number;

    SmartChain_Synced: boolean;
    mobile: boolean;
}

export class Users extends React.Component<RouteComponentProps<{}> | undefined, UsersState> {
    constructor(props: RouteComponentProps<{}> | undefined) {
        super(props);
        this.state = { loading: false, language: 0, SmartChain_Synced: false, mobile: false };
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this))
        this.resize()
    }

    resize() {
        this.setState({ mobile: window.innerWidth <= 760 })
    }

    synced_callback() {
        this.setState({ SmartChain_Synced: true })
    }

    get_content() {
        return <span>
            <div className="main-page-head">
                <h1>{t[this.state.language].Users}</h1>
            </div>
            <div className="main-page-body">
                <UserTable mobile={this.state.mobile} defaultPageSize={-1} showPagination={true} language={this.state.language} />

            </div>
            <div className="main-page-foot">
                <span><h4>To create a new user, click 'new user' in the login tab</h4></span>
            </div>
        </span>
    }

    public render() {
        let content = this.get_content()
        return content;
    }
}