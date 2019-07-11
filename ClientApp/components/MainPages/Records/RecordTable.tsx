import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import t from '../../Language/Language'
import { VerifyFileResult } from './VerifyFileResult'
import { UnixToDate } from '../../Global/UnixToDate'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import { iFileHash } from '../_Interfaces/iFileHash'
import * as Settings from '../../Global/settings'
import * as statics from '../../Global/statics'
import * as api from '../../Global/API'
interface FileTableState {
    users: iFileHash[];
    rangestart: number;
    loading: boolean;
    selected_file: string;
    ShowFile: boolean;

    title: string;
    username: string;
    hash: string
    verified: string;

    intervaltick: any;
    sctop: string

    show_all: boolean;
}
export interface Props {
    defaultPageSize: number;
    showPagination: boolean;
    language: number;
    mobile: boolean;
}

export class RecordTable extends React.Component<Props, FileTableState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            users: [],
            rangestart: 0,
            loading: true,
            selected_file: "",
            ShowFile: false,
            verified: "",
            username: "",
            title: "",
            hash: "",
            intervaltick: 5000,
            sctop: "",
            show_all: true,
        };
        this.load_data()
    }

    load_data() {
        api.GetAllRecords((data: any) => { this.setState({ users: data, loading: false }); })
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

    CloseViewUser() {
        this.setState({ ShowFile: false })
    }

    OpenViewFile(hash: string) {
        this.setState({ selected_file: hash, ShowFile: true })
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
            username: this.state.username,
            status: this.state.verified,
            hash: this.state.hash,
            owner: owner,
        })

        api.GetFilteredFiles(body, (data: any) => { this.setState({ users: data, loading: false }); })
    }

    public RenderUserTable() {
        const data = this.state.users;
        const columns = [
            {
                Header: 'title',
                accessor: 'title',
                filterMethod: (filter: any, row: any) =>

                    false
            },
            {
                Header: t[this.props.language].Username,
                accessor: 'username'
            },
            {
                Header: 'hash',
                accessor: 'hash'
            },
            {
                Header: 'date recorded',
                accessor: 'unixtime',
                Cell: (row: any) => (
                    <UnixToDate unix={row.value} />
                )
            }

        ]

        return <div className="outside-table-div">
            <h5>Filtering</h5>
            {Settings.current_identity.address == "" ? null : <label>
                <input type="checkbox" checked={this.state.show_all} onChange={e => {
                    this.setState({
                        show_all: !this.state.show_all
                    }, () => { this.filter() })
                }} />
                Show All Records</label>
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
                            <span className="input-group-addon" id="basic-addon1">Hash</span>
                            <input type="text" className="form-control" placeholder="Hash" aria-describedby="basic-addon1" name="hash" value={this.state.hash} onChange={evt => this.handleInputChange(evt)}></input>
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
                            <span className="input-group-addon" id="basic-addon1">Username</span>
                            <input type="text" className="form-control" placeholder="Username" aria-describedby="basic-addon1" name="username" value={this.state.username} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>
                    <div className="form-group col-xs-4">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Hash</span>
                            <input type="text" className="form-control" placeholder="Hash" aria-describedby="basic-addon1" name="hash" value={this.state.hash} onChange={evt => this.handleInputChange(evt)}></input>
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
                        defaultPageSize={-1}
                        minRows={5}
                        className="-highlight"
                        loading={this.state.loading}
                        defaultSorted={[{ id: "unixtime", desc: true }]}

                        getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {
                            return {
                                onClick: () => {
                                    console.log("A Td Element was clicked!");

                                    this.OpenViewFile(rowInfo.row.hash)
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
                        defaultPageSize={-1}
                        minRows={5}
                        className="-highlight"
                        loading={this.state.loading}
                        defaultSorted={[{ id: "unixtime", desc: true }]}

                        getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {
                            return {
                                onDoubleClick: () => {
                                    console.log("A Td Element was clicked!");

                                    this.OpenViewFile(rowInfo.row.hash)
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

                {this.state.ShowFile ?
                    <VerifyFileResult hash={this.state.selected_file} close_callback={this.CloseViewUser.bind(this)} language={this.props.language} />
                    : null
                }

            </div>
        </div>
    }
}