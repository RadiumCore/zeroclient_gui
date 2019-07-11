import * as React from 'react';
import { User, blank_user } from './iUser'

export interface Election {
    id: string;
    title: string;
    hash: string;
    description: string;
    start_block: number;
    end_block: number;
    candidates: candidate[];
    unix_time: number;
    txid: string;
    creator: User;
    username: string;
}

export interface Election_lite {
    title: string;
    description: string;
    start_block: number;
    end_block: number;
    candidates: candidate_lite[];
}

export interface candidate_lite {
    text: string;
}

export interface candidate {
    index: number;
    text: string;
    votes: vote[];
    unix_time?: number;
}

export interface vote {
    index: number;
    id: string;
    creator: User;
    unix_time: number;
}

export const blank_vote: vote = {
    index: 0,
    id: "",
    creator: blank_user,
    unix_time: 0,
}

export const blank_candidate: candidate = {
    index: 0,
    text: "",
    votes: [blank_vote],
    unix_time: 0,
}

export const blank_election: Election = {
    id: "",
    title: "",
    hash: "",
    description: "",
    start_block: 0,
    end_block: 0,
    candidates: [blank_candidate],
    unix_time: 0,
    txid: "",
    creator: blank_user,
    username: "",
}