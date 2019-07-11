import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../Language/Language'
import { Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker';

interface Props {
    language: number;
}
interface MyDatePickerState {
    data: string;
}

export class MyDatePicker extends React.Component<Props, MyDatePickerState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            data: ""
        };
    }
    //required for security, set pass to null

    key_up(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
        }
    }

    handle_date_Change(date: any, e: any) {
        this.setState({
        });
    }

    render() {
        return (<Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>Pick a date</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <DatePicker
                    //selected={this.state.handle_date_Change}
                    onChange={this.handle_date_Change}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="LLL"
                    timeCaption="time"

                    inline
                />
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-default "> </button>
            </Modal.Footer>
        </Modal>

        )
    }
}