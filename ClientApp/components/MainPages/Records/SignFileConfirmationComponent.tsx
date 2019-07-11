import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { User } from '../_Interfaces/iUser'
import { Modal } from 'react-bootstrap'
import * as settings from '../../Global/settings'
import * as statics from '../../Global/statics'
import * as api from '../../Global/API'
interface Props {
    complete_callback: any;
    cancel_callback: any;
    language: number;
    title: string;
    hash: string;
    identity: string;
}
interface SignFileConfirmationComponentState {
    title: string;
    encoding_result: result,
    loading: boolean;
    username: string;
}

export class SignFileConfirmationComponent extends React.Component<Props, SignFileConfirmationComponentState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            title: "",
            encoding_result: { hex: "", cost: 0 },
            loading: true,
            username: ""
        };
        const body = JSON.stringify({
            title: this.props.title,
            hash: this.props.hash,
        })

        api.EncodeFileHash(body, (data: any) => { this.setState({ encoding_result: data }); })
        api.GetUser(settings.current_identity.address, (data: User) => { this.setState({ username: data.username, loading: false }); })
    }

    continue() {
        this.props.complete_callback(this.state.encoding_result)
    }
    back() {
        this.props.cancel_callback()
    }

    render() {
        return (<Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title> <h4> Please ensure the following information is correct</h4></Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <dl className="dl-horizontal">
                    <dt>File Hash :</dt> <dd>{this.props.hash}</dd>
                    <dt>Title :</dt> <dd>{this.props.title}</dd>
                    <dt>Cost :</dt> <dd>{this.state.encoding_result.cost}</dd>

                    <dt>Using Identity:</dt> <dd></dd>
                    <dt>{t[this.props.language].Username}:</dt> <dd>{this.state.username}</dd>
                    <dt>{t[this.props.language].Address}:</dt> <dd>{settings.current_identity.address}</dd>
                </dl>

                <h5>"The cost for this operation is {this.state.encoding_result.cost} Radium. Are you sure?</h5>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-default btn-danger" onClick={this.back.bind(this)}>Back</button>
                <button type="button" className="btn btn-default btn-success" onClick={this.continue.bind(this)}>Continue</button>
            </Modal.Footer>
        </Modal>

        );
    }
}

interface result {
    hex: string
    cost: number
}