import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import * as crypto from "crypto-js";
import { sha256 } from 'js-sha256';
import { User } from '../_Interfaces/iUser'

interface Props {
    complete_callback: any;
    language: number;
}
interface HashFileComponentState {
    file_hash: string;
    file_title: string;
    status: string;
}

export class HashFileComponent extends React.Component<Props, HashFileComponentState>{
    constructor(props: Props) {
        super(props);
        this.state = {
            file_hash: "",
            file_title: "",
            status: "",
        };
    }

    complete(hash: string) {
        this.setState({ status: hash })
        this.props.complete_callback(hash)
    }

    handleFileRead(r: FileReader) {
        let content = r.result as string
        //let test =  sha256('The quick brown fox jumps over the lazy dog'); // d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592
        //let test2 = sha256(content) //"de31b927101c78389fa29361e6abee312a65b7a2baa28c09092774bc6ad71f6e"

        this.complete(sha256(content))
    }

    handlefilechosen(fi: FileList | null) {
        this.setState({ status: "Hashing..." })
        let fileReader = new FileReader();
        fileReader.onload = () => { this.handleFileRead(fileReader) };
        fileReader.readAsArrayBuffer(fi![0])
    }

    hash_progress_changed(ev: ProgressEvent) {
    }

    render() {
        return (
            <div >
                <div className="custom-file">
                    <input type="file" className="custom-file-input" id="customFile" onChange={evt => this.handlefilechosen(evt.target.files)} />
                    <span>{this.state.status}</span>
                </div>

                <p />
            </div>
        );
    }
}