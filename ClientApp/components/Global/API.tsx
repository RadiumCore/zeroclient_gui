import { AssetClass } from '../MainPages/_Interfaces/Assets';
import * as statics from './statics'
import { Block } from '../MainPages/_Interfaces/iBLock'

export var pub_base: string = "/api/public/";
var priv_base: string = "/api/auth/";
var utxo_base: string = "/api/utxo/"

//export function SetApi(callback: any) {

//    fetch("api_servers")
//        .then(response => response.json() as Promise<string[]>)
//        .then((json) => {
//            json.forEach(
//                function iterator(item) {
//                    check_fetch_api(item, callback);
//                },
//            )
//        });
//}

//function check_fetch_api(endpoint: string, callback: any) {
//    fetch(endpoint + "/api/public/gettopblock")
//        .then(response => response.json() as Promise<Block>)
//        .then((json) => {
//            if (json.height > 500000)
//                if (pub_base == "") {
//                    pub_base = endpoint + "/api/public/"
//                        priv_base = endpoint + "/api/auth/"
//                    callback(true);
//                }

//        });
//}



export function GetBestAPI(callback: any) {
    pub_get_json('SetAPI', callback)
}


export function PostNewMultisig(_body: any, callback: any) {
    pub_post_json('PostNewMultisig', _body, callback)
}
export function PostCreateRawTransaction(_body: any, callback: any) {
    pub_post_json('PostCreateRawTransaction', _body, callback)
}
export function GetInputValue(_body: any, callback: any) {
    pub_post_json('GetInputValue', _body, callback)
}

export function EncodeEditUser(_body: any, callback: any) {
    pub_post_json('EncodeEditUser', _body, callback)
}

export function EncodeNewUser(_body: any, callback: any) {
    pub_post_json('EncodeNewUser', _body, callback)
}

export function GetBlockByHash(hash: string, callback: any) {
    pub_get_json('getblockbyhash/' + hash, callback)
}

export function EncodeFileHash(_body: any, callback: any) {
    pub_post_json('EncodeFileHash', _body, callback)
}

export function GetAllRecords(callback: any) {
    pub_get_json('GetAllRecords', callback)
}

export function GetFileHash(hash: string, callback: any) {
    pub_get_json('GetFileHash/' + hash, callback)
}

export function GetNetworkInfo(callback: any) {
    pub_get_json('getnetworkinfo', callback)
}
export function GetServerInfo(callback: any) {
    pub_get_json('getserverinfo', callback)
}

export function GetFilteredFiles(_body: string, callback: any) {
    pub_post_json('GetFilteredFiles', _body, callback)
}

export function GetMyInfo(_body: any, callback: any) {
    auth_post_json('getmyinfo', _body, callback)
}

export function GetAddressUtxos(address: string, callback: any) {
    pub_get_json('getaddressutxos/' + address, callback)
}

export function GetFilteredElections(_body: string, callback: any) {
    pub_post_json('GetFilteredElections', _body, callback)
}

export function GetAllElections(callback: any) {
    pub_get_json('GetAllElections', callback)
}

export function GetElection(electionID: string, callback: any) {
    pub_get_json('GetElection/' + electionID, callback)
}

export function EncodeNewElection(_body: any, callback: any) {
    pub_post_json('EncodeNewElection', _body, callback)
}
export function EncodeNewVote(_body: any, callback: any) {
    pub_post_json('EncodeNewVote', _body, callback)
}

export function GetAllAssets(callback: any) {
    pub_get_json('GetAllAssets', callback)
}

export function GetAsset(assettxid: string, callback: any) {
    pub_get_json('getasset/' + assettxid, callback)
}

export function EncodeNewAssetCommand(_body: any, callback: any) {
    pub_post_json('encodenewassetcommand', _body, callback)
}

export function EncodeNewAsset(_body: any, callback: any) {
    pub_post_json('EncodeNewAsset', _body, callback)
}

export function EncodeNewAssetClass(_body: any, callback: any) {
    pub_post_json('encodenewassetclass', _body, callback)
}

export function FilterAsset(_body: string, callback: any) {
    pub_post_json('GetFilteredAssets', _body, callback)
}
export function FilterAssetClass(_body: any, callback: any) {
    pub_post_json('getfilteredassetclasses', _body,  callback)
}

export function SCTop(callback: any) {
    pub_get_json("sctop", callback);
}

export function gettopblock(callback: any) {
    pub_get_json("gettopblock", callback);
}

export function GetUser(address: string, callback: any) {
    pub_get_json('GetUser/' + address, callback)
}
export function GetAllUsers(callback: any) {
    pub_get_json('getallusers', callback)
}

export function AllAssetClasses(callback: any) {
    pub_get_json('getallassetclassses', callback)
}

export function FilteredAssetClasses(body: any, callback: any) {
    pub_get_json('getallassetclassses', callback)
}

export function AssetClass(asset_ID: any, callback: any) {
    pub_get_json('getassetclass/' + asset_ID, callback)
}

export function SendRawTx(_body: any, callback: any) {
    pub_post_json('sendrawtx', _body, callback)
}

export function BuildSmartTx(_body: any, callback: any) {
    auth_post_json('BuildSmartTx', _body, callback)
}

export function FilteredUsers(_body: any, callback: any) {
    pub_post_json('GetFilteredUsers', _body, callback)
}

export function GetSetupInfo(callback: any) {
    pub_get_json('GetSetupInfo', callback);
}

export function SyncInfo(callback: any) {
    pub_get_json('SyncInfo', callback);
}

export function DashboardInfo(callback: any) {
    pub_get_json('GetDashboardInfo', callback);
}

function pub_post_json(endpoint: string, _body: string, callback: any) {
    fetch(pub_base + endpoint, {
        method: 'POST',
        headers: statics.requestHeaders,
        body: _body
    })
        .then(response => response.json())
        .then(data => {
            callback(data);
        });
}

function auth_post_json(endpoint: string, _body: string, callback: any) {
    fetch(priv_base + endpoint, {
        method: 'POST',
        headers: statics.requestHeaders,
        body: _body
    })
        .then(response => response.json())
        .then(data => {
            callback(data);
        });
}

function pub_get_json(endpoint: string, callback: any) {
    fetch(pub_base + endpoint)
        .then((response) => { return response.json() })
        .then((json) => {
            callback(json);
        });
}
function pub_get_text(endpoint: string, callback: any) {
    fetch(pub_base + endpoint)
        .then((response) => { return response.text() })
        .then((json) => {
            callback(json);
        });
}