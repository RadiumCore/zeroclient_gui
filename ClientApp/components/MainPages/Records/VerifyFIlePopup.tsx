import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'

import { HashFileComponent } from './HashFileComponent'
import { VerifyFileResult } from './VerifyFileResult'

import { Modal } from 'react-bootstrap'

import * as settings from '../../Global/settings'
interface Props {
    close_callback: any;
    language: number;
}
interface state {
    show_result: boolean;
    file_hash: string;
}

export class VerifyFilePopup extends React.Component<Props, state>{
    constructor(props: Props) {
        super(props);
        this.state = {
            show_result: false,
            file_hash: "",
        };
    }

    got_hash(hash: string) {
        this.setState({ file_hash: hash, show_result: true })
    }

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value } as any)
    }

    close() {
        this.props.close_callback(true)
    }

    render() {
        if (this.state.show_result) {
            return <VerifyFileResult hash={this.state.file_hash} close_callback={this.close.bind(this)} language={this.props.language} />
        }

        return <Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>Verify a file with SmartChain</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <HashFileComponent complete_callback={this.got_hash.bind(this)} language={this.props.language} />

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button type="button" className="btn btn-default btn-danger" onClick={() => { this.props.close_callback() }}>Close</button>
                </div>

            </Modal.Footer>
        </Modal>
    }
}

interface result {
    hex: string
    cost: number
}