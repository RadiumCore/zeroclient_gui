import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../Language/Language'
import { Modal } from 'react-bootstrap'
interface Props {
    close_callback: any;
    data_callback: any;
    language: number;
    show_me: boolean;

    title: string;
    info: string;
}
interface GetInputPopupState {
    data: string;
}

export class GetInputPopup extends React.Component<Props, GetInputPopupState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            data: ""
        };
    }
    //required for security, set pass to null

    return_data() {
        this.props.data_callback(this.state.data)
    }

    close() {
        this.props.close_callback()
    }

    key_up(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            this.return_data()
        }
    }

    render() {
        return <Modal show={this.props.show_me} onHide={this.props.close_callback}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                {this.props.info}
                <div> <input type="text" onKeyPress={evt => this.key_up(evt)} onChange={evt => this.setState({ data: evt.target.value })} /></div>

            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-default btn-success" onClick={() => { this.return_data() }} >{t[this.props.language].Continue}</button>
                <button type="button" className="btn btn-default btn-danger" onClick={() => { this.close() }}>{t[this.props.language].Cancel}</button>
            </Modal.Footer>
        </Modal>
    }
}