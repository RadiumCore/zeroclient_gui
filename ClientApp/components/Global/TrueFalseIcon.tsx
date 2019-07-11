import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../Language/Language'

interface TrueFalseIconState {
}
export interface Props {
    state: boolean
}

export class TrueFalseIcon extends React.Component<Props, TrueFalseIconState> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        return this.props.state ?
            <span className="glyphicon glyphicon-ok text-success"></span> :
            <span className="glyphicon glyphicon glyphicon-ban-circle text-danger"></span>
    }
}