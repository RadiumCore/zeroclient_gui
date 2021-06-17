import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { blank_user, User } from '../_Interfaces/iUser'
import { Modal } from 'react-bootstrap'
import * as api from '../../Global/API'
import { LoadingModal } from '../../Global/LoadingModal'
import * as statics from '../../Global/statics'
import { UnixToDate } from '../../Global/UnixToDate'
const icon48 = require('../../../../Assets/radium-48.png');
import { iFileHash, blank_hash } from '../_Interfaces/iFileHash'
import * as H from 'history';
interface state {
    title: string;
    user: User
    loading: boolean;
    username: string;
}
interface Props {
    
    location: string;
}
export class Standalone_User extends React.Component<Props, state> {
    constructor(props: Props) {
        super(props);
        this.state = {
            title: "",
            user: blank_user,
            loading: true,
            username: ""
        };

        var start: number = this.props.location.lastIndexOf("=") + 1;
        var end: number = this.props.location.length;

        api.GetUserFromName(this.props.location.substring(start, end), (data: any) => {
            this.setState({ user: data, loading: false });
        })
    }

    get_content() {
        if (this.state.loading) {
            return <LoadingModal close_callback={null} />
        }

        if (this.state.user.address == "") {
            return this.render_fail()
        }
        else { return this.render_sucess() }
    }

    render_fail() {
        return <Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title> <h4>Unknown File! Procede with caution </h4></Modal.Title>

            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    }
    render_sucess() {
        const prof_url = "https://ipfs.io/ipfs/" + this.state.user.profile_immage
        return <Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <div className="col-md-4">
                    {this.state.user.profile_immage != null ? <img src={prof_url} alt={icon48} className="img-responsive img-thumbnail" /> : null}
                </div>
                <div className="col-md-8">
                    <Modal.Title>{this.state.user.username}</Modal.Title>
                </div>
            </Modal.Header>
            <Modal.Body>

                {!this.state.loading ?
                    <dl className="dl-horizontal">

                        <dt>Address :</dt><dd>{this.state.user.address}</dd>
                        {this.Should_show(this.state.user.description) ? <span><dt>{t[0].Description} :</dt> <dd>{this.state.user.description}</dd></span> : null}
                        {this.Should_show(this.state.user.company) ? <span><dt>{t[0].Company} :</dt> <dd>{this.state.user.company}</dd></span> : null}
                        {this.Should_show(this.state.user.streetaddress) ? <span><dt>{t[0].StreetAddress} :</dt> <dd>{this.state.user.streetaddress}</dd></span> : null}
                        {this.Should_show(this.state.user.phone) ? <span><dt>{t[0].Phone} :</dt> <dd>{this.state.user.phone}</dd></span> : null}
                        {this.Should_show(this.state.user.email) ? <span><dt>{t[0].Email} :</dt> <dd>{this.state.user.email}</dd></span> : null}
                        {this.Should_show(this.state.user.website) ? <span><dt>{t[0].Website} :</dt> <dd>{this.state.user.website}</dd></span> : null}

                        {this.state.user.custom_fields.map(custom =>
                            <span><dt>{custom.key} :</dt> <dd>{custom.value}</dd></span>

                        )}

                        <dt>Join Date :</dt> <dd><UnixToDate unix={this.state.user.unixtime} /></dd>

                    </dl>

                    : 'loading...'}
            </Modal.Body>
            <Modal.Footer>
                <div><h5>Blockchain secured record validation services provided by <a href="https://validitytech.com"> Validity Platform </a>  </h5></div>
                <div> Developed and maintaind by SmartchainSoftware Solutions, LLC.</div>
            </Modal.Footer>
        </Modal>
    }

    Should_show(st: string): boolean {
        if (typeof (st) == 'string' && st.length > 0)
            return true;

        return false
    }

    render() {
        let content = this.get_content()
        return content
    }
}
interface result {
    hex: string
    cost: number
}