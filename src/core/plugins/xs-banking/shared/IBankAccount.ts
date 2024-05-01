import * as alt from 'alt-shared'
import { CURENCY_TYPES } from './CurencyTypes'

export interface IBankAccount {
    ownerID?: string
    ownerName?: string
    accountNumber: number
    currentAmmount: number
    currency: CURENCY_TYPES
    permissionName: string
}

export interface IBankTransaction {
    targetAccountNumber: number
    sourceAccountNumber: number
    amount: number
    description: string
    timestamp: Date
}