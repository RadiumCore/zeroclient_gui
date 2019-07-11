import * as React from 'react';
import { string, func } from 'prop-types';

import * as settings from '../../Global/settings'
import * as bitcoin from 'radiumjs-lib'
import { sha256 } from 'js-sha256';
export interface SignedMesage {
    address: string,
    blockhash: string,
    message: string,
    pubkey: string,
    sig: string,
    time: number,
}

export function checkstring(s: string) {
    return s.length === 5;
}

export function format_message(message: string): Buffer {
    const BITCOIN_SIGNED_MESSAGE_HEADER: string = "Bitcoin Signed Message:\n";

    const A: Buffer = new Buffer(1);
    A[0] = BITCOIN_SIGNED_MESSAGE_HEADER.length;

    const B: Buffer = Buffer.from(BITCOIN_SIGNED_MESSAGE_HEADER, 'utf8');
    const C: Buffer = Buffer.concat([A, B])

    const D: Buffer = new Buffer(1);
    const E: Buffer = Buffer.from(message, 'utf8')

    D[0] = E.length;

    const F: Buffer = Buffer.concat([D, E])

    const G: Buffer = Buffer.concat([C, F])

    return G;
}

export function verify_message(message: string, pubkey: string, sig: string): boolean {
    const G: Buffer = format_message(message);
    const hash = sha256(sha256.array(G));
    const keyPair = bitcoin.ECPair.fromPublicKey(Buffer.from(pubkey, 'hex'));
    return keyPair.verify(Buffer.from(hash, 'hex'), Buffer.from(sig, 'base64'));
}

export function sign_message(message: string): string {
    const G: Buffer = format_message(message)
    const hash = sha256(sha256.array(G))
    return settings.private_keypair.sign(Buffer.from(hash, 'hex')).toString("base64")
}

export const blank_SignedMesage: SignedMesage = {
    address: "",
    blockhash: "",
    message: "",
    pubkey: "",
    sig: "",
    time: 0,
}