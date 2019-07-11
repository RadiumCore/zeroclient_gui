import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import * as crypto from "crypto-js";
import { sha256 } from 'js-sha256';
import { User } from '../_Interfaces/iUser'

interface Props {
    complete_callback: any;
    language: number;
}
interface SetTitleComponentState {
    title: string;
}

export class SetTitleComponent extends React.Component<Props, SetTitleComponentState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            title: ""
        };
    }

    complete(hash: string) {
        this.props.complete_callback(hash)
    }

    render() {
        return (
            <div >

            </div>
        );
    }
}