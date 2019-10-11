import * as React from 'react';
export interface result {
    sucess: boolean
    message: string
    hex: string
    cost: number
}

export const blank_result: result = {
    sucess: false,
    message: "",
    hex: "",
    cost: 0,
}