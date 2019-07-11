import { func } from "prop-types";

import { AssetClass } from '../MainPages/_Interfaces/Assets';
import { User } from '../MainPages/_Interfaces/iUser'
import * as statics from './statics'

//export const FamilyProvider = FamilyContext.Provider;
//export const FamilyConsumer = FamilyContext.Consumer;
var public_base: string = "https://smartchain.radiumcore.org/api/public/"
var private_base: string = "https://smartchain.radiumcore.org/api/auth/"

export function EncodeEditUser(_body: any, callback: any) {
    post_json('EncodeEditUser', _body, callback)
}

export function EncodeNewUser(_body: any, callback: any) {
    post_json('EncodeNewUser', _body, callback)
}

export function GetBlockByHash(hash: string, callback: any) {
    get_json('getblockbyhash/' + hash, callback)
}

export function EncodeFileHash(_body: any, callback: any) {
    post_json('EncodeFileHash', _body, callback)
}

export function GetAllRecords(callback: any) {
    get_json('GetAllRecords', callback)
}

export function GetFileHash(hash: string, callback: any) {
    get_json('GetFileHash/' + hash, callback)
}

export function GetNetworkInfo(callback: any) {
    get_json('getnetworkinfo', callback)
}
export function GetServerInfo(callback: any) {
    get_json('getserverinfo', callback)
}

export function GetFilteredFiles(_body: string, callback: any) {
    post_json('GetFilteredFiles', _body, callback)
}

export function GetMyInfo(_body: any, callback: any) {
    post_json_auth('getmyinfo', _body, callback)
}

export function GetAddressUtxos(address: string, callback: any) {
    get_json('getaddressutxos/' + address, callback)
}

export function GetFilteredElections(_body: string, callback: any) {
    post_json('GetFilteredElections', _body, callback)
}

export function GetAllElections(callback: any) {
    get_json('GetAllElections', callback)
}

export function GetElection(electionID: string, callback: any) {
    get_json('GetElection/' + electionID, callback)
}

export function EncodeNewElection(_body: any, callback: any) {
    post_json('EncodeNewElection', _body, callback)
}
export function EncodeNewVote(_body: any, callback: any) {
    post_json('EncodeNewVote', _body, callback)
}

export function GetAllAssets(callback: any) {
    get_json('GetAllAssets', callback)
}

export function GetAsset(assettxid: string, callback: any) {
    get_json('getasset/' + assettxid, callback)
}

export function EncodeNewAssetCommand(_body: any, callback: any) {
    post_json('encodenewassetcommand', _body, callback)
}

export function EncodeNewAsset(_body: any, callback: any) {
    post_json('EncodeNewAsset', _body, callback)
}

export function EncodeNewAssetClass(_body: any, callback: any) {
    post_json('encodenewassetclass', _body, callback)
}

export function FilterAsset(_body: string, callback: any) {
    post_json('GetFilteredAssets', _body, callback)
}
export function FilterAssetClass(_body: any, callback: any) {
    post_json('getfilteredassetclasses', _body,  callback)
}

export function SCTop(callback: any) {
    get_text("getsctop", callback);
}

export function gettopblock(callback: any) {
    get_json("gettopblock", callback);
}

export function GetUser(address: string, callback: any) {
    get_json('GetUser/' + address, callback)
}
export function GetAllUsers(callback: any) {
    get_json('getallusers', callback)
}

export function AllAssetClasses(callback: any) {
    get_json('getallassetclassses', callback)
}

export function FilteredAssetClasses(body: any, callback: any) {
    get_json('getallassetclassses', callback)
}

export function AssetClass(asset_ID: any, callback: any) {
    get_json('getassetclass/' + asset_ID, callback)
}

export function SendRawTx(_body: any, callback: any) {
    post_json('sendrawtx', _body, callback)
}

export function BuildSmartTx(_body: any, callback: any) {
    post_json_auth('BuildSmartTx', _body, callback)
}

export function FilteredUsers(_body: any, callback: any) {
    post_json('GetFilteredUsers', _body, callback)
}

export function GetSetupInfo(callback: any) {
    get_json('GetSetupInfo', callback);
}

export function SyncInfo(callback: any) {
    get_json('SyncInfo', callback);
}

export function DashboardInfo(callback: any) {
    get_json('GetDashboardInfo', callback);
}

function post_json(endpoint: string, _body: string, callback: any) {
    fetch(public_base + endpoint, {
        method: 'POST',
        headers: statics.requestHeaders,
        body: _body
    })
        .then(response => response.json())
        .then(data => {
            callback(data);
        });
}

function post_json_auth(endpoint: string, _body: string, callback: any) {
    fetch(private_base + endpoint, {
        method: 'POST',
        headers: statics.requestHeaders,
        body: _body
    })
        .then(response => response.json())
        .then(data => {
            callback(data);
        });
}

function get_json(endpoint: string, callback: any) {
    fetch(public_base + endpoint)
        .then((response) => { return response.json() })
        .then((json) => {
            callback(json);
        });
}
function get_text(endpoint: string, callback: any) {
    fetch(public_base + endpoint)
        .then((response) => { return response.text() })
        .then((json) => {
            callback(json);
        });
}