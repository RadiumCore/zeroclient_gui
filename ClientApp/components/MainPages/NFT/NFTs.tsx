import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AssetTable } from './NFTTable';
import t from "../../Language/Language";
import { CreateAssetPopup } from './CreateNFTPopup'
import { CreateClassPopup } from '../NFTClasses/CreateClassPopup'
import { SmartChainSyncing } from '../Loading/SmartChainSyncing'
import { InfoPopup } from '../../Global/InfoPopup'
import * as settings from '../../Global/settings'
interface State {
    loading: boolean;
    language: number;

    show_create: boolean;
    show_create_class: boolean;

    SmartChain_Synced: boolean;

    show_info: boolean;
    info_title: string;
    info_body: string;
    mobile: boolean;
}

export class Assets extends React.Component<RouteComponentProps<{}> | undefined, State> {
    constructor(props: RouteComponentProps<{}> | undefined) {
        super(props);
        this.state = {
            loading: false,
            language: 0,
            show_create: false,
            show_create_class: false,
            SmartChain_Synced: false,
            show_info: false,
            info_body: "",
            info_title: "",
            mobile: false,
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this))
        this.resize()
    }

    resize() {
        this.setState({ mobile: window.innerWidth <= 760 })
    }

    ShowCreateAsset() {
        if (settings.current_identity.address == "") {
            this.setState({ show_info: true, info_title: "Not logged in", info_body: "Please login create NFTs!" })
            return;
        }

        this.setState({ show_create: true })
    }

    ShowCreateAssetClass() {
        if (settings.current_identity.address == "") {
            this.setState({ show_info: true, info_title: "Not logged in", info_body: "Please login to create NFTs!" })
            return;
        }

        this.setState({ show_create_class: true })
    }

    CloseCreateAsset() {
        this.setState({ show_create: false })
    }

    CloseCreateAssetClass() {
        this.setState({ show_create_class: false })
    }

    synced_callback() {
        this.setState({ SmartChain_Synced: true })
    }

    get_content() {
        return <span>
            <div className="main-page-head">
                <h1>NFTs</h1>
            </div>
            <div className="main-page-body" >
                <AssetTable mobile={this.state.mobile} defaultPageSize={-1} showPagination={true} language={this.state.language} />

            </div>
            <div className="main-page-foot" >
                <button type="button" className="btn btn-default " onClick={this.ShowCreateAsset.bind(this)}>Create An NFT</button>
                <button type="button" className="btn btn-default " onClick={this.ShowCreateAssetClass.bind(this)}>Create An NFT Class</button>

            </div>

            {this.state.show_create ?
                <CreateAssetPopup close_callback={this.CloseCreateAsset.bind(this)} language={this.state.language} />
                : null
            }
            {this.state.show_create_class ?
                <CreateClassPopup close_callback={this.CloseCreateAssetClass.bind(this)} language={this.state.language} />
                : null
            }
            {this.state.show_info ?
                <InfoPopup title={this.state.info_title} info={this.state.info_body} close_callback={() => { this.setState({ show_info: false }) }} show_popup={true} language={this.state.language} />
                : null
            }
        </span>
    }

    public render() {
        let content = this.get_content()
        return content;
    }
}