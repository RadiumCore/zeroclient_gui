//import * as React from 'react';
//import ReactTable from 'react-table';
//import 'react-table/react-table.css';
//import { RouteComponentProps } from 'react-router';
//import t from '../../Language/Language';
//import { CopyTextCell } from '../../Global/CopyTextCell';

//interface ReceivingState {
//    addresses: Address[];
//    intervaltransaction: any;
//    selected_index: number;
//    selected_address: string;
//}
//export interface Props {
//    selected_address: string;
//    language: number;
//}

//export class ReceivingTable extends React.Component<Props, ReceivingState> {
//    constructor(props: Props) {
//        super(props);
//        this.state = { addresses: [], intervaltransaction: [], selected_index: -1, selected_address: this.props.selected_address };
//        this.gettransactions();
//    }

//    gettransactions() {
//        fetch('api/public/GetReceiving')
//            .then((response) => { return response.json() })
//            .then((json) => {
//                this.setState({ addresses: json });
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
//    handleClick() { }
//    set_selected_index(index: number) {
//        // clear selected address incase it is set. Would be set in a case where it was passed on load/render from receiving page
//        //due to a new address being generated
//        this.setState({ selected_address: "" })
//        this.setState({ selected_index: index })
//        //  alert('selected row '+ index)
//    }

//    public render() {
//        const data = this.state.addresses

//        const columns = [{
//            Header: t[this.props.language].Label,
//            accessor: 'label', // String-based value accessors!
//            Cell: (row: any) => (
//                <tr> <CopyTextCell text={row.row.label} language={this.props.language} /> </tr>
//            )
//        }, {
//            Header: t[this.props.language].Address,
//            accessor: 'address',
//            Cell: (row: any) => (
//                <tr> <CopyTextCell text={row.row.address} language={this.props.language} /> </tr>
//            )
//        }]

//        let con = this.render_table.bind(this);

//        // return < ReactTable showPagination={false} data={data} columns={columns} />

//        return <div >

//            <ReactTable
//                getTdProps={(state: any, rowInfo: any, column: any) => {
//                    return {
//                        style: {
//                            background: this.state.selected_index === rowInfo.index ? '#F8A9FB' : this.props.selected_address === rowInfo.address ? '#F8A9FB' : null
//                        },

//                        onClick: (e: MouseEvent) => {
//                            console.log("A Td Element was clicked!");
//                            console.log("it produced this event:", e);
//                            console.log("It was in this column:", column);

//                            this.set_selected_index(rowInfo.index)

//                            // IMPORTANT! React-Table uses onClick internally to trigger
//                            // events like expanding SubComponents and pivots.
//                            // By default a custom 'onClick' handler will override this functionality.
//                            // If you want to fire the original onClick handler, call the
//                            // 'handleOriginal' function.
//                        }
//                    };
//                }}

//                className=" -highlight" showPagination={false} defaultPageSize={-1} data={data} columns={columns} />

//        </div>
//    }
//    render_table() {
//        return <div className="table table-responsive">
//            <table className="table table-hover table-striped table-condensed ">
//                <thead>
//                    <tr>
//                        <th>{t[this.props.language].Label}</th>
//                        <th>{t[this.props.language].Address}</th>
//                    </tr>
//                </thead>
//                <tbody>

//                </tbody>
//            </table>
//        </div>
//    }
//}

//interface Address {
//    address: string;
//    label: string;
//}