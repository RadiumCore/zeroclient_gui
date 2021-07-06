import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import t from '../../Language/Language'
import { ElectionInfo } from './ElectionInfoPopup'
import { UnixToDate } from '../../Global/UnixToDate'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import { Election } from '../_Interfaces/Elections'
import * as statics from '../../Global/statics'

import * as api from '../../Global/API'
import * as Settings from '../../Global/settings'
interface ElectionTableState {
    elections: Election[];

    loading: boolean;
    selected_election: string;
    ShowElection: boolean;

    title: string;
    id: string;
    status: string
    verified: string;

    sctop: string;
    intervaltick: any;

    show_all: boolean;
}
export interface Props {
    defaultPageSize: number;
    showPagination: boolean;
    language: number;
    mobile: boolean;
}

export class ElectionTable extends React.Component<Props, ElectionTableState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            elections: [],
            loading: true,
            selected_election: "",
            ShowElection: false,
            title: "",
            id: "",
            status: "",
            verified: "",
            sctop: "",
            intervaltick: 5000,
            show_all: true,
        };

        this.load_data()
    }

    load_data() {
        api.GetAllElections((data: any) => {
            this.setState({ elections: data, loading: false });
        })
    }
    tick() {
        api.SCTop((data: any) => {
            if (data != this.state.sctop) {
                this.setState({ sctop: data });
                this.load_data()
            }
        })
    }

    componentDidMount() {
        var inttick = setInterval(() => this.tick(), 5000);
        // store intervalId in the state so it can be accessed later:
        this.setState({ intervaltick: inttick });
    }
    componentWillUnmount() {
        clearInterval(this.state.intervaltick);
    }

    CloseViewElection() {
        this.setState({ ShowElection: false })
    }

    OpenViewElection(ID: string) {
        this.setState({ selected_election: ID, ShowElection: true })
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>{t[this.props.language].Loading}</em></p>
            : this.RenderUserTable();

        return contents
    }

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value } as any, () => {
            this.filter()
        });
    }
    handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({ [name]: value } as any, () => {
            this.filter()
        });
    }

    //need to get the filter values into an interface to post

    filter() {
        var owner: string = this.state.show_all ? "" : Settings.current_identity.address;
        const body = JSON.stringify({
            title: this.state.title,
            id: this.state.id,
            status: this.state.status,
            verified: this.state.verified,
            owner: owner
        })

        api.GetFilteredElections(body, (data: any) => { this.setState({ elections: data, loading: false }); })
    }

    public RenderUserTable() {
        const data = this.state.elections;
        const columns = [
            {
                Header: 'title',
                accessor: 'title',
                filterMethod: (filter: any, row: any) =>

                    false
            },
            {
                Header: "Creator",
                accessor: 'creator.username'
            },
            {
                Header: 'id',
                accessor: 'id'
            },
            {
                Header: 'date recorded',
                accessor: 'unix_time',
                Cell: (row: any) => (
                    <UnixToDate unix={row.value} />
                )
            }

        ]

        return <div className="outside-table-div">          
            {Settings.current_identity.address == "" ? null : <label>
                <input type="checkbox" checked={this.state.show_all} onChange={e => {
                    this.setState({
                        show_all: !this.state.show_all
                    }, () => { this.filter() })
                }} />
                Show All Elections</label>
            }
            {this.props.mobile ?
                <div className="row">
                    <div className="form-group col-xs-6">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Title</span>
                            <input type="text" className="form-control" placeholder="Title" aria-describedby="basic-addon1" name="title" value={this.state.title} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>
                    <div className="form-group col-xs-6">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">ID</span>
                            <input type="text" className="form-control" placeholder="ID" aria-describedby="basic-addon1" name="id" value={this.state.id} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>
                </div>
                :
                <div className="row">
                    <div className="form-group col-xs-4">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Title</span>
                            <input type="text" className="form-control" placeholder="Title" aria-describedby="basic-addon1" name="title" value={this.state.title} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>
                    <div className="form-group col-xs-4">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">ID</span>
                            <input type="text" className="form-control" placeholder="ID" aria-describedby="basic-addon1" name="id" value={this.state.id} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>

                    <div className="form-group col-xs-4">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Election Status</span>
                            <select className="form-control" aria-describedby="basic-addon1" id="sel1" name="status" value={this.state.status} onChange={evt => this.handleSelectChange(evt)}>
                                <option>All</option>
                                <option>Open</option>
                                <option>Future</option>
                                <option>Compleated</option>
                            </select>
                        </div>
                    </div>
                </div>
            }
            <div className="inside-table-div table table-responsive">
                {this.props.mobile ?
                    < ReactTable

                        data={data}
                        columns={columns}
                        showPagination={false}

                        minRows={5}
                        className="-highlight"
                        loading={this.state.loading}
                        defaultSorted={[{ id: "unix_time", desc: true }]}

                        getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {
                            return {
                                onClick: () => {
                                    console.log("A Td Element was clicked!");
                                    console.log("row ID" + rowInfo.row.id);
                                    this.OpenViewElection(rowInfo.row.id)
                                    // IMPORTANT! React-Table uses onClick internally to trigger
                                    // events like expanding SubComponents and pivots.
                                    // By default a custom 'onClick' handler will override this functionality.
                                    // If you want to fire the original onClick handler, call the
                                    // 'handleOriginal' function.
                                }
                            };
                        }}

                    />

                    :
                    < ReactTable

                        data={data}
                        columns={columns}
                        showPagination={false}

                        minRows={5}
                        className="-highlight"
                        loading={this.state.loading}
                        defaultSorted={[{ id: "unix_time", desc: true }]}

                        getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {
                            return {
                                onDoubleClick: () => {
                                    console.log("A Td Element was clicked!");
                                    console.log("row ID" + rowInfo.row.id);
                                    this.OpenViewElection(rowInfo.row.id)
                                    // IMPORTANT! React-Table uses onClick internally to trigger
                                    // events like expanding SubComponents and pivots.
                                    // By default a custom 'onClick' handler will override this functionality.
                                    // If you want to fire the original onClick handler, call the
                                    // 'handleOriginal' function.
                                }
                            };
                        }}

                    />
                }

                {this.state.ShowElection ?
                    <ElectionInfo data-backdrop="static" hash={this.state.selected_election} close_callback={this.CloseViewElection.bind(this)} language={this.props.language} />
                    : null
                }

            </div>
        </div>
    }
}