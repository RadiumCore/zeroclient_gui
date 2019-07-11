import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import { User } from '../_Interfaces/iUser'
import { Modal } from 'react-bootstrap'
import { InfoPopup } from '../../Global/InfoPopup'
import * as api from '../../Global/API'
import * as statics from '../../Global/statics'
interface Props {
    user: User

    cancel_callback: any;
    continue_callback: any;
    language: number;
}
interface CreateUserPopupConfirmationState {
    encoding_result: result;
}
export class EditUserPopupConfirmation extends React.Component<Props, CreateUserPopupConfirmationState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            encoding_result: {
                sucess: false,
                message: "",
                hex: "",
                cost: 0,
            }
        };
        const body = JSON.stringify({
            user: this.props.user,
        })
        api.EncodeEditUser(body, (data: any) => { this.setState({ encoding_result: data }); })
    }
    //required for security, set pass to null

    Should_show(st: string): boolean {
        if (typeof (st) == 'string' && st.length > 0)
            return true;

        return false
    }

    render() {
        if (!this.state.encoding_result.sucess) {
            return <InfoPopup title={'Error'} info={this.state.encoding_result.message} close_callback={this.props.cancel_callback} show_popup={true} language={this.props.language} />
        }

        return (<Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>

                <dl className="dl-horizontal">
                    <dt>{t[this.props.language].Username} :</dt> <dd>{this.props.user.username}</dd>
                    <dt>{t[this.props.language].Address} :</dt><dd>{this.props.user.address}</dd>
                </dl>
                <Modal.Title>Please ensure the following new values are correct!</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <dl className="dl-horizontal">
                    {this.Should_show(this.props.user.profile_immage) ? <span><dt>Profile Immage Hash :</dt> <dd>{this.props.user.profile_immage}</dd></span> : null}

                    {this.Should_show(this.props.user.description) ? <span><dt>{t[this.props.language].Description} :</dt> <dd>{this.props.user.description}</dd></span> : null}
                    {this.Should_show(this.props.user.company) ? <span><dt>{t[this.props.language].Company} :</dt> <dd>{this.props.user.company}</dd></span> : null}
                    {this.Should_show(this.props.user.streetaddress) ? <span><dt>{t[this.props.language].StreetAddress} :</dt> <dd>{this.props.user.streetaddress}</dd></span> : null}
                    {this.Should_show(this.props.user.phone) ? <span><dt>{t[this.props.language].Phone} :</dt> <dd>{this.props.user.phone}</dd></span> : null}
                    {this.Should_show(this.props.user.email) ? <span><dt>{t[this.props.language].Email} :</dt> <dd>{this.props.user.email}</dd></span> : null}
                    {this.Should_show(this.props.user.website) ? <span><dt>{t[this.props.language].Website} :</dt> <dd>{this.props.user.website}</dd></span> : null}
                </dl>
                {this.props.user.custom_fields.map(custom =>
                    <span><dt>{custom.key} :</dt> <dd>{custom.value}</dd></span>

                )}

                <h4>The cost for this operation is {this.state.encoding_result.cost} Radium. Are you sure?</h4>

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button type="button" className="btn btn-default btn-danger" onClick={() => { this.props.cancel_callback() }}>Close</button>

                    <button type="button" className="btn btn-default btn-success" onClick={() => { this.props.continue_callback(this.state.encoding_result) }}>Create</button>
                </div>

            </Modal.Footer>
        </Modal>

        );
    }
}

interface result {
    sucess: boolean
    message: string
    hex: string
    cost: number
}