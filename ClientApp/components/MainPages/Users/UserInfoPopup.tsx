import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import { User, blank_user } from '../_Interfaces/iUser'
import { Modal } from 'react-bootstrap'
import { UnixToDate } from '../../Global/UnixToDate'
const icon48 = require('../../../../Assets/radium-48.png');
import * as api from '../../Global/API'
interface Props {
    address: string;

    close_callback: any;
    language: number;
}
interface UserInfoPopupState {
    user: User
    load_complete: boolean
}
export class UserInfoPopup extends React.Component<Props, UserInfoPopupState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            user: blank_user, load_complete: false
        };
        api.GetUser(this.props.address, (data: any) => { this.setState({ user: data, load_complete: true }); })
    }
    //required for security, set pass to null

    close() {
        this.props.close_callback(true)
    }

    Should_show(st: string): boolean {
        if (typeof (st) == 'string' && st.length > 0)
            return true;

        return false
    }

    render() {
        const prof_url = "https://ipfs.io/ipfs/" + this.state.user.profile_immage
        return (
            <Modal show={true} onHide={() => { this.props.close_callback() }}>
                <Modal.Header closeButton>
                    <div className="col-md-4">
                        {this.state.user.profile_immage != null ? <img src={prof_url} alt={icon48} className="img-responsive img-thumbnail" /> : null}
                    </div>
                    <div className="col-md-8">
                        <Modal.Title>{this.state.user.username}</Modal.Title>
                    </div>
                </Modal.Header>
                <Modal.Body>

                    {this.state.load_complete ?
                        <dl className="dl-horizontal">

                            <dt>{t[this.props.language].Address} :</dt><dd>{this.state.user.address}</dd>
                            {this.Should_show(this.state.user.description) ? <span><dt>{t[this.props.language].Description} :</dt> <dd>{this.state.user.description}</dd></span> : null}
                            {this.Should_show(this.state.user.company) ? <span><dt>{t[this.props.language].Company} :</dt> <dd>{this.state.user.company}</dd></span> : null}
                            {this.Should_show(this.state.user.streetaddress) ? <span><dt>{t[this.props.language].StreetAddress} :</dt> <dd>{this.state.user.streetaddress}</dd></span> : null}
                            {this.Should_show(this.state.user.phone) ? <span><dt>{t[this.props.language].Phone} :</dt> <dd>{this.state.user.phone}</dd></span> : null}
                            {this.Should_show(this.state.user.email) ? <span><dt>{t[this.props.language].Email} :</dt> <dd>{this.state.user.email}</dd></span> : null}
                            {this.Should_show(this.state.user.website) ? <span><dt>{t[this.props.language].Website} :</dt> <dd>{this.state.user.website}</dd></span> : null}

                            {this.state.user.custom_fields.map(custom =>
                                <span><dt>{custom.key} :</dt> <dd>{custom.value}</dd></span>

                            )}

                            <dt>{t[this.props.language].Join_Date} :</dt> <dd><UnixToDate unix={this.state.user.unixtime} /></dd>

                        </dl>

                        : 'loading...'}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-default btn-danger" onClick={() => { this.props.close_callback() }}>{t[this.props.language].Cancel}</button>
                </Modal.Footer>
            </Modal>

        );
    }
}