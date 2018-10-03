import * as moment from 'moment';
import {Moment} from 'moment';
import {ITransactionGroup} from 'app/shared/model//transaction-group.model';
import {IExchangeEntry} from "app/shared/model/exchange-entry.model";
import {DATE_FORMAT} from "app/shared";

export interface ITransaction {
    id?: number;
    amountIn?: number;
    amountOut?: number;
    transactionDate?: Moment;
    remark?: string;
    exchangeEntry?: IExchangeEntry;
    transactionGroup?: ITransactionGroup;
}

export class Transaction implements ITransaction {
    constructor(
        public id?: number,
        public amountIn?: number,
        public amountOut?: number,
        public transactionDate?: Moment,
        public remark?: string,
        public exchangeEntry?: IExchangeEntry,
        public transactionGroup?: ITransactionGroup
    ) {
        let today = new Date();
        let fmt = DATE_FORMAT;
        fmt = fmt.replace('YYYY', today.getFullYear().toString());
        fmt = fmt.replace('MM', (today.getMonth() + 1).toString());
        fmt = fmt.replace('DD', today.getDay().toString());
        this.transactionDate = moment(fmt, DATE_FORMAT);
    }
}
