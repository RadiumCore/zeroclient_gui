//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import t from '../../Language/Language'
//interface Props {
//    close_callback: any;
//    language: number;
//}
//interface GetNewAddressForMultisig_PopupState {
//    pubkey: pubkey_result;
//    loading: boolean;
//}

//export class GetNewAddressForMultisig_Popup extends React.Component<Props, GetNewAddressForMultisig_PopupState>{
//    constructor(props: Props) {
//        super(props);
//        this.state = {
//            pubkey: {
//                isvalid: false,
//                address: "",
//                ismine: false,
//                isscript: false,
//                pubkey: "",
//                iscompressed: false,
//                account: "",
//            },
//            loading: true
//        }
//        this.get_newpubkey()
//    }

//    get_newpubkey() {
//        fetch('api/public/GetNewValidatedAddress')
//            .then((response) => { return response.json() })
//            .then((json) => {
//                this.setState({ pubkey: json, loading: false });
//            });
//    }

//    valid_pass() {
//        this.props.close_callback(true)
//    }

//    render() {
//        let loading = this.render_loading();
//        let complete = this.render_complete();

//        if (this.state.loading) {
//            return <div className='popup'>
//                <div className='popup_inner'>
//                    <h1>Generating New Address and Pubkey, Please Wait</h1>
//                    <button onClick={() => { this.props.close_callback() }}>Close</button>
//                </div>
//            </div>
//        }

//        return <div className='popup'>
//            <div className='popup_inner_large'>

//                {complete}

//                <button onClick={() => { this.props.close_callback() }}>Close</button>
//            </div>
//        </div>
//    }

//    render_loading() {
//    }

//    render_complete() {
//        return <div>
//            <h1>Use the pubkey below for generating a new MultiSig address</h1>
//            <h3>PubKey:</h3>
//            <h4>{this.state.pubkey.pubkey}</h4>
//            <p></p>
//            <h3>Address:</h3>
//            <h4>{this.state.pubkey.address}</h4>
//            <p></p>
//            <h3>Account:</h3>
//            <h4>{this.state.pubkey.account}</h4>
//            <p></p>
//        </div>
//    }
//}
//interface pubkey_result {
//    isvalid: boolean,
//    address: string,
//    ismine: boolean,
//    isscript: boolean,
//    pubkey: string,
//    iscompressed: boolean,
//    account: string,
//}