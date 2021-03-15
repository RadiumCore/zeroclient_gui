import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import t from '../../Language/Language'
import { CreateAssetPopup } from './CreateNFTPopup'
import { UnixToDate } from '../../Global/UnixToDate'
import { TrueFalseIcon } from '../../Global/TrueFalseIcon'
import { NFT } from '../_Interfaces/Assets'
import { AssetInfoPopup } from './NFTInfoPopup'
import * as Settings from '../../Global/settings'
import * as api from '../../Global/API'
import * as statics from '../../Global/statics'

interface State {
    assets: NFT[];
    rangestart: number;
    loading: boolean;
    SelectedAssetTxid: string;
    ShowAsset: boolean;

    verified: string;
    name: string;
    creator: string;
    id: string;
    groupid: string;
    intervaltick: any;
    sctop: string;
    show_all: boolean;
}
export interface Props {
    defaultPageSize: number;
    showPagination: boolean;
    language: number;
    mobile: boolean;
}

export class AssetTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            assets: [], rangestart: 0, loading: true, ShowAsset: false,
            SelectedAssetTxid: "", verified: "", name: "", creator: "",
            id: "", groupid: "", intervaltick: 5000, sctop: "",
            show_all: false,
        };

        this.load_data()
    }

    load_data() {
        if (this.state.show_all) {
            api.GetAllAssets((data: any) => { this.setState({ assets: data, loading: false }); })
        }
        else {
            const body = JSON.stringify({
                name: "",
                creator: "",
                id: "",
                description: "",
                owner: Settings.current_identity.address,
            })

            api.FilterAsset(body, (data: any) => { this.setState({ assets: data, loading: false }); })
        }
    }
    tick() {
        api.SCTop((data: any) => {
            if (data != this.state.sctop) {
                this.setState({ sctop: data });
                this.load_data()
            }
        })
    }

    componentDidMount() {
        var inttick = setInterval(() => this.tick(), 5000);
        // store intervalId in the state so it can be accessed later:
        this.setState({ intervaltick: inttick });
    }
    componentWillUnmount() {
        clearInterval(this.state.intervaltick);
    }

    CloseViewAsset(txid: string) {
        this.setState({ ShowAsset: false })
    }

    OpenViewAsset(txid: string) {
        this.setState({ SelectedAssetTxid: txid, ShowAsset: true })
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>{t[this.props.language].Loading}</em></p>
            : this.RenderAssetTable();

        return contents
    }

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value } as any, () => {
            this.filter()
        });
    }
    handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({ [name]: value } as any, () => {
            //this.filter()
        });
    }

    filter() {
        var owner: string = this.state.show_all ? "" : Settings.current_identity.address;
        const body = JSON.stringify({
            name: this.state.name,
            creator: this.state.creator,
            id: this.state.id,
            groupid: this.state.groupid,
            owner: owner,
        })
        api.FilterAsset(body, (data: any) => { this.setState({ assets: data, loading: false }); })
    }
    //need to get the filter values into an interface to post

    public RenderAssetTable() {
        const data = this.state.assets;
        const columns = [
            {
                Header: "Name",
                accessor: 'name'
            },
            {
                Header: t[this.props.language].Description,
                accessor: 'description'
            },
            {
                Header: "class",
                accessor: 'class.class_name'
            },
            {
                Header: "owner",
                accessor: 'owner.username'
            },
            {
                Header: "creator",
                accessor: 'creator.username'
            },
            {
                Header: "id",
                accessor: 'txid'
            },

        ]

        return <div className="outside-table-div">
            <h5>Filtering</h5>
            {Settings.current_identity.address == "" ? null : <label>
                <input type="checkbox" checked={this.state.show_all} onChange={e => {
                    this.setState({
                        show_all: !this.state.show_all
                    }, () => { this.filter() })
                }} />
                Show All NFTs</label>
            }
            {this.props.mobile ?

                <div className="row">
                    <div className="form-group col-xs-6">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Name</span>
                            <input type="text" className="form-control" placeholder="Username" aria-describedby="basic-addon1" name="name" value={this.state.name} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>
                    <div className="form-group col-xs-6">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Creator</span>
                            <input type="text" className="form-control" placeholder="Description" aria-describedby="basic-addon1" name="Creator" value={this.state.creator} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>

                </div>

                :
                <div className="row">
                    <div className="form-group col-xs-3">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Name</span>
                            <input type="text" className="form-control" placeholder="Name" aria-describedby="basic-addon1" name="name" value={this.state.name} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>
                    <div className="form-group col-xs-3">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Creator</span>
                            <input type="text" className="form-control" placeholder="Creator" aria-describedby="basic-addon1" name="creator" value={this.state.creator} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>
                    <div className="form-group col-xs-3">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">ID</span>
                            <input type="text" className="form-control" placeholder="ID" aria-describedby="basic-addon1" name="id" value={this.state.id} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>
                    <div className="form-group col-xs-3">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Group ID</span>
                            <input type="text" className="form-control" placeholder="GroupID" aria-describedby="basic-addon1" name="groupid" value={this.state.groupid} onChange={evt => this.handleInputChange(evt)}></input>
                        </div>
                    </div>
                </div>
            }

            <div className="inside-table-div table table-responsive">

                {this.props.mobile ?
                    < ReactTable
                        data={data} columns={columns} showPagination={false} defaultPageSize={-1} minRows={10} className="-highlight" loading={this.state.loading}
                        getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {
                            return {
                                onClick: () => {
                                    console.log("A Td Element was clicked!");
                                    this.OpenViewAsset(rowInfo.row.txid)
                                }
                            };
                        }}

                    />
                    :
                    < ReactTable
                        data={data} columns={columns} showPagination={false} defaultPageSize={-1} minRows={10} className="-highlight" loading={this.state.loading}
                        getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {
                            return {
                                onDoubleClick: () => {
                                    console.log("A Td Element was clicked!");
                                    this.OpenViewAsset(rowInfo.row.txid)
                                }
                            };
                        }}

                    />
                }

            </div>
            {this.state.ShowAsset ?
                < AssetInfoPopup assettxid={this.state.SelectedAssetTxid} close_callback={this.CloseViewAsset.bind(this)} language={this.props.language} />
                : null
            }
        </div>
    }
}