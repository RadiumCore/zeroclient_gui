//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import { TransactionTable } from './TransactionTable';
//import t from '../../Language/Language'

//interface SendState {
//    loading: boolean;
//    language: number;
//}

//export class Transactions extends React.Component<RouteComponentProps<{}> | undefined, SendState> {
//    constructor(props: RouteComponentProps<{}> | undefined) {
//        super(props);
//        this.state = { loading: false, language: 0 };
//    }

//    public render() {
//        return <div>
//            <h2>{t[this.state.language].Transaction_History}</h2>
//            <TransactionTable defaultPageSize={15} showPagination={true} language={this.state.language} />
//        </div>
//    }
//}