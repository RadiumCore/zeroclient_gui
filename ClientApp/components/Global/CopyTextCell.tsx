import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../Language/Language'
import { CopyButton } from './CopyButton'

interface CopyTextState {
}
export interface Props {
    text: string;
    language: number;
}

export class CopyTextCell extends React.Component<Props, CopyTextState> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    get_confirmToolTip() {
        //  if (this.props.tx.confirmations > 9) {
        //     return "Confirmed (" + this.props.tx.confirmations + ") confirmations."
        // } else {
        //     return "Confirming, (" + this.props.tx.confirmations + " of 10) confirmations."
        // }
        return ""
    }
    CopyText() {
        alert(this.props.text)
        var textField = document.createElement('textarea')
        textField.innerText = this.props.text;
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
    }

    public render() {
        return <td><div>
            {this.props.text} {this.props.text.length > 0 && this.props.text != ' ' ? <CopyButton val={this.props.text} /> : null}
        </div></td>
    }
}