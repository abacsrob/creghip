import {ICurrency} from 'app/shared/model//currency.model';
import {ITransactionGroup} from 'app/shared/model//transaction-group.model';

export interface IUserAccount {
    id?: number;
    accountName?: string;
    currency?: ICurrency;
    transactionGroups?: ITransactionGroup[];
}

export class UserAccount implements IUserAccount {
    constructor(
        public id?: number,
        public accountName?: string,
        public currency?: ICurrency,
        public transactionGroups?: ITransactionGroup[]
    ) {}
}
