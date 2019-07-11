import * as React from 'react';
export interface iFileHash {
    title: string;
    hash: string;
    creator: string;
    unixtime: number;
    username: string;
    txid: string;
    block: number;
}

export const blank_hash = {
    title: "",
    hash: "",
    creator: "",
    unixtime: 0,
    username: "",
    txid: "",
    block: 0,
}