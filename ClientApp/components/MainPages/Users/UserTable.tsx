import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import t from '../../Language/Language'
import { UserInfoPopup } from './UserInfoPopup'
import { UnixToDate } from '../../Global/UnixToDate'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import { User } from '../_Interfaces/iUser'

import * as api from '../../Global/API'
import * as statics from '../../Global/statics'

interface UserTableState {
    users: User[];
    rangestart: number;
    loading: boolean;
    SelectedUser: string;
    ShowUser: boolean;

    verified: string;
    username: string;
    description: string;
    address: string;
    intervaltick: any;
    sctop: string;
}
export interface Props {
    defaultPageSize: number;
    showPagination: boolean;
    language: number;
    mobile: boolean;
}

export class UserTable extends React.Component<Props, UserTableState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            users: [], rangestart: 0, loading: true, SelectedUser: "", ShowUser: false,
            verified: "", username: "", description: "", address: "", intervaltick: 5000, sctop: "",
        };

        this.load_data()
    }
    load_data() {
        api.GetAllUsers((data: any) => { this.setState({ users: data, loading: false }) })
    }
    tick() {
        api.SCTop((data: any) => {
            if (data != this.state.sctop) {
                this.setState({ sctop: data });
                this.load_data()
            }
        });
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
        this.setState({ ShowUser: false })
    }

    OpenViewUser(useraddress: string) {
        this.setState({ SelectedUser: useraddress, ShowUser: true })
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>{t[this.props.language].Loading}</em></p>
            : this.RenderUserTable();

        return contents

            ;
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
        api.FilteredUsers(JSON.stringify({
            username: this.state.username,
            description: this.state.description,
            address: this.state.address,
            status: this.state.verified
        }),
            (data: any) => this.setState({ users: data, loading: false })

        )
    }

    public RenderUserTable() {
        const data = this.state.users;
        const columns = [
            {
                Header: t[this.props.language].Username,
                accessor: 'username',
                filterMethod: (filter: any, row: any) =>

                    false
            },
            {
                Header: t[this.props.language].Description,
                accessor: 'description'
            },
            {
                Header: t[this.props.language].Address,
                accessor: 'address'
            },
            {
                Header: t[this.props.language].Join_Date,
                accessor: 'unixtime',
                Cell: (row: any) => (
                    <UnixToDate unix={row.value} />
                )
            }

        ]

        return <div className="outside-table-div">
            <h5>Filtering</h5>
            {this.props.mobile ?
                <div className="row">
                    <div className="form-group col-xs-6">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Username</span>
                            <input type="text" className="form-control" placeholder="Username" aria-describedby="basic-addon1" name="username" value={this.state.username} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>

                    <div className="form-group col-xs-6">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Status</span>
                            <select className="form-control" aria-describedby="basic-addon1" id="sel1" name="verified" value={this.state.verified} onChange={evt => this.handleSelectChange(evt)}>
                                <option>All</option>
                                <option>Verified</option>
                                <option>Unverified</option>
                            </select>
                        </div>
                    </div>
                </div>
                :
                <div className="row">
                    <div className="form-group col-xs-4">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Username</span>
                            <input type="text" className="form-control" placeholder="Username" aria-describedby="basic-addon1" name="username" value={this.state.username} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>
                    <div className="form-group col-xs-4 filtering-optional">
                        <div className="input-group">
                            <span className="input-group-addon " id="basic-addon1">Description</span>
                            <input type="text" className="form-control" placeholder="Description" aria-describedby="basic-addon1" name="description" value={this.state.description} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>
                    <div className="form-group col-xs-4 filtering-optional">
                        <div className="input-group">
                            <span className="input-group-addon filtering-optional" id="basic-addon1">Address</span>
                            <input type="text" className="form-control" placeholder="Address" aria-describedby="basic-addon1" name="address" value={this.state.address} onChange={evt => this.handleInputChange(evt)}></input>
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
                                    this.OpenViewUser(rowInfo.row.address)
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
                                    this.OpenViewUser(rowInfo.row.address)
                                }
                            };
                        }}

                    />
                }
                {this.state.ShowUser ?
                    <UserInfoPopup address={this.state.SelectedUser} close_callback={this.CloseViewUser.bind(this)} language={this.props.language} />
                    : null
                }

            </div>
        </div>
    }
}