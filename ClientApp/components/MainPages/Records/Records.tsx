import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { RecordTable } from './RecordTable';
import t from "../../Language/Language";
import { SignFilePopup } from './SignFilePopup'
import { VerifyFilePopup } from './VerifyFIlePopup'
import { SmartChainSyncing } from '../Loading/SmartChainSyncing'
interface UsersState {
    loading: boolean;
    language: number;
    ShowSignFile: boolean;
    ShowVerifyFile: boolean;
    SmartChain_Synced: boolean
    mobile: boolean;
}

export class Records extends React.Component<RouteComponentProps<{}> | undefined, UsersState> {
    constructor(props: RouteComponentProps<{}> | undefined) {
        super(props);
        this.state = { loading: false, language: 0, ShowSignFile: false, ShowVerifyFile: false, SmartChain_Synced: false, mobile: false };
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this))
        this.resize()
    }

    resize() {
        this.setState({ mobile: window.innerWidth <= 760 })
    }

    ShowSignFile() {
        this.setState({ ShowSignFile: true })
    }
    ShowVerifyFile() {
        this.setState({ ShowVerifyFile: true })
    }
    CloseSignFile() {
        this.setState({ ShowSignFile: false })
    }
    CloseVerifyFile() {
        this.setState({ ShowVerifyFile: false })
    }

    synced_callback() {
        this.setState({ SmartChain_Synced: true })
    }

    get_content() {
        return <span>
            <div className="main-page-head">
                <h1>Signed Files</h1>
            </div>
            <div className="main-page-body" >
                <RecordTable mobile={this.state.mobile} defaultPageSize={-1} showPagination={true} language={this.state.language} />

                <button type="button" className="btn btn-default" onClick={() => { this.ShowSignFile() }}>Sign a File</button>
                <button type="button" className="btn btn-default" onClick={() => { this.ShowVerifyFile() }}>Verify a File</button>
            </div>
            {this.state.ShowSignFile ?
                <SignFilePopup close_callback={this.CloseSignFile.bind(this)} language={this.state.language} />
                : null
            }
            {this.state.ShowVerifyFile ?
                <VerifyFilePopup close_callback={this.CloseVerifyFile.bind(this)} language={this.state.language} />
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