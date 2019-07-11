//import * as React from 'react';
//import { RouteComponentProps } from 'react-router';
//import t from '../Language/Language'
//import { Modal } from 'react-bootstrap'
//import * as settings from '../Global/settings'

//import * as statics from '../Global/statics'
//interface Props {
//    close_password: any;
//    callback: any;
//    language: number;
//    show_popup: boolean;
//    staking_only?: boolean;
//}
//interface PasswordPopupState {
//    key: string;
//    invalid_password: boolean;
//}

//export class PasswordPopup extends React.Component<Props, PasswordPopupState>{
//    public static defaultProps: Partial<Props> = {
//        staking_only: false
//    };

//    constructor(props: Props) {
//        super(props);
//        this.state = {
//            key: "",
//            invalid_password: false,
//        };
//        console.log(this.state)

//        this.valid_pass()
//    }
//    //required for security, set pass to null
//    componentWillUnmount() {
//        this.setState({ key: "" })
//    }

//    check_key() {
//        this.setState({});

//        fetch('http://127.0.0.1:7777/api/SampleData/UnlockWallet', {
//            method: 'POST',
//            headers: statics.requestHeaders,
//            body: JSON.stringify({
//                pass: this.state.key,
//                time: this.props.staking_only ? 31622400 : 3,
//                staking: this.props.staking_only,
//            })
//        })
//            .then(response => response.json() as Promise<bool_result>)
//            .then((data) => {
//                if (data.result) {
//                } else {
//                }
//            });
//    }

//    valid_pass() {
//        var pass = this.state.key
//        this.setState
//    }

//    close() {
//        ;
//    }

//    key_up(e: React.KeyboardEvent<HTMLInputElement>) {
//        if (e.key === 'Enter') {
//        }
//    }
//    handle_change(e: React.ChangeEvent<HTMLInputElement>) {
//        const target = e.target;
//        const value = target.type === 'checkbox' ? target.checked : target.value;
//        this.setState({ show_invalid: false, pass: value } as any)
//    }

//    render() {
//        console.log("render")
//        console.log(this.state)
//        return <Modal show={this.props.show_popup} onHide={this.props.close_password}>
//            <Modal.Header closeButton>
//                <Modal.Title>{t[this.props.language].Please_Enter_Your_Password}</Modal.Title>
//            </Modal.Header>
//            <Modal.Body>
//                <div> <input type="password" onKeyPress={evt => this.key_up(evt)} onChange={evt => this.handle_change(evt)} /></div>
//                {this.state.invalid_password ? <p>Invalid password</p> : ""}
//            </Modal.Body>
//            <Modal.Footer>
//                <button onClick={() => { this.valid_pass() }} >{t[this.props.language].Continue}</button>
//                <button onClick={() => { this.props.close_password() }}>{t[this.props.language].Cancel}</button>
//            </Modal.Footer>
//        </Modal>
//    }
//}
//interface bool_result {
//    result: boolean
//}