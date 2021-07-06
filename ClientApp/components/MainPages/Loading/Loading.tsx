import * as React from 'react';
import { NavMenu } from '../../NavMenu';
import t from "../../Language/Language";
import { ProgressBar, Jumbotron } from 'react-bootstrap';
import * as api from '../../Global/API'
const image = require('../../../../Assets/ValLogo305x300.png');
interface LoadingState {
    intervaltick: any;
    language: number;

    primary_text: string;
    secondary_text: string;
    loading_bar_text: string;
    loading_bar_pos: number;
    loading_bar_vis: boolean;
    data: setup_data;
    wallet_connected: boolean;
    interval: number;

    setsync: number;

    //control
    setup_complete: boolean;
}

export interface LoadingProps {
    callback: any;
}
export class Loading extends React.Component<LoadingProps, LoadingState> {
    constructor(props: LoadingProps) {
        super(props);
        this.state = {
            intervaltick: [], language: 0, primary_text: " ", secondary_text: " ", loading_bar_text: "", loading_bar_vis: false, loading_bar_pos: 0, data: {
                message: "Awaiting API connection",
                progress: 0,
            },
            wallet_connected: false,
            interval: 2000,
            setsync: 0,

            setup_complete: false,
        };
        this.tick();
    }

    tick() {
        api.GetSetupInfo((value: setup_data) => {
            
            this.setState({ data: value });
        })
        
        if (this.state.data.message == "UTXO Ready") {
            this.props.callback(true);
            clearInterval(this.state.intervaltick);
        }
    }

    set_interval(int: number) {
        this.setState({ interval: int })
    }

    componentDidMount() {
        var inttick = setInterval(() => this.tick(), 500);

        // store intervalId in the state so it can be accessed later:
        this.setState({ intervaltick: inttick });
    }
    componentWillUnmount() {
        clearInterval(this.state.intervaltick);
    }

    public render() {
        return <div className="loading-page" >

            <div className="loading-page-head">
            </div>
            <div className="loading-page-body" >
                <div className="col-sm-3" />
                <div className="col-sm-6">
                    <div className="row text-center">
                        <img src={image} className="img-fluid" />

                    </div>
                    <div className="row text-center">
                        <h1>Validity Web Client</h1>

                    </div>
                    <div className="row">                        
                        <h3 className="text-center">{this.state.data.message + " " + this.state.data.progress + "%"}</h3>
                        <ProgressBar bsStyle="success" now={this.state.data.progress} />
                    </div>

                </div>

                <div className="col-sm-3" />

            </div>
            <div className="loading-page-foot" />

        </div>;
    }
}

interface setup_data {
    message: string;
    progress: number;
}