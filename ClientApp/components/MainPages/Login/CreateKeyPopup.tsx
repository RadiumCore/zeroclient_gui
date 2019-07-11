import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import { Modal } from 'react-bootstrap'
import { InfoPopup } from '../../Global/InfoPopup'
import * as settings from "../../Global/settings"
import { CopyButton } from '../../Global/CopyButton'

import { ECPair, networks } from 'radiumjs-lib'

interface Props {
    close_callback: any;
    language: number;
}
interface state {
    show_key: boolean
}
export class CreateKeyPopup extends React.Component<Props, state>{
    constructor(props: Props) {
        super(props);
        this.state = {
            show_key: false,
        };
    }
    //required for security, set pass to null

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value } as any);
    }

    show_make_key() {
        this.setState({ show_key: true })
    }
    close() {
        this.props.close_callback()
    }

    make_key(): string {
        const keyPair = ECPair.makeRandom({ network: networks.radium })

        return keyPair.toWIF()
    }
    select_content() {
        if (!this.state.show_key) {
            let content = this.return_warning();

            return (content)
        }
        else {
            let content = this.return_key();
            return (content)
        }
    }

    return_warning() {
        return (<Modal backdrop={"static"} show={true} onHide={this.props.close_callback}>
            <Modal.Header closeButton>
                <Modal.Title>Private Key Generation</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <h5> The key you are about to generate grants control over your account.
                    Do not share the key with anyone, ever. Account keys cannot be changed, replaced, or reset.
                    If you lose your key, you lose access to your account. Nobody can recover your key if you lose it.</h5>

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">

                    <button type="button" className="btn btn-default btn-success" onClick={this.show_make_key.bind(this)}>Create</button>
                    <button type="button" className="btn btn-default btn-danger" onClick={this.close.bind(this)}>Close</button>
                </div>
            </Modal.Footer>
        </Modal>
        )
    }

    return_key() {
        var key: string = this.make_key()
        return (<Modal backdrop={"static"} show={true} onHide={this.props.close_callback}>
            <Modal.Header closeButton>
                <Modal.Title> Below is your key. Keep it safe!</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <h2></h2>
                <h5> {key} </h5>
                <h4>  </h4>

            </Modal.Body>
            <Modal.Footer>

                <button type="button" className="btn btn-danger" onClick={this.close.bind(this)}>Close</button>
            </Modal.Footer>
        </Modal>
        )
    }

    render() {
        let content = this.select_content()

        return (content)
    }
}

interface iText {
    text: string;
}

interface result {
    hex: string
    cost: number
}