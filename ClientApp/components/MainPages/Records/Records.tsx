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
            <div className="main-page-body" >
                <RecordTable mobile={this.state.mobile} defaultPageSize={-1} showPagination={true} language={this.state.language} />              
            </div>  
        </span>
    }

    public render() {
        let content = this.get_content()
        return content;
    }
}