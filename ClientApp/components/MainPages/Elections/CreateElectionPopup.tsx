import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import { UnixToDate } from '../../Global/UnixToDate'

import { Election_lite, candidate_lite } from '../_Interfaces/Elections'
import ReactTable from 'react-table';
import { Modal } from 'react-bootstrap'
import { GetInputPopup } from '../../Global/GetInputPopup'
import { InfoPopup } from '../../Global/InfoPopup'
import { PickBlockButton } from '../../Global/PickBlockButton'
import { CreateElectionPopupConfirmation } from './CreateElectionPopupConfirmation'
import * as settings from "../../Global/settings"

import { SmartTxSendResultComponent } from '../../Global/SmartTxSendResultComponent'

interface Props {
    close_callback: any;
    language: number;
}
interface CreateElectionPopupState {
    data: Election_lite;
    length: number;
    load_complete: boolean
    new_candidate_text: string;

    show_get_input: boolean;

    info_title: string;
    info_body: string;
    show_info: boolean;
    show_confirmation: boolean;

    hex_data: string;
    fee: number;
    show_result: boolean;
}
export class CreateElectionPopup extends React.Component<Props, CreateElectionPopupState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            data: {
                title: "",
                description: "",
                candidates: [],
                start_block: 0,
                end_block: 0,
            },

            length: 0,
            load_complete: false,

            new_candidate_text: "",
            show_get_input: false,
            info_body: "",
            info_title: "",
            show_info: false,
            show_confirmation: false,

            hex_data: "",
            fee: 0,
            show_result: false,
        };
    }
    //required for security, set pass to null

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value } as any);
    }

    set_startblock(block: number, unix: number) {
        this.setState({ data: { ...this.state.data, start_block: block } });
    }
    set_stopblock(block: number, unix: number) {
        this.setState({ data: { ...this.state.data, end_block: block } });
    }

    add_candidate(text: string) {
        var elect: Election_lite = this.state.data

        var can: candidate_lite = { text }

        elect.candidates.push(can);

        this.setState({ data: elect, show_get_input: false })
    }
    remove_candidate(index: number) {
        var elect: Election_lite = this.state.data
        var cans: candidate_lite[] = this.state.data.candidates

        elect.candidates.splice(index, 1);

        this.setState({ data: elect })
    }
    clear_all() {
        var elect: Election_lite = this.state.data
        elect.candidates = []
        this.setState({ data: elect })
    }

    show_get_input() {
        this.setState({ show_get_input: true })
    }

    validate() {
        if (this.state.data.title == "" || this.state.data.title == null) {
            this.setState({ info_title: "Data Error", info_body: "You must enter a title", show_info: true })
            return false
        }

        if (this.state.data.candidates.length < 1) {
            this.setState({ info_title: "Data Error", info_body: "You must have at least one candidate!", show_info: true })
            return false
        }
        if (this.state.data.candidates.length > 200) {
            this.setState({ info_title: "Data Error", info_body: "You may not have more than 200 candidates!", show_info: true })
            return false
        }

        //todo start block & end block validation.

        this.setState({ show_confirmation: true })
    }

    send(res: result) {
        this.setState({ hex_data: res.hex, fee: res.cost, show_confirmation: false, show_result: true })
    }

    fail() {
        this.setState({ hex_data: "", fee: 0, show_confirmation: false, show_result: false })
    }

    sucess() {
        this.props.close_callback()
    }

    close_info() {
        this.setState({ show_info: false })
    }

    start_send() {
        this.validate()
    }

    select_content() {
        if (settings.current_identity.address == "") {
            this.setState({ info_title: "Please log in", info_body: "Please log in using the loging button on the lower left" })
            return (<InfoPopup show_popup={true} close_callback={this.sucess.bind(this)} title={this.state.info_title} info={this.state.info_body} language={this.props.language} />)
        }

        if (this.state.show_confirmation) {
            return (<CreateElectionPopupConfirmation election={this.state.data} cancel_callback={this.fail.bind(this)} continue_callback={this.send.bind(this)} language={this.props.language} />)
        }
        if (this.state.show_result) {
            return <SmartTxSendResultComponent encoded_hex={this.state.hex_data} fee={this.state.fee} identity={settings.current_identity.address} language={this.props.language} sucess_close_callback={this.sucess.bind(this)} fail_close_callback={this.fail.bind(this)} />
        }
        if (this.state.show_info) {
            return <InfoPopup title={this.state.info_title} info={this.state.info_body} show_popup={this.state.show_info} close_callback={() => this.setState({ show_info: false })} language={this.props.language} />
        }

        const data: iText[] = this.state.data.candidates;

        const columns = [
            {
                Header: 'Candidates',
                accessor: 'text',
            },

        ]

        return (<Modal backdrop={"static"} show={true} onHide={this.props.close_callback}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Election</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Title*:</span>
                    <input type="text" className="form-control" placeholder="Title" aria-describedby="basic-addon1" required={true} name="title" value={this.state.data.title} onChange={e => this.setState({ data: { ...this.state.data, title: e.target.value } })} ></input>
                </div>
                <p />

                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">Description:</span>
                    <input type="text" className="form-control" placeholder="Description" aria-describedby="basic-addon1" name="Description" value={this.state.data.description} onChange={e => this.setState({ data: { ...this.state.data, description: e.target.value } })}></input>
                </div>
                <p />
                <p />
                <p />

                <div className="row">
                    <div className="form-group col-xs-6">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Start Block*</span>
                            <PickBlockButton button_text={this.state.data.start_block == 0 ? "Select Date" : this.state.data.start_block.toString()} return_callback={this.set_startblock.bind(this)} />

                        </div>
                    </div>

                    <div className="form-group col-xs-6">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">End Block*</span>
                            <PickBlockButton button_text={this.state.data.end_block == 0 ? "Select Date" : this.state.data.end_block.toString()} return_callback={this.set_stopblock.bind(this)} />

                        </div>
                    </div>
                </div>

                <p />
                * Required
                    <p />

                < ReactTable

                    data={data}
                    columns={columns}
                    showPagination={false}

                    minRows={2}
                    className="-highlight"
                    getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {
                        return {
                            onDoubleClick: () => {
                                console.log("A Td Element was clicked!");

                                //this.open_vote_view(rowInfo.row)
                                // IMPORTANT! React-Table uses onClick internally to trigger
                                // events like expanding SubComponents and pivots.
                                // By default a custom 'onClick' handler will override this functionality.
                                // If you want to fire the original onClick handler, call the
                                // 'handleOriginal' function.
                            }
                        };
                    }}

                />
                <p />

                <p />
                <p />
                <p />

                <div className="btn-toolbar" role="group" aria-label="...">
                    <button type="button" className="btn btn-default " onClick={this.show_get_input.bind(this)}>Add Candidate</button>
                    <button type="button" className="btn btn-default btn-warning" onClick={() => { this.clear_all() }}>Clear All</button>

                </div>

                <div className="row">
                    <div className="form-group col-xs-10">
                        <div className="btn-toolbar" role="group" aria-label="...">

                        </div>
                    </div>
                    <div className="form-group col-xs-2">

                    </div>
                </div>

                <GetInputPopup title={"Create New Candidate"} info={"Enter Candidate's name"} show_me={this.state.show_get_input} close_callback={() => this.setState({ show_get_input: false })} data_callback={this.add_candidate.bind(this)} language={this.props.language} />

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">

                    <button type="button" className="btn btn-default btn-success" onClick={this.start_send.bind(this)}>Create</button>
                    <button type="button" className="btn btn-default btn-danger" onClick={() => { this.props.close_callback() }}>Close</button>
                </div>
            </Modal.Footer>
        </Modal>

        )
    }

    render() {
        let content = this.select_content()

        return (
            this.state.show_info ?
                <InfoPopup show_popup={true} close_callback={this.close_info.bind(this)} title={this.state.info_title} info={this.state.info_body} language={this.props.language} />
                :
                content
        )
    }
}

interface iText {
    text: string;
}

interface result {
    hex: string
    cost: number
}