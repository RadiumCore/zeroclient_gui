import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import * as statics from '../../Global/statics'

import * as api from '../../Global/API'
import { Election_lite, candidate_lite } from '../_Interfaces/Elections'
import { Modal } from 'react-bootstrap'

interface Props {
    election: Election_lite

    cancel_callback: any;
    continue_callback: any;
    language: number;
}
interface CreateElectionPopupConfirmationState {
    encoding_result: result;
}
export class CreateElectionPopupConfirmation extends React.Component<Props, CreateElectionPopupConfirmationState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            encoding_result: {
                hex: "",
                cost: 0,
            }
        };
        const body = JSON.stringify({
            election: this.props.election,
        })

        api.EncodeNewElection(body, (data: any) => { this.setState({ encoding_result: data }); })
    }
    //required for security, set pass to null

    Should_show(st: string): boolean {
        if (typeof (st) == 'string' && st.length > 0)
            return true;

        return false
    }

    render() {
        return (<Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>Please ensure the following information is correct</Modal.Title>

            </Modal.Header>
            <Modal.Body>

                <dl className="dl-horizontal">
                    <dt>Title :</dt> <dd>{this.props.election.title}</dd>
                    <dt>{t[this.props.language].Description} :</dt><dd>{this.props.election.description}</dd>
                    <dt>candidates :</dt><dd></dd>
                    {this.props.election.candidates.map(forecast =>
                        <span><dt></dt> <dd>{forecast.text}</dd></span>

                    )}

                    <dt>Start Block :</dt><dd>{this.props.election.start_block}</dd>
                    <dt>End Block :</dt><dd>{this.props.election.end_block}</dd>
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
                    }}>Create</button>
                </div>
            </Modal.Footer>
        </Modal>

        );
    }
}

interface result {
    hex: string
    cost: number
}