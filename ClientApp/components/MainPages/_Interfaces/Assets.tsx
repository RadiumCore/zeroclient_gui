import * as React from 'react';
import { User, blank_user } from './iUser'

export interface AssetClass {
    block: 0,
    unix_time: 0,
    txid: string;

    asset_name: string;
    asset_description: string;
    asset_inherit_name: boolean;
    asset_is_divisible: boolean;
    asset_can_creator_destroy: boolean;
    asset_can_owner_destroy: boolean;
    asset_can_owner_transfer: boolean;

    amount: number;

    class_name: string;
    class_description: string;
    class_can_owner_destroy: boolean;
    class_is_amount_fixed: boolean;
    class_limit_to_owner: boolean;
    class_transferable: boolean;

    transfer_exclusions: string;
    transfer_inclusions: string;

    meta_data: string;

    creator: User;
    owner: User;
}

export const blank_AssetClass: AssetClass = {
    block: 0,
    unix_time: 0,
    txid: "",

    asset_name: "",
    asset_description: "",
    asset_inherit_name: false,
    asset_is_divisible: false,
    asset_can_creator_destroy: false,
    asset_can_owner_destroy: false,
    asset_can_owner_transfer: false,

    amount: 0,

    class_name: "",
    class_description: "",
    class_can_owner_destroy: false,
    class_is_amount_fixed: false,
    class_limit_to_owner: false,
    class_transferable: false,

    transfer_exclusions: "",
    transfer_inclusions: "",

    meta_data: "",

    creator: blank_user,
    owner: blank_user,
}

export interface Asset {
    name: string;
    description: string;
    can_creator_destroy: boolean;
    can_owner_destroy: boolean;
    can_owner_transfer: boolean;
    asset_class?: AssetClass;
    owner: User;
    transfer_inclusions: string;
    transfer_exclusions: string;
    meta_data: string;
    block: 0,
    unix_time: 0,
    txid: string;
    creator: User;
}

export const blank_asset: Asset = {
    name: "",
    description: "",
    can_creator_destroy: false,
    can_owner_destroy: false,
    can_owner_transfer: false,
    transfer_inclusions: "",
    transfer_exclusions: "",
    meta_data: "",
    block: 0,
    unix_time: 0,
    txid: "",
    creator: blank_user,
    owner: blank_user,
}

export interface asset_command {
    asset_id: string,
    command_type: asset_command_type,
    destination?: User,
    amount?: number,
}

export const blank_asset_command: asset_command = {
    asset_id: "",
    command_type: 1
}

export enum asset_command_type {
    transfer = 1,
    destroy = 2,
    send = 3,
}