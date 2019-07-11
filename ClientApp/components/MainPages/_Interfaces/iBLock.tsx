import * as React from 'react';
export interface Block {
    hash: string;
    confirmations: number;
    height: number;
    time: number;
}

export const blank_block: Block = {
    hash: "",
    confirmations: 0,
    height: 0,
    time: 0,
}