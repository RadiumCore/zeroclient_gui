import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import { UnixToDate } from '../../Global/UnixToDate'
import { Election, candidate, vote } from '../_Interfaces/Elections'
import { User } from '../_Interfaces/iUser'
import ReactTable from 'react-table';
import { Modal } from 'react-bootstrap'

interface Props {
    cand: candidate;
    close_callback: any;
    language: number;
    show_me: boolean;
}
interface State {
    show_user_popup: boolean
    load_complete: boolean
}
export class CandidateInfoPopup extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = { show_user_popup: false, load_complete: false };
    }
    //required for security, set pass to null

    close() {
        this.props.close_callback(true)
    }

    show_user_popup(id: any) {
        this.setState({ show_user_popup: true })
    }
    close_user_popup() {
        this.setState({ show_user_popup: false })
    }

    render() {
        const data: vote[] = this.props.cand.votes;
        const columns = [
            {
                Header: 'username',
                accessor: 'owner.username'
            },
            {
                Header: "description",
                accessor: 'owner.description',
            },
            {
                Header: 'date recorded',
                accessor: 'unix_time',
                Cell: (row: any) => (
                    <UnixToDate unix={row.value} />
                )
            }

        ]

        return (<Modal backdrop={"static"} show={this.props.show_me} onHide={this.props.close_callback}>
            <Modal.Header closeButton>
                <Modal.Title> <dt>Title :</dt> <dd>{this.props.cand.text}</dd></Modal.Title>

            </Modal.Header>
            <Modal.Body>
                < div className="table table-responsive" >

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

                                    this.show_user_popup(rowInfo.row.id)
                                    // IMPORTANT! React-Table uses onClick internally to trigger
                                    // events like expanding SubComponents and pivots.
                                    // By default a custom 'onClick' handler will override this functionality.
                                    // If you want to fire the original onClick handler, call the
                                    // 'handleOriginal' function.
                                }
                            };
                        }}

                    />
                </ div>

            </Modal.Body>
            <Modal.Footer>

                <button onClick={() => { this.props.close_callback() }}>{t[this.props.language].Cancel}</button>
            </Modal.Footer>
        </Modal>

        );
    }
}