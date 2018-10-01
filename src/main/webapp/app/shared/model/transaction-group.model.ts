import {ITransaction} from 'app/shared/model//transaction.model';
import {IUserAccount} from 'app/shared/model//user-account.model';

export interface ITransactionGroup {
    id?: number;
    name?: string;
    transactions?: ITransaction[];
    userAccount?: IUserAccount;
}

export class TransactionGroup implements ITransactionGroup {
    constructor(public id?: number, public name?: string, public transactions?: ITransaction[], public userAccount?: IUserAccount) {}
}
