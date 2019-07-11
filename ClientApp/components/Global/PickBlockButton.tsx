import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../Language/Language'
import { Modal } from 'react-bootstrap'
import * as settings from './settings'
import { DesktopData, } from '../MainPages/_Interfaces/DesktopInterfaces'
import { UnixToDate } from '../Global/UnixToDate'
import * as statics from '../Global/statics'
import * as api from '../Global/API'
interface Props {
    return_callback: any;
    button_text: string;
}
interface state {
    show_picker: boolean;

    minutes: number;
    hours: number;
    days: number;
    future_past: string;
    unix_date: number,
    block: number,
    data: DesktopData;
}

export class PickBlockButton extends React.Component<Props, state>{
    constructor(props: Props) {
        super(props);
        this.state = {
            show_picker: false,
            minutes: 0,
            hours: 0,
            days: 0,
            future_past: "future",
            unix_date: 0,
            block: 0,
            data: {
                spendable: 0,
                stake: 0,
                unconfirmed: 0,
                total: 0,
                NetworkSynced: false,
                NetworkBlock: 0,
                WalletConnected: false,
                SmartChainBlock: 0,
                SmartChainSynced: false,
                peercount: 0,
                transactions: {},
                EstNetworkBlocks: 0,
            }
        };
        api.DashboardInfo((json: any) => { this.setState({ data: json }); })
    }
    //required for security, set pass to null

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value } as any, () => this.calculate());
    }
    handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({ [name]: value } as any, () => this.calculate());
    }

    calculate() {
        let blocks: number = this.state.data.NetworkBlock;
        let unix: number = 0;
        let span: number = 0
        span = this.state.minutes
        span = Number(this.state.hours * 60) + Number(span)
        span = Number(this.state.days * 1440) + Number(span)

        const d: Date = new Date();
        if (this.state.future_past == "future") {
            blocks = (blocks + span)
            unix = (d.getTime() / 1000)
            unix = unix + (span * 60)
        }
        else {
            blocks = (blocks - span)
            unix = (d.getTime() / 1000)
            unix = unix - (span * 60)
        }

        this.setState({ block: blocks, unix_date: unix })
        this.props.return_callback(blocks, d.getTime())
    }

    close_picker() {
        this.setState({ show_picker: false })
        this.props.return_callback(this.state.block, this.state.unix_date)
    }

    select_content() {
        if (this.state.show_picker) {
            return this.render_picker()
        }
        else {
            return this.render_button()
        }
    }

    render() {
        let content = this.select_content()
        return (content)
    }

    render_button() {
        return <button type="button" className="btn btn-danger " aria-describedby="basic-addon1" name="title" value={this.state.block} onClick={() => { this.setState({ show_picker: true }) }}  >{this.props.button_text}</button>
    }

    render_picker() {
        console.log(this.state)
        return <Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>Select a Date</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <div className="row">
                    <div className="form-group col-xs-6">
                        <div className="input-group">
                            <input type="number" className="form-control" aria-describedby="basic-addon1" name="minutes" value={this.state.minutes} onChange={evt => this.handleInputChange(evt)} ></input>
                            <span className="input-group-addon" id="basic-addon1">Minutes</span>
                        </div>

                        <div className="input-group">
                            <input type="number" className="form-control" aria-describedby="basic-addon1" name="hours" value={this.state.hours} onChange={evt => this.handleInputChange(evt)} ></input>
                            <span className="input-group-addon" id="basic-addon1">Hours</span>
                        </div>

                        <div className="input-group">
                            <input type="number" className="form-control" aria-describedby="basic-addon1" name="days" value={this.state.days} onChange={evt => this.handleInputChange(evt)} ></input>

                            <span className="input-group-addon" id="basic-addon1">Days</span>

                        </div>

                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">In the:</span>
                            <select className="form-control" aria-describedby="basic-addon1" id="sel1" name="future_past" value={this.state.future_past} onChange={evt => this.handleSelectChange(evt)}>
                                <option>Future</option>
                                <option>Past</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group col-xs-6">
                        <dl className="dl-horizontal">

                            <dt>Selected Date</dt><dd> <UnixToDate unix={this.state.unix_date} /></dd>
                            <dt>Block</dt><dd> {this.state.block}</dd>

                        </dl>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>

                <button type="button" className="btn btn-default btn-warning" onClick={() => { this.setState({ show_picker: false }) }}>Close</button>

            </Modal.Footer>
        </Modal>
    }
}
interface bool_result {
    result: boolean
}