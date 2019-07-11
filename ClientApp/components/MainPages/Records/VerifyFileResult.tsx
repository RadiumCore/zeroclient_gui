import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { User } from '../_Interfaces/iUser'
import { Modal } from 'react-bootstrap'
import * as api from '../../Global/API'
import { LoadingModal } from '../../Global/LoadingModal'
import * as statics from '../../Global/statics'
import { UnixToDate } from '../../Global/UnixToDate'
import { iFileHash, blank_hash } from '../_Interfaces/iFileHash'
interface Props {
    close_callback: any;
    language: number;
    hash: string;
}
interface state {
    title: string;
    result: iFileHash;
    loading: boolean;
    username: string;
}

export class VerifyFileResult extends React.Component<Props, state>{
    constructor(props: Props) {
        super(props);
        this.state = {
            title: "",
            result: blank_hash,
            loading: true,
            username: ""
        };
        api.GetFileHash(this.props.hash, (data: any) => { this.setState({ result: data, loading: false }); })
    }

    back() {
        this.props.close_callback()
    }

    get_content() {
        if (this.state.loading) {
            return <LoadingModal close_callback={this.back.bind(this)} />
        }
        if (this.state.result.hash == "") {
            return this.render_fail()
        }
        else { return this.render_sucess() }
    }

    render_fail() {
        return <Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title> <h4>Unknown File! Procede with caution </h4></Modal.Title>

            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-default btn-danger" onClick={this.back.bind(this)}>Back</button>

            </Modal.Footer>
        </Modal>
    }
    render_sucess() {
        return <Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title> <h4> Known File! </h4></Modal.Title>
                <h3>Ensure file is signed by an identity you trust </h3>

            </Modal.Header>
            <Modal.Body>
                <dl className="dl-horizontal">
                    <dt>Title :</dt> <dd>{this.state.result.title}</dd>
                    <dt>File Hash :</dt> <dd>{this.state.result.hash}</dd>
                    <dt>Signing Identity:</dt> <dd>{this.state.result.username}</dd>
                    <dt>Signing Address:</dt> <dd>{this.state.result.creator}</dd>
                    <dt>Signing Date:</dt> <dd><UnixToDate unix={this.state.result.unixtime} /></dd>
                    <dt>Signing Txid:</dt> <dd> {this.state.result.txid} </dd>
                </dl></Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-default btn-danger" onClick={this.back.bind(this)}>Back</button>

            </Modal.Footer>
        </Modal>
    }

    render() {
        let content = this.get_content()
        return content
    }
}
interface result {
    hex: string
    cost: number
}