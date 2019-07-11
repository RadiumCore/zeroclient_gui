import * as React from 'react';

import { ECPair, networks } from 'bitcoinjs-lib'
export interface User {
    username: string;
    description: string;
    address: string;
    type: string;
    company: string;
    streetaddress: string;
    phone: string;
    email: string;
    website: string;
    block: number;
    unixtime: number;
    verified: boolean;
    registration_pending: boolean;
    txid: string
    profile_immage: string;
    custom_fields: customfield[];
    pub_key: string;
}
export interface customfield {
    key: string
    value: string
    index: number
}
export const blank_customfield: customfield = {
    key: "",
    value: "",
    index: 0
}

export const blank_user: User = {
    username: "",
    description: "",
    address: "",
    type: "",
    company: "",
    streetaddress: "",
    phone: "",
    email: "",
    website: "",
    block: 0,
    unixtime: 0,
    verified: false,
    registration_pending: false,
    txid: "",
    profile_immage: "",
    custom_fields: [],
    pub_key: "",
}