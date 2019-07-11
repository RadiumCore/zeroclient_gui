//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import t from '../Language/Language'
//import { Modal } from 'react-bootstrap'
//import { User } from '../MainPages/_Interfaces/iUser'
//import ReactTable from 'react-table';
//import * as statics from './statics'
//import * as settings from './settings'
//interface Props {
//    close_callback: any;

//    language: number;
//}
//interface GetIdentityPopupState {
//    addresses: string[]
//    users: User[];
//    loading: boolean;
//}

//export class GetIdentityPopup extends React.Component<Props, GetIdentityPopupState>{
//    constructor(props: Props) {
//        super(props);
//        this.state = {
//            addresses: [],
//            users: [],
//            loading: true
//        };

//        fetch('http://127.0.0.1:7777/api/SampleData/getalladdresses')
//            .then(response => response.json() as Promise<string[]>)
//            .then(data => {
//                fetch('api/public/GetMyUsers', {
//                    method: 'POST',
//                    headers: statics.requestHeaders,
//                    body: JSON.stringify(data)
//                })
//                    .then(response => response.json() as Promise<User[]>)

//                    .then(data => { this.setState({ users: data, loading: false }); })
//            });
//    }
//    //required for security, set pass to null

//    set_user(address: string) {
//        fetch('api/public/GetUser/' + address)
//            .then(response => response.json() as Promise<User>)
//            .then(data => {
//                settings.set_current_identity(data)

//            });
//    }

//    close() {
//        this.props.close_callback()
//    }

//    render() {
//        return <Modal show={true} onHide={this.props.close_callback}>
//            <Modal.Header closeButton>
//                <Modal.Title>Select the identity you wish to use </Modal.Title>
//                <span> Currently Selected Identity: {settings.current_identity.username}</span>
//            </Modal.Header>
//            <Modal.Body>
//                {this.state.loading ? <h4><span>Loading...This may take a few seconds</span></h4> : this.user_table()}

//            </Modal.Body>
//            <Modal.Footer>

//                <button type="button" className="btn btn-default btn-danger" onClick={() => { this.close() }}>Close</button>
//            </Modal.Footer>
//        </Modal>
//    }

//    user_table() {
//        const data = this.state.users;
//        const columns = [
//            {
//                Header: t[this.props.language].Username,
//                accessor: 'username',
//                filterMethod: (filter: any, row: any) =>

//                    false
//            },
//            {
//                Header: t[this.props.language].Description,
//                accessor: 'description'
//            },
//            {
//                Header: t[this.props.language].Address,
//                accessor: 'address'
//            }

//        ]

//        return <div>

//            <div className="fixed-div table table-responsive">

//                < ReactTable

//                    data={data} columns={columns} showPagination={false} defaultPageSize={-1} minRows={5} className="-highlight" loading={this.state.loading}

//                    getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {
//                        return {
//                            onDoubleClick: () => {
//                                console.log("A Td Element was clicked!");
//                                this.set_user(rowInfo.row.address);

//                                this.props.close_callback()

//                                // IMPORTANT! React-Table uses onClick internally to trigger
//                                // events like expanding SubComponents and pivots.
//                                // By default a custom 'onClick' handler will override this functionality.
//                                // If you want to fire the original onClick handler, call the
//                                // 'handleOriginal' function.
//                            }
//                        };
//                    }}

//                />

//            </div>
//        </div>
//    }
//}