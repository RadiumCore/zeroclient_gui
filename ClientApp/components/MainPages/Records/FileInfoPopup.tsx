import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import { UnixToDate } from '../../Global/UnixToDate'
import { iFileHash } from '../_Interfaces/iFileHash'
import { Modal } from 'react-bootstrap'
import * as api from '../../Global/API'
interface Props {
    hash: string;

    close_callback: any;
    language: number;
}
interface FileInfoPopupState {
    file: iFileHash
    load_complete: boolean
}
export class FileInfoPopup extends React.Component<Props, FileInfoPopupState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            file: {
                title: "",
                hash: "",
                username: "",
                txid: "",
                creator: "",
                block: 0,
                unixtime: 0,
            }, load_complete: false
        };
        api.GetFileHash(this.props.hash, (data: any) => { this.setState({ file: data, load_complete: true }); })
    }
    //required for security, set pass to null

    close() {
        this.props.close_callback(true)
    }

    Should_show(st: string): boolean {
        if (typeof (st) == 'string' && st.length > 0)
            return true;

        return false
    }

    render() {
        return <Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>File </Modal.Title>

            </Modal.Header>
            <Modal.Body>
                {this.state.load_complete ? <dl className="dl-horizontal">
                    <dt>Hash :</dt><dd>{this.state.file.hash}</dd>
                    {this.Should_show(this.state.file.title) ? <span><dt>Title :</dt> <dd>{this.state.file.title}</dd></span> : null}
                    <dt>{t[this.props.language].Username} :</dt><dd>{this.state.file.username}</dd>
                    <dt>TXID :</dt><dd>{this.state.file.txid}</dd>
                    <dt>{t[this.props.language].Block} :</dt><dd>{this.state.file.block}</dd>
                    <dt>Date :</dt> <dd> <UnixToDate unix={this.state.file.unixtime} /></dd>
                </dl>
                    :
                    <span>Loading...</span>}

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button onClick={() => { this.props.close_callback() }}>Close</button>

                </div>

            </Modal.Footer>
        </Modal>
    }
}