import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import t from '../Language/Language'
import { UserInfoPopup } from '../MainPages/Users/UserInfoPopup'
import { UnixToDate } from './UnixToDate'
import { TrueFalseIcon } from './TrueFalseIcon'
import { User } from '../MainPages/_Interfaces/iUser'
import { Modal } from 'react-bootstrap'
import * as statics from './statics'
import * as api from '../Global/API'

interface UserTableState {
    users: User[];

    loading: boolean;
    SelectedUser: string;
    ShowUser: boolean;

    verified: string;
    username: string;

    address: string;

    selected_index: number;
}
export interface Props {
    return_callback: any;
    cancel_callback: any;
    language: number;
}

export class SelectUser extends React.Component<Props, UserTableState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            users: [],
            loading: false,
            SelectedUser: "",
            ShowUser: false,
            selected_index: -1,
            verified: "",
            username: "",
            address: ""
        };
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

        return <div>

            {contents}

        </div>;
    }

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value } as any);
    }
    handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({ [name]: value } as any);
    }

    //need to get the filter values into an interface to post

    filter() {
        const body = JSON.stringify({
            username: this.state.username,
            description: "",
            address: this.state.address,
            status: this.state.verified
        })

        api.FilteredUsers(body, (data: any) => {
            this.setState({ users: data, loading: false })
        })
    }

    set_selected_index(index: number) {
        this.setState({ selected_index: index })
    }

    cancel() {
        this.props.cancel_callback()
    }

    return() {
        this.props.return_callback(this.state.users[this.state.selected_index])
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
                Header: t[this.props.language].Address,
                accessor: 'address'
            }

        ]

        return <Modal backdrop={"static"} show={true} onHide={this.props.cancel_callback}>
            <Modal.Header closeButton>
                <Modal.Title>Select Existing Identity</Modal.Title>

            </Modal.Header>
            <Modal.Body>

                <h5>User Search</h5>
                <div className="row">
                    <div className="form-group col-xs-8">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Username</span>
                            <input type="text" className="form-control" placeholder="Username" aria-describedby="basic-addon1" name="username" value={this.state.username} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-xs-8">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Address</span>
                            <input type="text" className="form-control" placeholder="Address" aria-describedby="basic-addon1" name="address" value={this.state.address} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>

                    <div className="form-group col-xs-4">
                        <button type="button" className="btn btn-default btn-success" onClick={() => { this.filter() }}>Search</button>

                    </div>
                </div>

                <div className="table table-responsive">

                    < ReactTable

                        data={data} columns={columns} showPagination={false} defaultPageSize={-1} minRows={5} className="-highlight" loading={this.state.loading}

                        getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {
                            if (rowInfo == undefined) {
                                return {}
                            }
                            return {
                                style: {
                                    background: this.state.selected_index === rowInfo.index ? '#80bdff' : null
                                },
                                onDoubleClick: () => {
                                    console.log("A Td Element was clicked!");

                                    this.OpenViewUser(rowInfo.row.address)

                                    // IMPORTANT! React-Table uses onClick internally to trigger
                                    // events like expanding SubComponents and pivots.
                                    // By default a custom 'onClick' handler will override this functionality.
                                    // If you want to fire the original onClick handler, call the
                                    // 'handleOriginal' function.
                                },
                                onClick: (e: MouseEvent) => { this.set_selected_index(rowInfo.index) }
                            };
                        }}

                    />
                </div>
            </ Modal.Body >
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button type="button" className="btn btn-default btn-success" onClick={this.return.bind(this)}>Use Selected Identity</button>
                    <button type="button" className="btn btn-default btn-danger" onClick={this.cancel.bind(this)}>Cancel</button>

                </div>

                {this.state.ShowUser ?
                    <UserInfoPopup address={this.state.SelectedUser} close_callback={this.CloseViewUser.bind(this)} language={this.props.language} />
                    : null
                }
            </ Modal.Footer>
        </Modal>
    }
}