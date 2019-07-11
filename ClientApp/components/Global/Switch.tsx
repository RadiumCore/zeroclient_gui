import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../Language/Language'

interface TrueFalseIconState {
}
export interface Props {
    state: boolean
    language: number;
}

export class Switch extends React.Component<Props, TrueFalseIconState> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        return this.props.state ?
            <div className="btn-toolbar" role="group" aria-label="...">
                <button type="button" className="btn btn-default btn-light" >False</button>
                <button type="button" className="btn btn-default btn-success" >True</button>
            </div>
            :
            <div className="btn-toolbar" role="group" aria-label="...">
                <button type="button" className="btn btn-default btn-danger" >False</button>
                <button type="button" className="btn btn-default btn-light" >True</button>
            </div>
    }
}