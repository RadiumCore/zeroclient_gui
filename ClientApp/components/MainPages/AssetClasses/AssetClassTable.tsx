import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import t from '../../Language/Language'
import { Asset, blank_asset, blank_AssetClass } from '../_Interfaces/Assets'
import { AssetClassInfoPopup } from './AssetClassInfoPopup'
import * as Settings from '../../Global/settings'
import { UserInfoPopup } from '../Users/UserInfoPopup'
import { CreateGroupedAssetPopup } from "../AssetClasses/CreateGroupedAssetPopup"
import * as statics from '../../Global/statics'
import { AssetClass } from '../_Interfaces/Assets';
import * as api from '../../Global/API'
import { any } from 'prop-types';
interface State {
    classes: AssetClass[];
    class: AssetClass;
    assets: Asset[];
    rangestart: number;
    loading: boolean;
    SelectedAssetTxid: string;
    ShowAssetClass: boolean;

    verified: string;
    name: string;
    creator: string;
    id: string;
    description: string;
    intervaltick: any;
    sctop: string;
    show_all: boolean;
    selected_group: string;

    show_user: boolean;
    selected_user: string;

    show_create_asset: boolean;
}
export interface Props {
    defaultPageSize: number;
    showPagination: boolean;
    language: number;
    mobile: boolean;
}

export class AssetClassTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            classes: [], class: blank_AssetClass, assets: [], rangestart: 0, loading: true, ShowAssetClass: false,
            SelectedAssetTxid: "", verified: "", name: "", creator: "",
            id: "", description: "", intervaltick: 5000, sctop: "",
            show_all: false, selected_group: "",
            show_user: false,
            selected_user: "",
            show_create_asset: false,
        };

        this.load_data()
    }

    load_data() {
        if (this.state.show_all) {
            api.AllAssetClasses((data: any) => { this.setState({ classes: data, loading: false }); })
        }
        else {
            const body = JSON.stringify({
                name: "",
                creator: "",
                id: "",
                description: "",
                owner: Settings.current_identity.address,
            })

            api.FilteredAssetClasses(body, (data: any) => { this.setState({ classes: data, loading: false }); })
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
        this.setState({ ShowAssetClass: false })
    }

    OpenViewAsset(txid: string) {
        this.setState({ SelectedAssetTxid: txid, ShowAssetClass: true })
    }
    CloseViewUser() {
        this.setState({ show_user: false })
    }

    OpenViewUser(useraddress: string) {
        this.setState({ selected_user: useraddress, show_user: true })
    }

    CloseCreateAsset() {
        this.setState({ show_create_asset: false })
    }

    OpenCreateAsset() {
        this.setState({ show_create_asset: true })
    }

    ShowSingleGroup(txid: string) {
        const body = JSON.stringify({ groupid: txid })
        api.FilterAsset(body, (assets: any) => {
            api.AssetClass(txid, (class1: any) => {
                this.setState({ class: class1, assets: assets, selected_group: txid })
            })
        })
    }

    HideSingleGroup() {
        this.setState({ selected_group: "" })
    }
    public render() {
        let contents = <p><em>{t[this.props.language].Loading}</em></p>
        if (this.state.selected_group != "")
            contents = this.RenderGroupTable(this.state.selected_group);
        else
            contents = this.RenderAllTable();

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
        if (this.state.show_all) {
            const body = JSON.stringify({
                name: this.state.name,
                creator: this.state.creator,
                id: this.state.id,
                description: this.state.description,
                owner: "",
            })

            api.FilteredAssetClasses(body, (data: any) => { this.setState({ classes: data, loading: false }); })
        }
        else {
            const body = JSON.stringify({
                name: this.state.name,
                creator: this.state.creator,
                id: this.state.id,
                description: this.state.description,
                owner: Settings.current_identity.address,
            })
            api.FilteredAssetClasses(body, (data: any) => { this.setState({ classes: data, loading: false }); })
        }
    }
    //need to get the filter values into an interface to post

    public RenderAllTable() {
        const data = this.state.classes;
        const columns = [
            {
                Header: "Name",
                accessor: 'class_name'
            },
            {
                Header: t[this.props.language].Description,
                accessor: 'class_description'
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
                Show All Assets</label>
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
                            <input type="text" className="form-control" placeholder="Description" aria-describedby="basic-addon1" name="description" value={this.state.description} onChange={evt => this.handleInputChange(evt)}></input>
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
                            <input type="text" className="form-control" placeholder="Creator" aria-describedby="basic-addon1" name="creator" value={this.state.description} onChange={evt => this.handleInputChange(evt)}></input>
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
                            <span className="input-group-addon" id="basic-addon1">Description</span>
                            <input type="text" className="form-control" placeholder="Description" aria-describedby="basic-addon1" name="description" value={this.state.description} onChange={evt => this.handleInputChange(evt)}></input>
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
                                    this.ShowSingleGroup(rowInfo.row.txid)
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
                                    this.ShowSingleGroup(rowInfo.row.txid)
                                }
                            };
                        }}

                    />
                }

            </div>
            {this.state.ShowAssetClass ?
                < AssetClassInfoPopup assettxid={this.state.SelectedAssetTxid} close_callback={this.CloseViewAsset.bind(this)} language={this.props.language} />
                : null
            }
        </div>
    }

    public RenderGroupTable(txid: string) {
        const columns = [
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
            <h4>All Identities owning the {this.state.class.owner.username}.{this.state.class.class_name} asset</h4>

            <div className="row">
                <div className="form-group col-xs-4">
                    <button type="button" className="btn btn-default " onClick={this.HideSingleGroup.bind(this)} >Back</button>
                </div>
                <div className="form-group col-xs-4">
                    <button type="button" className="btn btn-default " onClick={() => { this.OpenViewAsset(this.state.class.txid) }} >View Class Details</button>

                </div>
                <div className="form-group col-xs-4">
                    {Settings.current_identity.address == this.state.class.owner.address ? <button type="button" className="btn btn-default " onClick={() => { this.OpenCreateAsset() }} >Create asset in this group</button>
                        : null}
                </div>

            </div>

            <div className="inside-table-div table table-responsive">

                {this.props.mobile ?
                    < ReactTable
                        data={this.state.assets} columns={columns} showPagination={false} defaultPageSize={-1} minRows={10} className="-highlight" loading={this.state.loading}
                        getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {
                            return {
                                onClick: () => {
                                    console.log("A Td Element was clicked!");
                                    this.OpenViewUser(rowInfo.row.txid)
                                }
                            };
                        }}

                    />
                    :
                    < ReactTable
                        data={this.state.assets} columns={columns} showPagination={false} defaultPageSize={-1} minRows={10} className="-highlight" loading={this.state.loading}
                        getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {
                            return {
                                onDoubleClick: () => {
                                    console.log("A Td Element was clicked!");
                                    this.OpenViewUser(rowInfo.row.txid)
                                }
                            };
                        }}

                    />
                }

            </div>
            {this.state.show_create_asset ?
                <CreateGroupedAssetPopup class={this.state.class} close_callback={this.CloseCreateAsset.bind(this)} language={this.props.language} />
                : null
            }
            {this.state.ShowAssetClass ?
                < AssetClassInfoPopup assettxid={this.state.SelectedAssetTxid} close_callback={this.CloseViewAsset.bind(this)} language={this.props.language} />
                : null
            }
            {this.state.show_user ?
                <UserInfoPopup address={this.state.selected_user} close_callback={this.CloseViewUser.bind(this)} language={this.props.language} />
                : null
            }
        </div>
    }
}