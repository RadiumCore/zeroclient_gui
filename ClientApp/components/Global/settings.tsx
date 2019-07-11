import * as React from 'react';
import { User, blank_user } from '../MainPages/_Interfaces/iUser'
//const FamilyContext = React.createContext({});
import { ECPair, networks, } from 'radiumjs-lib'
import { Block, blank_block } from '../MainPages/_Interfaces/iBLock'

//export const FamilyProvider = FamilyContext.Provider;
//export const FamilyConsumer = FamilyContext.Consumer;

export var top_block: Block
export function set_network_block(value: Block) {
    top_block = value
    top_block.hash
}
export var sc_top: string
export function set_sc_top(value: string) {
    sc_top = value
}

export var re_render: any
export function set_re_render(value: any) {
    re_render = value
}

export var current_identity: User = blank_user;
export function set_current_identity(u: User) {
    current_identity = u
}
export var private_keypair: any;
export function set_priv_key(k: string) {
    private_keypair = ECPair.fromWIF(k, networks.radium)
    current_identity.pub_key = private_keypair.publicKey.toString('hex');
}
export function clear_current_identity() {
    current_identity = blank_user
}