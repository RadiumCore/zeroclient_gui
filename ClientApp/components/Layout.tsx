import * as React from 'react';

import { NavMenu } from './NavMenu';
import { Loading } from './MainPages/Loading/Loading';

import { SmartChainSyncing } from './MainPages/Loading/SmartChainSyncing';
import * as settings from './Global/settings'
import * as statics from './Global/statics'
import * as api from './Global/API'
import { Block, blank_block } from './MainPages/_Interfaces/iBLock'

export interface LayoutProps {
    children?: React.ReactNode;
}

interface LayoutState {
    loadcomplete: boolean;
    sync_complete: boolean;
    intervaltick: number
}
export class Layout extends React.Component<LayoutProps, LayoutState> {
    constructor(props: LayoutProps) {
        super(props);
        this.state = { loadcomplete: false, sync_complete: false, intervaltick: 30000 }
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
        });
        this.tick()
    }

    tick() {
        api.gettopblock((data: Block) => { settings.set_network_block(data) })
    }

    componentDidMount() {
        var inttick = setInterval(() => this.tick(), 30000);
        // store intervalId in the state so it can be accessed later:
        this.setState({ intervaltick: 30000 });
    }
    componentWillUnmount() {
        clearInterval(this.state.intervaltick);
    }
    re_render() {
        this.forceUpdate();
    }

    LoadCompleteCallback(complete: boolean) {
        this.setState({ loadcomplete: complete })
    }

    SyncCompleteCallback(complete: boolean) {
        this.setState({ sync_complete: complete })
    }

    public render() {
        let content

        if (!this.state.loadcomplete) {
            let content = this.renderloading()
            return <div className='container-fluid' >
                {content}
            </div>;
        }
        if (!this.state.sync_complete) {
            let content = this.rendersmartchain()
            return <div className='container-fluid' >
                {content}
            </div>;
        }

        content = this.rendermain();
        return <div className='container-fluid'>
            {content}
        </div>;
    }

    renderloading() {
        return <Loading callback={this.LoadCompleteCallback.bind(this)} />
    }
    rendersmartchain() {
        return <div >
            <SmartChainSyncing synced_callback={this.SyncCompleteCallback.bind(this)} />
        </div>
    }
    rendermain() {
        return <div className='row'>
            <div className='col-sm-2 '>
                <NavMenu />
            </div>
            <div className='col-sm-10 main-page'>
                {this.props.children}
            </div>
        </div>
    }
}