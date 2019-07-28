import * as React from 'react';
const image = require('../../../../Assets/radium-512-300x300.png');
interface State {   
}

export interface Props {
    callback: any;
}

export class FindingAPI extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { };
        
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
                        <h1>Radium Zero Client</h1>

                    </div>
                    <div className="row">
                        <h3 className="text-center">Finding best server!</h3>
                     </div>

                </div>

                <div className="col-sm-3" />

            </div>
            <div className="loading-page-foot" />

        </div>;
    }
}
