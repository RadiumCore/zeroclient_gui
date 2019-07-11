//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import ReactTable from 'react-table';
//import 'react-table/react-table.css'
//import t from '../../Language/Language'
//import { RowTx } from './TxRow'
//import { iTransaction } from '../_Interfaces/iTransaction'

//interface TransactionState {
//    transactions: iTransaction[];
//    intervaltransaction: any;
//}
//export interface Props {
//    defaultPageSize: number;
//    showPagination: boolean;
//    language: number;
//}

//export class TransactionTable extends React.Component<Props, TransactionState> {
//    constructor(props: Props) {
//        super(props);
//        this.state = { transactions: [], intervaltransaction: [] };
//        this.gettransactions();
//    }

//    gettransactions() {
//        fetch('api/public/GetTransactions')
//            .then((response) => { return response.json() })
//            .then((json) => {
//                this.setState({ transactions: json });
//            });

//        //  this.setState({ currentCount: this.state.currentCount + 1 })
//    }

//    componentDidMount() {
//        var inttransaction = setInterval(() => this.gettransactions(), 6000);
//        // store intervalId in the state so it can be accessed later:
//        this.setState({ intervaltransaction: inttransaction });
//    }
//    componentWillUnmount() {
//        clearInterval(this.state.intervaltransaction);
//    }

//    public render() {
//        return <div>

//            <div className="table-responsive">
//                <table className="table table-hover table-striped table-condensed ">
//                    <thead>
//                        <tr>
//                            <th> </th>
//                            <th>Time</th>
//                            <th>Type</th>
//                            <th>Address</th>
//                            <th>Amount</th>
//                        </tr>
//                    </thead>
//                    <tbody>
//                        {this.state.transactions.map(tx =>

//                            <RowTx tx={tx} language={this.props.language} />
//                        )}
//                    </tbody>
//                </table>
//            </div>
//        </div>
//    }
//}