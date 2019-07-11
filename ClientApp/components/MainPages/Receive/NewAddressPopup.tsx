//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import t from '../../Language/Language'
//import { CopyTextCell } from '../../Global/CopyTextCell';

//interface Props {
//    close_callback: any;
//    language: number;
//}
//interface UserInfoPopupState {
//    address: string;
//    label: string;
//    gen_complete: boolean;
//}

//export class NewAddressPopup extends React.Component<Props, UserInfoPopupState>{
//    constructor(props: Props) {
//        super(props);
//        this.state = { address: '', label: '', gen_complete: false }
//    };

//    //required for security, set pass to null

//    close() {
//        this.props.close_callback(this.state.address)
//    }

//    get_new() {
//        fetch('api/public/GetNewAddress/' + this.state.label)
//            .then((response) => { return response.text() })
//            .then((text) => {
//                this.setState({ address: text });
//            });
//    }

//    update_label(e: React.ChangeEvent<HTMLInputElement>) {
//        this.setState({ label: e.target.value });
//    }

//    render() {
//        return (
//            <div className='popup'>
//                <div className='popup_inner'>

//                    <div className="input-group">
//                        <span className="input-group-addon">{t[this.props.language].Label}</span>
//                        <input onChange={evt => this.update_label(evt)} type="text" className="form-control" name="msg" placeholder='optional' />
//                    </div>

//                    <p />

//                    {this.state.address != '' ?
//                        <dl className="dl-horizontal">
//                            <dt>{t[this.props.language].Address} :</dt><dd><CopyTextCell text={this.state.address} language={this.props.language} /></dd>
//                        </dl>
//                        : null
//                    }

//                    <button onClick={() => { this.get_new() }}>Generate New Address</button>     <button onClick={() => { this.props.close_callback(this.state.address) }}>Close</button>

//                </div>
//            </div>
//        );
//    }
//}

//interface Address {
//    address: string
//    label: string
//}