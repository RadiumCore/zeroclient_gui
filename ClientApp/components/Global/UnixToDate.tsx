import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../Language/Language'

interface UnixToDateState {
}
export interface Props {
    unix: number
}

export class UnixToDate extends React.Component<Props, UnixToDateState> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        const d: Date = new Date(0);
        d.setUTCSeconds(this.props.unix)
        return <span>{d.toLocaleDateString()} {d.toLocaleTimeString()}</span>
    }
}