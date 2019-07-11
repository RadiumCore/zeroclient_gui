import * as React from 'react';
export interface iTransaction {
    address: string
    account: string
    actionaddress: string
    catagory: string
    txid: string
    totalvalue: number
    fee: number
    confirmations: number
    blocktime: number
    time: number
}