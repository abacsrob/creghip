import {IUserAccount} from 'app/shared/model//user-account.model';

export interface ICurrency {
    id?: number;
    currencyName?: string;
    userAccount?: IUserAccount;
}

export class Currency implements ICurrency {
    constructor(public id?: number, public currencyName?: string, public userAccount?: IUserAccount) {}
}
