//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import t from '../../Language/Language';
//import { BuildTransactionComponent } from './BuildTxComponent'
//import { MakeMultiSigComponent } from './MakeMultiSigComponent'
//import { DecodeTxComponent } from './DecodeTxComponent'

////import * as radium from 'radium-lib'
//interface SendState {
//    popup: any
//    show_popup: boolean
//    language: number
//}
//interface Props {
//}

//export class Tools extends React.Component<RouteComponentProps<{}> | undefined, SendState> {
//    constructor(props: RouteComponentProps<{}> | undefined) {
//        super(props);

//        this.state = {
//            popup: "",
//            show_popup: false,
//            language: 0,
//        };
//    }

//    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
//        const target = e.target;
//        const value = target.type === 'checkbox' ? target.checked : target.value;
//        const name = target.name;

//        this.setState({ [name]: value } as any);
//    }

//    public render() {
//        if (this.state.show_popup) {
//            return this.state.popup
//        }

//        return <div className='container-fluid'>
//            <div className='row'>
//                <div className='col-xs-12 col-md-4'>
//                    <button type="button" className="btn btn-default" onClick={() => { this.setState({ popup: <BuildTransactionComponent language={this.state.language} close_callback={() => { this.setState({ show_popup: false }) }} />, show_popup: true }) }} >Build Transaction</button>
//                </div>
//                <div className='col-xs-12 col-md-4'>
//                    <button type="button" className="btn btn-default" onClick={() => { this.setState({ popup: <MakeMultiSigComponent language={this.state.language} close_callback={() => { this.setState({ show_popup: false }) }} />, show_popup: true }) }} >Build Multisig Address</button>
//                </div>
//                <div className='col-xs-12 col-md-4'>
//                </div>
//            </div>
//            <div className='row'>
//                <div className='col-xs-12 col-md-4'>4</div>
//                <div className='col-xs-12 col-md-4'>5</div>
//                <div className='col-xs-12 col-md-4'>6</div>
//            </div>
//            <div className='row'>
//                <div className='col-xs-12 col-md-4'>7</div>
//                <div className='col-xs-12 col-md-4'>8</div>
//                <div className='col-xs-12 col-md-4'>9</div>
//            </div>
//        </div>
//    }
//}