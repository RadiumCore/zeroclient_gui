import * as React from 'react';
export interface DesktopData {
    spendable: number;
    stake: number;
    unconfirmed: number;
    total: number;
    NetworkSynced: boolean;
    NetworkBlock: number;
    WalletConnected: boolean;
    SmartChainBlock: number;
    SmartChainSynced: boolean;
    peercount: number;
    transactions: any;
    EstNetworkBlocks: number;
}

export interface StakingInfo {
    enabled: boolean
    staking: boolean
    weight: number
    netstakeweight: number
}

export interface NetworkStats {
}
export interface ServerInfo {
    administrator: string;
}