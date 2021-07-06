import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import { UnixToDate } from '../../Global/UnixToDate'
import { Election, blank_election, candidate } from '../_Interfaces/Elections'
import { User, blank_user } from '../_Interfaces/iUser'
import ReactTable from 'react-table';
import { Modal } from 'react-bootstrap'
import { CastVoteConfirmation } from './CastVoteConfirmation'
import { InfoPopup } from '../../Global/InfoPopup'
import * as settings from '../../Global/settings'
import * as statics from '../../Global/statics'

import * as api from '../../Global/API'
import { SmartTxSendResultComponent } from '../../Global/SmartTxSendResultComponent'

interface Props {
    hash: string;   
    close_callback: any;
    language: number;
}
interface ElectionInfoPopupState {
    election: Election
    load_complete: boolean
    selected_index: number;
    show_confirmation: boolean;

    hex_data: string;
    fee: number;
    show_result: boolean;

    // info popup
    show_info: boolean
    info_title: string
    info_body: string
}
export class ElectionInfo extends React.Component<Props, ElectionInfoPopupState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            election: blank_election,
            load_complete: false,
            selected_index: -1,
            show_confirmation: false,

            hex_data: "",
            fee: 0,
            show_result: false,
            show_info: false,
            info_body: "",
            info_title: "",
        },
            api.GetElection(this.props.hash, (data: any) => { this.setState({ election: data, load_complete: true }); })
    }
    //required for security, set pass to null

    close() {
        this.props.close_callback(true)
    }

    Fail_vote() {
        this.setState({ show_confirmation: false, show_result: false })
    }
    open_confirm_vote() {
        if (settings.current_identity.address == "") {
            this.setState({ show_info: true, info_title: "Not logged in", info_body: "Please login before voting!" })
            return;
        }

        this.setState({ show_confirmation: true })
    }
    close_confirm_vote() {
        this.setState({ show_confirmation: false })
    }

    Should_show(st: string): boolean {
        if (typeof (st) == 'string' && st.length > 0)
            return true;

        return false
    }

    set_selected_index(index: number) {
        this.setState({ selected_index: index })
    }

    send(res: result) {
        this.setState({ hex_data: res.hex, fee: res.cost, show_confirmation: false, show_result: true })
    }

    select_content() {
        if (this.state.show_confirmation) {
            return (<CastVoteConfirmation election={this.state.election} candidate_index={this.state.selected_index} cancel_callback={this.close_confirm_vote.bind(this)} continue_callback={this.send.bind(this)} language={this.props.language} identity={settings.current_identity.address} />)
        }

        if (this.state.show_result) {
            return <SmartTxSendResultComponent encoded_hex={this.state.hex_data} fee={this.state.fee} identity={settings.current_identity.address} language={this.props.language} sucess_close_callback={this.close.bind(this)} fail_close_callback={this.Fail_vote.bind(this)} />
        }

        const data: candidate[] = this.state.election.candidates;
        const own: User = this.state.election.creator;
        const columns = [
            {
                Header: 'Candidate',
                accessor: 'text',
                Cell: (row: any) => <div style={{ textAlign: "right" }}>{row.value}</div>
            },
            {
                Header: "Votes",
                accessor: 'votes',
                Cell: (row: any) => <div style={{ textAlign: "right" }}>{row.value.length}</div>
            },

        ]

        return (<Modal backdrop={"static"} show={this.state.load_complete} onHide={this.props.close_callback}>
            <Modal.Header closeButton>
                <Modal.Title>{this.state.election.title}</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <dl className="dl-horizontal" >
                    {this.state.load_complete ? <span>
                        <dt>Description :</dt> <dd>{this.state.election.description}</dd>
                        < div className="table table-responsive" >

                            < ReactTable

                                data={data}
                                columns={columns}
                                showPagination={false}

                                minRows={2}
                                className="-highlight"

                                getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {
                                    return {
                                        style: {
                                            background: this.state.selected_index === rowInfo.index ? '#007bff' : null
                                        },
                                        onClick: (e: MouseEvent) => { this.set_selected_index(rowInfo.index) },
                                    };
                                }}
                            />
                        </div  >
                    </span> : <span>Loading...</span>}

                </dl>

            </Modal.Body>
            <Modal.Footer>                                  
                    <button type="button" className="btn btn-default btn-danger" onClick={this.close.bind(this)}>Close</button>

            </Modal.Footer>
            {this.state.show_info ?
                <InfoPopup title={this.state.info_title} info={this.state.info_body} close_callback={() => { this.setState({ show_info: false }) }} show_popup={true} language={this.props.language} />
                : null
            }
        </Modal>

        );
    }

    render() {
        let content = this.select_content()

        return (content)
    }
}

interface result {
    hex: string
    cost: number
}