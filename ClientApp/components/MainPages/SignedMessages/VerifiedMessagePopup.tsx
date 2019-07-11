import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { Modal } from 'react-bootstrap'
import { User, blank_user } from '../_Interfaces/iUser'
import { UnixToDate } from '../../Global/UnixToDate'
import { SignedMesage, blank_SignedMesage } from '../_Interfaces/iSigning'
import { Block, blank_block } from '../_Interfaces/iBLock'
import * as api from '../../Global/API'
interface Props {
    close_callback: any;
    language: number;
    show_popup: boolean;

    message: SignedMesage;
}
interface InfoPopupState {
    user: User
    time: number
    loading: number
}

export class VerifiedMessagePopup extends React.Component<Props, InfoPopupState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            user: blank_user,
            time: 0,
            loading: 0
        };

        api.GetBlockByHash(this.props.message.blockhash, (data: any) => { this.setState({ time: data.time, loading: this.state.loading + 1 }) })
        api.GetUser(this.props.message.address, (data: any) => { this.setState({ user: data, loading: this.state.loading + 1 }); })
    }
    //required for security, set pass to null

    close() {
        this.props.close_callback()
    }

    render() {
        if (this.state.loading < 2) {
            return <Modal show={this.props.show_popup} onHide={() => { }}>
                <Modal.Header closeButton>
                    <Modal.Title>Loading</Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    Please Wait!
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-default btn-success" onClick={this.close.bind(this)}>{t[this.props.language].Continue}</button>
                </Modal.Footer>
            </Modal>
        }
        else {
            return <Modal show={this.props.show_popup} onHide={() => { }}>
                <Modal.Header closeButton>
                    <Modal.Title>Verified Message</Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <dl className="dl-horizontal">
                        <dt>Message From</dt><dd>{this.state.user.username}</dd>
                        <dt>Address</dt><dd>{this.state.user.address}</dd>
                        <dt>Signed on or after</dt><dd><UnixToDate unix={this.props.message.time} /></dd>
                        <dt>Message</dt><dd>{this.props.message.message}</dd>
                    </dl>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-default btn-success" onClick={this.close.bind(this)}>{t[this.props.language].Continue}</button>
                </Modal.Footer>
            </Modal>
        }
    }
}