import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../Language/Language'

import { Modal } from 'react-bootstrap'

interface state {
    interval: any;
    dot_count: number;
}
export interface Props {
    close_callback: any
}

export class LoadingModal extends React.Component<Props, state> {
    constructor(props: Props) {
        super(props);
        this.state = { interval: 250, dot_count: 0 };
    }

    componentDidMount() {
        var inttick = setInterval(() => this.tick(), 250);
        // store intervalId in the state so it can be accessed later:
        this.setState({ interval: inttick });
    }
    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    tick() {
        if (this.state.dot_count < 5) { this.setState({ dot_count: this.state.dot_count + 1 }) }
        else { this.setState({ dot_count: 1 }) }
    }

    getdots(): string {
        var dots = ""
        var i: number = 0
        for (i = 0; i > this.state.dot_count; i++) {
            dots + "."
        }
        return dots
    }

    render() {
        return <Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>Loading {this.getdots()} </Modal.Title>

            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button onClick={() => { this.props.close_callback() }}>Close</button>

                </div>

            </Modal.Footer>
        </Modal>
    }
}