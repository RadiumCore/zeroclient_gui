import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ElectionTable } from './ElectionsTable';
import t from "../../Language/Language";
import { SmartChainSyncing } from '../Loading/SmartChainSyncing'

import { CreateElectionPopup } from './CreateElectionPopup'
interface UsersState {
    loading: boolean;
    language: number;
    ShowSignFile: boolean;
    show_create: boolean;
    SmartChain_Synced: boolean;
    mobile: boolean;
}

export class Elections extends React.Component<RouteComponentProps<{}> | undefined, UsersState> {
    constructor(props: RouteComponentProps<{}> | undefined) {
        super(props);
        this.state = { loading: false, language: 0, ShowSignFile: false, show_create: false, SmartChain_Synced: false, mobile: false };
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this))
        this.resize()
    }

    resize() {
        this.setState({ mobile: window.innerWidth <= 760 })
    }
    ShowCreateElection() {
        this.setState({ show_create: true })
    }
    CloseCreateElection() {
        this.setState({ show_create: false })
    }

    synced_callback() {
        this.setState({ SmartChain_Synced: true })
    }

    get_content() {
        return <span>
            <div className="main-page-head">
                <h1>Elections</h1>
            </div>
            <div className="main-page-body" >
                <ElectionTable mobile={this.state.mobile} defaultPageSize={-1} showPagination={true} language={this.state.language} />

                <button type="button" className="btn btn-default " onClick={this.ShowCreateElection.bind(this)}>Create An Election</button>
            </div>
            {this.state.show_create ?
                <CreateElectionPopup close_callback={this.CloseCreateElection.bind(this)} language={this.state.language} />
                : null
            }
            <div className="main-page-foot" />
        </span>
    }

    public render() {
        let content = this.get_content()
        return content;
    }
}