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
import * as H from 'history';
interface state {
    title: string;
    result: iFileHash;
    loading: boolean;
    username: string;
}
interface Props {

    location: string;
}
export class Record extends React.Component<Props, state> {
    constructor(props: Props) {
        super(props);
        this.state = {
            title: "",
            result: blank_hash,
            loading: true,
            username: ""
        };

        var start : number = this.props.location.lastIndexOf("=") + 1;
        var end: number = this.props.location.length;
       
        
        api.GetFileHash(this.props.location.substring(start, end), (data: any) => { this.setState({ result: data, loading: false }); })
    }

    get_content() {
        if (this.state.loading) {
            return <LoadingModal close_callback={null} />
        }

        let test = this.props.location.search;
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
                  
                    <dt>Signing Identity:</dt> <dd> <a href={"http://localhost:51069/user?username=" + this.state.result.username}>  {this.state.result.username} </a></dd>
                    <dt>Signing Address:</dt> <dd>{this.state.result.creator}</dd>
                    <dt>Date:</dt> <dd><UnixToDate unix={this.state.result.unixtime} /></dd>
                    <dt>Txid:</dt> <dd> <a href={"https://chainz.cryptoid.info/val/tx.dws?" + this.state.result.txid + ".htm"}>{this.state.result.txid}  </a>  </dd>

                    <dt>Title :</dt> <dd>{this.state.result.title}</dd>
                    <dt>File Hash :</dt> <dd>{this.state.result.hash}</dd>
                   
                    
                    
                </dl></Modal.Body>
            <Modal.Footer>
                <div><h5>Blockchain secured record validation services provided by <a href="https://validitytech.com"> Validity Platform </a>  </h5></div>
                <div> Developed and maintaind by SmartchainSoftware Solutions, LLC.</div>
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