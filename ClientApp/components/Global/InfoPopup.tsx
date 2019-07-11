import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../Language/Language'
import { Modal } from 'react-bootstrap'
interface Props {
    close_callback: any;
    language: number;
    show_popup: boolean;
    title: string;
    info: string;
}
interface InfoPopupState {
}

export class InfoPopup extends React.Component<Props, InfoPopupState>{
    constructor(props: Props) {
        super(props);
        this.state = {
        };
    }
    //required for security, set pass to null

    close() {
        this.props.close_callback()
    }

    render() {
        return <Modal show={this.props.show_popup} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <pre>{this.props.info}</pre>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-default btn-success" onClick={this.close.bind(this)}>{t[this.props.language].Continue}</button>
            </Modal.Footer>
        </Modal>
    }
}