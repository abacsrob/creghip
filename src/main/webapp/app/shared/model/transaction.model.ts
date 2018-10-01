import {Moment} from 'moment';
import {ITransactionGroup} from 'app/shared/model//transaction-group.model';

export interface ITransaction {
    id?: number;
    amountIn?: number;
    amountOut?: number;
    transactionDate?: Moment;
    transactionGroup?: ITransactionGroup;
}

export class Transaction implements ITransaction {
    constructor(
        public id?: number,
        public amountIn?: number,
        public amountOut?: number,
        public transactionDate?: Moment,
        public transactionGroup?: ITransactionGroup
    ) {}
}
