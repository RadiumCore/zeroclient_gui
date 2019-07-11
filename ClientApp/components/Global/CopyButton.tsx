import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../Language/Language'

interface CopyButtonState {
    val: string
}
export interface Props {
    val: string
}

export class CopyButton extends React.Component<Props, CopyButtonState> {
    constructor(props: Props) {
        super(props);
        this.state = { val: this.props.val };
        this.CopyVal = this.CopyVal.bind(this)
    }

    CopyVal() {
        var textField = document.createElement('textarea')
        textField.innerText = this.props.val
        this.setState({ val: this.props.val }, (() => this.finish_copy(textField)));
        //split into two methods as delay was requred to make it work
        //setstate is only to create minimal delay
    }
    finish_copy(textField: HTMLTextAreaElement) {
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
    }

    public render() {
        return <button onClick={this.CopyVal.bind(this)} className='glyphicon glyphicon-duplicate' data-toggle="tooltip" data-placement="top" title={'click to copy'}></button>
    }
}