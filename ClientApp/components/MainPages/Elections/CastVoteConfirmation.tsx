import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'

import * as api from '../../Global/API'
import * as statics from '../../Global/statics'
import { Election, candidate } from '../_Interfaces/Elections'
import { Modal } from 'react-bootstrap'
import { InfoPopup } from '../../Global/InfoPopup'

interface Props {
    election: Election
    candidate_index: number;

    cancel_callback: any;
    continue_callback: any;

    language: number;

    identity: string;
}
interface State {
    encoding_result: result;

    info_title: string;
    info_body: string;
    show_info: boolean;

    hex_data: string;
    fee: number;
    show_result: boolean;

    loading_1: boolean;
    loading_2: boolean;
}
export class CastVoteConfirmation extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            encoding_result: {
                hex: "",
                cost: 0,
                sucess: false,
                message: "",
            },

            info_title: "",
            info_body: "",
            show_info: false,
            hex_data: "",
            fee: 0,
            show_result: false,
            loading_1: false,
            loading_2: false,
        };

        const body = JSON.stringify({
            id: this.props.election.id,
            index: this.props.candidate_index,
        })

        api.EncodeNewVote(body, (data: any) => { this.setState({ encoding_result: data }); })
    }
    //required for security, set pass to null

    validate() {
    }

    cancel_close() {
        this.props.cancel_callback()
    }

    Should_show(st: string): boolean {
        if (typeof (st) == 'string' && st.length > 0)
            return true;

        return false
    }

    send(res: result) {
        this.setState({ hex_data: res.hex, fee: res.cost, show_result: true })
    }

    select_content() {
    }

    render() {
        if (!this.state.encoding_result.sucess) {
            this.setState({ info_title: "Error", info_body: this.state.encoding_result.message })
            return (<InfoPopup show_popup={true} close_callback={this.cancel_close.bind(this)} title={this.state.info_title} info={this.state.info_body} language={this.props.language} />)
        }

        return (<Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>You are about to vote for the below candidate. </Modal.Title>

            </Modal.Header>
            <Modal.Body>

                <dl className="dl-horizontal">
                    <dt>Election :</dt> <dd>{this.props.election.title}</dd>
                    <dt>candidate :</dt> <dd>{this.props.election.candidates[this.props.candidate_index].text}</dd>
                </dl>

                <h4>The cost for this operation is {this.state.encoding_result.cost} Radium. Are you sure?</h4>

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button type="button" className="btn btn-default btn-danger" onClick={() => {
                        this.props.cancel_callback()
                    }}>Close</button>

                    <button type="button" className="btn btn-default btn-success" onClick={() => {
                        this.props.continue_callback(this.state.encoding_result)
                    }}>Vote!</button>
                </div>
            </Modal.Footer>
        </Modal>

        );
    }
}

interface result {
    hex: string
    cost: number
    sucess: boolean
    message: string
}